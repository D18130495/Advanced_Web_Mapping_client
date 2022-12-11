import axios from "axios"

import token from "@/store/token"
import userApi from "@/api/user"

// create an axios instance
const service = axios.create({
    baseURL: 'https://www.awm2023.site',
    crossdomain: true,
    timeout: 50000
})

// request interceptor
service.interceptors.request.use(
config => {
        const auth = 'Token ' + token.get()
        config.headers['Authorization'] = auth // set token to header
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
    error => { // handle token expired
        if(error.response.status === 401) {
            this.$message({
                message: 'Your login has expired, Please login again',
                type: 'warning'
            })

            userApi.logout()
                .then(response => {
                    console.log(response)
                    token.clear()
                    location.reload()
                }).catch(error => {
                    console.log(error)
                })
        }

        return Promise.reject(error)
    }
)

export default service
