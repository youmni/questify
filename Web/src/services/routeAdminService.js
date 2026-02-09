import api from "../api/axiosConfig";

const routeAdminService = {
  getAll: () => api.get("/admin/routes"),
  getById: (id) => api.get(`/admin/routes/${id}`),
  getByMuseum: (museumId) => api.get(`/admin/routes/museum/${museumId}`),
  create: (data) => api.post("/admin/routes", data),
  update: (id, data) => api.put(`/admin/routes/${id}`, data),
  remove: (id) => api.delete(`/admin/routes/${id}`),
  activate: (id) => api.post(`/admin/routes/${id}/activate`),
  deactivate: (id) => api.post(`/admin/routes/${id}/deactivate`),
};

export default routeAdminService;
