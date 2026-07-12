import { type CategoryStatus, type Prisma } from '@prisma/client';
import { prisma } from '@config/prisma';
import { ApiError } from '@shared/errors/ApiError';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryQueryInput,
  CategoryResponseDto,
  PaginatedCategoriesResponse,
  CategoryTreeNode,
  CustomFieldConfig,
} from './asset-categories.types';

const categorySelect = {
  id: true,
  name: true,
  code: true,
  description: true,
  status: true,
  parentCategoryId: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AssetCategorySelect;

type CategoryQueryResult = Prisma.AssetCategoryGetPayload<{ select: typeof categorySelect }>;

const parseDescriptionField = (
  desc: string | null,
): { text: string; customFields: CustomFieldConfig[] } => {
  if (!desc) {
    return { text: '', customFields: [] };
  }
  try {
    const parsed = JSON.parse(desc);
    if (parsed && typeof parsed === 'object' && ('text' in parsed || 'customFields' in parsed)) {
      return {
        text: parsed.text || '',
        customFields: parsed.customFields || [],
      };
    }
  } catch {
    // If not JSON, it is a plain text description
  }
  return { text: desc, customFields: [] };
};

const serializeDescriptionField = (
  text: string | null | undefined,
  customFields: CustomFieldConfig[] | undefined,
): string => {
  return JSON.stringify({
    text: text || '',
    customFields: customFields || [],
  });
};

const formatCategory = (cat: CategoryQueryResult): CategoryResponseDto => {
  const { text, customFields } = parseDescriptionField(cat.description);
  return {
    id: cat.id,
    name: cat.name,
    code: cat.code,
    description: text || null,
    status: cat.status,
    parentCategoryId: cat.parentCategoryId,
    customFields,
    createdAt: cat.createdAt,
    updatedAt: cat.updatedAt,
  };
};

const detectCategoryCycle = async (
  currentId: string,
  newParentId: string | null,
): Promise<boolean> => {
  if (!newParentId) return false;
  if (currentId === newParentId) return true;

  let tempParentId: string | null = newParentId;

  while (tempParentId) {
    const parentRecord: { parentCategoryId: string | null } | null =
      await prisma.assetCategory.findUnique({
        where: { id: tempParentId },
        select: { parentCategoryId: true },
      });

    if (!parentRecord) break;
    if (parentRecord.parentCategoryId === currentId) {
      return true;
    }
    tempParentId = parentRecord.parentCategoryId;
  }

  return false;
};

const createCategory = async (input: CreateCategoryInput): Promise<CategoryResponseDto> => {
  // Unique validations
  const existingName = await prisma.assetCategory.findFirst({
    where: { name: { equals: input.name, mode: 'insensitive' }, deletedAt: null },
  });
  if (existingName) {
    throw new ApiError(400, 'Asset category name must be unique');
  }

  const existingCode = await prisma.assetCategory.findFirst({
    where: { code: { equals: input.code, mode: 'insensitive' }, deletedAt: null },
  });
  if (existingCode) {
    throw new ApiError(400, 'Asset category code must be unique');
  }

  if (input.parentCategoryId) {
    const parent = await prisma.assetCategory.findUnique({
      where: { id: input.parentCategoryId },
    });
    if (!parent || parent.deletedAt) {
      throw new ApiError(404, 'Parent category not found');
    }
  }

  const serializedDescription = serializeDescriptionField(input.description, input.customFields);

  const category = await prisma.assetCategory.create({
    data: {
      name: input.name,
      code: input.code.toUpperCase(),
      description: serializedDescription,
      parentCategoryId: input.parentCategoryId || null,
    },
    select: categorySelect,
  });

  return formatCategory(category);
};

const updateCategory = async (
  id: string,
  input: UpdateCategoryInput,
): Promise<CategoryResponseDto> => {
  const currentCat = await prisma.assetCategory.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      status: true,
      parentCategoryId: true,
    },
  });

  if (!currentCat) {
    throw new ApiError(404, 'Asset category not found');
  }

  // Unique validations
  if (input.name && input.name.toLowerCase() !== currentCat.name.toLowerCase()) {
    const existingName = await prisma.assetCategory.findFirst({
      where: { name: { equals: input.name, mode: 'insensitive' }, deletedAt: null },
    });
    if (existingName) {
      throw new ApiError(400, 'Asset category name must be unique');
    }
  }

  if (input.code && input.code.toUpperCase() !== currentCat.code.toUpperCase()) {
    const existingCode = await prisma.assetCategory.findFirst({
      where: { code: { equals: input.code, mode: 'insensitive' }, deletedAt: null },
    });
    if (existingCode) {
      throw new ApiError(400, 'Asset category code must be unique');
    }
  }

  // Parent & cycle checks
  if (input.parentCategoryId !== undefined) {
    if (input.parentCategoryId) {
      const parent = await prisma.assetCategory.findUnique({
        where: { id: input.parentCategoryId },
      });
      if (!parent || parent.deletedAt) {
        throw new ApiError(404, 'Parent category not found');
      }

      const hasCycle = await detectCategoryCycle(id, input.parentCategoryId);
      if (hasCycle) {
        throw new ApiError(400, 'Cannot set parent category that creates a circular hierarchy');
      }
    }
  }

  // Deactivation check: Block if assets exist under this category
  if (input.status === 'INACTIVE' && currentCat.status === 'ACTIVE') {
    const activeAssetsCount = await prisma.asset.count({
      where: { assetCategoryId: id, status: { notIn: ['RETIRED', 'DISPOSED'] }, deletedAt: null },
    });
    if (activeAssetsCount > 0) {
      throw new ApiError(400, 'Cannot deactivate category with active assets assigned');
    }
  }

  // Handle updated description and customFields
  const existingParsed = parseDescriptionField(currentCat.description);
  const updatedDescriptionText =
    input.description !== undefined ? input.description : existingParsed.text;
  const updatedCustomFields =
    input.customFields !== undefined ? input.customFields : existingParsed.customFields;

  const serializedDescription = serializeDescriptionField(
    updatedDescriptionText,
    updatedCustomFields,
  );

  const updated = await prisma.assetCategory.update({
    where: { id },
    data: {
      name: input.name,
      code: input.code ? input.code.toUpperCase() : undefined,
      description: serializedDescription,
      parentCategoryId: input.parentCategoryId,
      status: input.status,
    },
    select: categorySelect,
  });

  return formatCategory(updated);
};

