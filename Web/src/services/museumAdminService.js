import api from "../api/axiosConfig";

const museumAdminService = {
  getAll: () => api.get("/admin/museums"),
  getById: (id) => api.get(`/admin/museums/${id}`),
  create: (data) => api.post("/admin/museums", data),
  update: (id, data) => api.put(`/admin/museums/${id}`, data),
  remove: (id) => api.delete(`/admin/museums/${id}`),
  activate: (id) => api.post(`/admin/museums/${id}/activate`),
  deactivate: (id) => api.post(`/admin/museums/${id}/deactivate`),
};

export default museumAdminService;
