import api from './api';

// helper to construct file download URL (uploads are served at /uploads on the backend host)
const getDownloadUrl = (filePath: string) => {
    const rawBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    let url = rawBase.trim();
    if (url.endsWith('/')) url = url.slice(0, -1);
    // if env includes /api suffix, strip it as uploads are mounted at /uploads
    if (url.endsWith('/api')) url = url.slice(0, -4);
    return `${url}/uploads/${encodeURIComponent(filePath)}`;
};

export interface CreateAssetPayload {
    name: string;
    assetCategoryId: string;
    departmentId: string;
    serialNumber?: string;
    description?: string;
    purchaseDate?: string;
    purchaseCost?: number;
    isBookable?: boolean;
    condition?: string;
}

const createAsset = async (payload: CreateAssetPayload, files?: File[]) => {
    const form = new FormData();

    Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined && v !== null) form.append(k, String(v));
    });

    if (files && files.length) {
        files.forEach((f) => form.append('files', f));
    }

    const res = await api.post('/assets', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data;
};

const getAssets = async (params?: Record<string, any>) => {
    const res = await api.get('/assets', { params });
    return res.data.data;
};

const getAsset = async (id: string) => {
    const res = await api.get(`/assets/${id}`);
    return res.data.data;
};

const updateAsset = async (id: string, payload: Partial<CreateAssetPayload>, files?: File[]) => {
    const form = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined && v !== null) form.append(k, String(v));
    });
    if (files && files.length) files.forEach((f) => form.append('files', f));

    const res = await api.patch(`/assets/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data;
};

const deleteAsset = async (id: string) => {
    const res = await api.delete(`/assets/${id}`);
    return res.data.data;
};

export const assetService = {
    createAsset,
    getAssets,
    getAsset,
    updateAsset,
    deleteAsset,
    getDownloadUrl,
};

export default assetService;