const getCategories = async (query: CategoryQueryInput): Promise<PaginatedCategoriesResponse> => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: Prisma.AssetCategoryWhereInput = {
    deletedAt: null,
  };

  if (query.status) {
    where.status = query.status;
  }

  if (query.search) {
    const searchLower = query.search.toLowerCase();
    where.OR = [
      { name: { contains: searchLower, mode: 'insensitive' } },
      { code: { contains: searchLower, mode: 'insensitive' } },
    ];
  }

  const [categories, total] = await Promise.all([
    prisma.assetCategory.findMany({
      where,
      select: categorySelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.assetCategory.count({ where }),
  ]);

  return {
    categories: categories.map(formatCategory),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getCategoryById = async (id: string): Promise<CategoryResponseDto> => {
  const cat = await prisma.assetCategory.findUnique({
    where: { id },
    select: categorySelect,
  });

  if (!cat || cat.deletedAt) {
    throw new ApiError(404, 'Asset category not found');
  }

  return formatCategory(cat);
};

const deleteCategory = async (id: string): Promise<void> => {
  const cat = await prisma.assetCategory.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!cat) {
    throw new ApiError(404, 'Asset category not found');
  }

  // Check assets
  const assetsCount = await prisma.asset.count({
    where: { assetCategoryId: id, deletedAt: null },
  });
  if (assetsCount > 0) {
    throw new ApiError(400, 'Cannot delete category with assigned assets');
  }

  await prisma.assetCategory.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

const getCategoryTree = async (): Promise<CategoryTreeNode[]> => {
  // Fetch active categories
  const categories = await prisma.assetCategory.findMany({
    where: { deletedAt: null, status: 'ACTIVE' },
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      status: true,
      parentCategoryId: true,
    },
  });

  const nodeMap = new Map<string, CategoryTreeNode>();

  categories.forEach((cat) => {
    const { customFields } = parseDescriptionField(cat.description);
    nodeMap.set(cat.id, {
      id: cat.id,
      name: cat.name,
      code: cat.code,
      status: cat.status,
      parentCategoryId: cat.parentCategoryId,
      customFields,
      children: [],
    });
  });

  const tree: CategoryTreeNode[] = [];

  nodeMap.forEach((node) => {
    if (node.parentCategoryId) {
      const parent = nodeMap.get(node.parentCategoryId);
      if (parent) {
        parent.children.push(node);
      } else {
        tree.push(node);
      }
    } else {
      tree.push(node);
    }
  });

  return tree;
};

export const assetCategoriesService = {
  createCategory,
  updateCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
  getCategoryTree,
};
