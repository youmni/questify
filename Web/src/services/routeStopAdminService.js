import api from "../api/axiosConfig";

const routeStopAdminService = {
  getByRoute: (routeId) => api.get(`/admin/route-stops/route/${routeId}`),
  addToRoute: (routeId, data) => api.post(`/admin/route-stops/route/${routeId}`, data),
  remove: (routeStopId) => api.delete(`/admin/route-stops/${routeStopId}`),
  updateSequence: (routeStopId, sequenceNumber) =>
    api.patch(`/admin/route-stops/${routeStopId}/sequence`, null, {
      params: { sequenceNumber },
    }),
  reorder: (routeId, orderedIds) =>
    api.put(`/admin/route-stops/route/${routeId}/reorder`, orderedIds),
};

export default routeStopAdminService;
