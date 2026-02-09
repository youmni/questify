import api from "../api/axiosConfig";

const progressService = {
  getAll: () => api.get("/progress"),
  getForRoute: (routeId) => api.get(`/progress/routes/${routeId}`),
  startOrResumeRoute: (routeId) => api.post(`/progress/routes/${routeId}`),
};

export default progressService;
