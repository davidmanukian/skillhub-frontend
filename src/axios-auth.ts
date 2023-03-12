import axios from 'axios'
import {Constants} from "@/constants";

const instance = axios.create({
  baseURL: Constants.URL
})

instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("user")

  if (token != null) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, function (err) {
  return Promise.reject(err);
});

export default instance

