import api from "../api/axiosConfig";

const webhookAdminService = {
  getAll: () => api.get("/admin/webhooks"),
  create: (data) => api.post("/admin/webhooks", data),
  remove: (id) => api.delete(`/admin/webhooks/${id}`),
  activate: (id) => api.post(`/admin/webhooks/${id}/activate`),
  deactivate: (id) => api.post(`/admin/webhooks/${id}/deactivate`),
  test: (id) => api.post(`/admin/webhooks/${id}/test`),
};

export default webhookAdminService;
