import api from "../api/axiosConfig";

const verificationService = {
  verifyPainting: (routeId, paintingId, file) => {
    const formData = new FormData();
    formData.append("image", file);

    return api.post(
      `/verify/routes/${routeId}/paintings/${paintingId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};

export default verificationService;
