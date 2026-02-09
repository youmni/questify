import api from "../api/axiosConfig";

const paintingService = {
  getDetails: (paintingId) => api.get(`/museums/paintings/${paintingId}`),
};

export default paintingService;
