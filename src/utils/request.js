import axios from "axios"

// create an axios instance
const service = axios.create({
    url: 'http://127.0.0.1:8000',
    crossdomain: true,
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 50000
})

// request interceptor
service.interceptors.request.use(
    // config => {
    //     },
    // error => {
    // }
)

// response interceptor
service.interceptors.response.use(
    // response => {
    // },
    // error => {
    // }
)

export default service
