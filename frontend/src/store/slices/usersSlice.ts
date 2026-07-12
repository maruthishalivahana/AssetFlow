import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { usersService } from '../../services/users.service';
import { AuthUser } from '../../types/auth';
import { CreateUserInput, UpdateUserInput } from '../../types/user';

interface UsersState {
  items: AuthUser[];
  loading: boolean;
  error?: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: UsersState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params?: { page?: number; limit?: number; search?: string; role?: string; departmentId?: string }) => {
    return await usersService.getUsers(params);
  }
);

export const createEmployee = createAsyncThunk(
  'users/createEmployee',
  async (payload: CreateUserInput) => {
    return await usersService.createEmployee(payload);
  }
);

export const updateEmployee = createAsyncThunk(
  'users/updateEmployee',
  async ({ id, payload }: { id: string; payload: UpdateUserInput }) => {
    return await usersService.updateEmployee(id, payload);
  }
);

export const deleteEmployee = createAsyncThunk(
  'users/deleteEmployee',
  async (id: string) => {
    await usersService.deleteEmployee(id);
    return id;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.users || (action.payload as any).data || action.payload; // accommodate different backend structures temporarily
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.items.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.items = state.items.filter(u => u.id !== action.payload);
        state.total -= 1;
      });
  },
});

export const usersReducer = usersSlice.reducer;
