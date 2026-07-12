import { prisma } from '@config/prisma';
import { ApiError } from '@shared/errors/ApiError';

const listDepartments = async () => {
    const items = await prisma.department.findMany({
        where: { deletedAt: null },
        orderBy: { name: 'asc' },
        select: { id: true, name: true, code: true },
    });

    return items;
};

const listCategories = async () => {
    const items = await prisma.assetCategory.findMany({
        where: { deletedAt: null },
        orderBy: { name: 'asc' },
        select: { id: true, name: true, code: true },
    });

    return items;
};

const getDepartmentById = async (id: string) => {
    const dept = await prisma.department.findUnique({ where: { id } });
    if (!dept || dept.deletedAt) throw new ApiError(404, 'Department not found');
    return dept;
};

export const organizationService = {
    listDepartments,
    listCategories,
    getDepartmentById,
};
