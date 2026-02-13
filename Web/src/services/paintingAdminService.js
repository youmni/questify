import api from "../api/axiosConfig";

const paintingAdminService = {
  getAll: () => api.get("/admin/paintings"),
  getById: (id) => api.get(`/admin/paintings/${id}`),
  getByMuseum: (museumId) => api.get(`/admin/paintings/museum/${museumId}`),
  create: (data) => api.post("/admin/paintings", data),
  update: (id, data) => api.put(`/admin/paintings/${id}`, data),
  remove: (id) => api.delete(`/admin/paintings/${id}`),
  addHint: (paintingId, data) => api.post(`/admin/paintings/${paintingId}/hints`, data),
};

export default paintingAdminService;
