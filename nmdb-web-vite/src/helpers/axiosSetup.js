import { ApiPaths } from "@/constants/apiPaths";
import { BaseAPIUrl } from "@/constants/authConstant";
import axios from "axios";


const refreshUrl = ApiPaths.Path_Auth + "/refresh";
const axiosInstance = axios.create({
  baseURL: BaseAPIUrl,
});
const refreshInstance = axios.create({
  baseURL: BaseAPIUrl,
});

//request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token && !config.url.includes(refreshUrl)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};


//response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      return new Promise(function (resolve, reject) {
        const postData = { refreshToken: refreshToken };
        refreshInstance.post(refreshUrl, postData)
          .then(({ data }) => {
            const {
              jwtToken,
              refreshToken
            } = data.data;
            const newToken = jwtToken;
            localStorage.setItem('token', newToken);
            localStorage.setItem('refreshToken', refreshToken);
            processQueue(null, newToken);
            resolve(axiosInstance(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
