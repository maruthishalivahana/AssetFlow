import api from './api';

const getDepartments = async () => {
    const res = await api.get('/organization/departments');
    return res.data.data;
};

const getCategories = async () => {
    const res = await api.get('/organization/categories');
    return res.data.data;
};

export const organizationService = {
    getDepartments,
    getCategories,
};

export default organizationService;
