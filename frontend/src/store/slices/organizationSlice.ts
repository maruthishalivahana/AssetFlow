import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { organizationService } from '../../services/organization.service';
import type { 
    Department, 
    AssetCategory,
    CreateDepartmentInput,
    UpdateDepartmentInput,
    CreateCategoryInput,
    UpdateCategoryInput
} from '../../types/organization';
import { getApiErrorMessage } from '../../services/api';

interface OrganizationState {
    departments: Department[];
    categories: AssetCategory[];
    isLoading: boolean;
    error: string | null;
}

const initialState: OrganizationState = {
    departments: [],
    categories: [],
    isLoading: false,
    error: null,
};

// Department Thunks
export const fetchDepartments = createAsyncThunk(
    'organization/fetchDepartments',
    async (params: { page?: number; limit?: number; search?: string; status?: string } | undefined, { rejectWithValue }) => {
        try {
            const response = await organizationService.getDepartments(params);
            return response.departments;
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error));
        }
    }
);

export const createDepartment = createAsyncThunk(
    'organization/createDepartment',
    async (data: CreateDepartmentInput, { rejectWithValue }) => {
        try {
            return await organizationService.createDepartment(data);
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error));
        }
    }
);

export const updateDepartment = createAsyncThunk(
    'organization/updateDepartment',
    async ({ id, data }: { id: string; data: UpdateDepartmentInput }, { rejectWithValue }) => {
        try {
            return await organizationService.updateDepartment(id, data);
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error));
        }
    }
);

export const deleteDepartment = createAsyncThunk(
    'organization/deleteDepartment',
    async (id: string, { rejectWithValue }) => {
        try {
            await organizationService.deleteDepartment(id);
            return id;
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error));
        }
    }
);

// Category Thunks
export const fetchCategories = createAsyncThunk(
    'organization/fetchCategories',
    async (params: { page?: number; limit?: number; search?: string; status?: string } | undefined, { rejectWithValue }) => {
        try {
            const response = await organizationService.getCategories(params);
            return response.categories;
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error));
        }
    }
);

export const createCategory = createAsyncThunk(
    'organization/createCategory',
    async (data: CreateCategoryInput, { rejectWithValue }) => {
        try {
            return await organizationService.createCategory(data);
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error));
        }
    }
);

export const updateCategory = createAsyncThunk(
    'organization/updateCategory',
    async ({ id, data }: { id: string; data: UpdateCategoryInput }, { rejectWithValue }) => {
        try {
            return await organizationService.updateCategory(id, data);
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error));
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'organization/deleteCategory',
    async (id: string, { rejectWithValue }) => {
        try {
            await organizationService.deleteCategory(id);
            return id;
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error));
        }
    }
);

const organizationSlice = createSlice({
    name: 'organization',
    initialState,
    reducers: {
        clearOrganizationError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Departments
            .addCase(fetchDepartments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.departments = action.payload;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create Department
            .addCase(createDepartment.fulfilled, (state, action) => {
                state.departments.unshift(action.payload);
            })
            // Update Department
            .addCase(updateDepartment.fulfilled, (state, action) => {
                const index = state.departments.findIndex(d => d.id === action.payload.id);
                if (index !== -1) {
                    state.departments[index] = action.payload;
                }
            })
            // Delete Department
            .addCase(deleteDepartment.fulfilled, (state, action) => {
                state.departments = state.departments.filter(d => d.id !== action.payload);
            })

            // Fetch Categories
            .addCase(fetchCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create Category
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categories.unshift(action.payload);
            })
            // Update Category
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            // Delete Category
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(c => c.id !== action.payload);
            });
    }
});

export const { clearOrganizationError } = organizationSlice.actions;
export default organizationSlice.reducer;
