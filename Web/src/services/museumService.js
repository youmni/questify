import api from "../api/axiosConfig";

const museumService = {
  getAll: () => api.get("/museums"),
  getById: (id) => api.get(`/museums/${id}`),
  getRouteDetails: (museumId, routeId) =>
    api.get(`/museums/${museumId}/routes/${routeId}`),
};

export default museumService;
