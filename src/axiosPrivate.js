import axios from "axios";
const axiosPrivate = axios.create({})
axiosPrivate.interceptors.request.use(config => {
    if (!config.headers.authorization) {
        config.headers.authorization = `Barer ${localStorage.getItem("token")}`
    }
    return config
}, err => {
    return Promise.reject(err)
})
export default axiosPrivate