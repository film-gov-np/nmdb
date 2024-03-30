import { BaseAPIUrl } from "../constants/authConstant";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: BaseAPIUrl,
});

//request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

//response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Queue the unauthorized request
      const retryQueue = [];
      retryQueue.push(
        new Promise((resolve, reject) => {
          axiosInstance
            .post("Accounts/refresh-token")
            .then((resp) => {
              if (resp) {
                const { jwtToken } = resp.data.data;
                localStorage.setItem("token", jwtToken);
                originalRequest.headers.Authorization = `Bearer ${jwtToken}`;
                resolve(axiosInstance(originalRequest));
              }
            })
            .catch((err) => {
              reject(err);
            });
        })
      );

      return Promise.all(retryQueue);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
