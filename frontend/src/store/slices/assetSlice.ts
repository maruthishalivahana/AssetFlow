import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import assetService from '../../services/asset.service';

export interface Asset {
    id: string;
    assetTag: string;
    name: string;
    serialNumber?: string;
    status?: string;
    condition?: string;
    files?: any[];
}

interface AssetsState {
    items: Asset[];
    selected?: Asset | null;
    loading: boolean;
    error?: string | null;
    total: number;
    page: number;
    limit: number;
}

const initialState: AssetsState = {
    items: [],
    selected: null,
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 20,
};

export const fetchAssets = createAsyncThunk('assets/fetch', async (params: Record<string, any> | undefined, { rejectWithValue }) => {
    try {
        const data = await assetService.getAssets(params);
        return data;
    } catch (err: any) {
        return rejectWithValue(err?.response?.data || err.message);
    }
});

export const fetchAsset = createAsyncThunk('assets/fetchOne', async (id: string, { rejectWithValue }) => {
    try {
        const data = await assetService.getAsset(id);
        return data;
    } catch (err: any) {
        return rejectWithValue(err?.response?.data || err.message);
    }
});

export const createAsset = createAsyncThunk('assets/create', async ({ payload, files }: any, { rejectWithValue }) => {
    try {
        const data = await assetService.createAsset(payload, files);
        return data;
    } catch (err: any) {
        return rejectWithValue(err?.response?.data || err.message);
    }
});

export const updateAsset = createAsyncThunk('assets/update', async ({ id, payload, files }: any, { rejectWithValue }) => {
    try {
        const data = await assetService.updateAsset(id, payload, files);
        return data;
    } catch (err: any) {
        return rejectWithValue(err?.response?.data || err.message);
    }
});

export const removeAsset = createAsyncThunk('assets/remove', async (id: string, { rejectWithValue }) => {
    try {
        const data = await assetService.deleteAsset(id);
        return { id, data };
    } catch (err: any) {
        return rejectWithValue(err?.response?.data || err.message);
    }
});

const slice = createSlice({
    name: 'assets',
    initialState,
    reducers: {
        clearSelected: (state) => {
            state.selected = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAssets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssets.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.items = action.payload.items || [];
                state.total = action.payload.total || 0;
                state.page = action.payload.page || 1;
                state.limit = action.payload.limit || state.limit;
            })
            .addCase(fetchAssets.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to load assets';
            })

            .addCase(fetchAsset.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAsset.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.selected = action.payload;
            })
            .addCase(fetchAsset.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to load asset';
            })

            .addCase(createAsset.pending, (state) => {
                state.loading = true;
            })
            .addCase(createAsset.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.items.unshift(action.payload);
                state.total += 1;
            })
            .addCase(createAsset.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to create asset';
            })

            .addCase(updateAsset.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateAsset.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const idx = state.items.findIndex((i) => i.id === action.payload.id);
                if (idx >= 0) state.items[idx] = action.payload;
                if (state.selected?.id === action.payload.id) state.selected = action.payload;
            })
            .addCase(updateAsset.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to update asset';
            })

            .addCase(removeAsset.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeAsset.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.items = state.items.filter((i) => i.id !== action.payload.id);
                state.total = Math.max(0, state.total - 1);
            })
            .addCase(removeAsset.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to delete asset';
            });
    },
});

export const { clearSelected } = slice.actions;

export default slice.reducer;
