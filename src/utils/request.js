import axios from "axios"

import token from "@/store/token"
// import userApi from "@/api/user"

// create an axios instance
const service = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    // url: 'http://127.0.0.1:8000',
    crossdomain: true,
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 50000
})

// request interceptor
service.interceptors.request.use(
config => {
        const auth = 'Token ' + token.get()
        config.headers['Authorization'] = auth
        return config
    },
error => {
        console.log('There are some problems with this request')
        console.log(error)
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if(error.response.status === 401) {
            // userApi.logout()
            //     .then(response => {
            //         console.log(response.data)
            //
            //     }).catch(error => {
            //         console.log(error)
            //     })
            // token.clear()
            // location.reload()
        }

        return Promise.reject(error)
    }
)

export default service
