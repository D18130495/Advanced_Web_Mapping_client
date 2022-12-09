import request from '@/utils/request'

export default {
    login(userInfo) {
        return request({
            url: `/api/login/`,
            method: 'post',
            data: userInfo
        })
    },
    logout() {
        return request({
            url: `/api/logout/`,
            method: 'get'
        })
    },
    signup(userInfo) {
        return request({
            url: `/api/signup/`,
            method: 'post',
            data: userInfo
        })
    },
    getCurrentUserInfo() {
        return request({
            url: `/api/getCurrentUserInfo/`,
            method: 'get'
        })
    },
    updateUserProfile(userInfo) {
        return request({
            url: `/api/updateProfile/`,
            method: 'post',
            data: userInfo
        })
    },
    changeUserPassword(userInfo) {
        return request({
            url: `/api/changePassword/`,
            method: 'post',
            data: userInfo
        })
    },



    getUserList() {
        return request({
            url: `/api/users/`,
            method: 'get'
        })
    },

    // addNewUser(formData) {
    //     return request({
    //         url: `/admin/user/addNewUser`,
    //         method: 'post',
    //         params: formData
    //     })
    // },
    // updateUser(formData) {
    //     return request({
    //         url: `/admin/user/updateUser`,
    //         method: 'put',
    //         params: formData
    //     })
    // },
    // deleteUserById(userId) {
    //     return request({
    //         url: `/admin/user/deleteUserById/${userId}`,
    //         method: 'delete'
    //     })
    // },
    // getUserQueryPaginatedList(current, limit, queryForm) {
    //     return request({
    //         url: `/admin/user/getUserQueryPaginatedList/${current}/${limit}`,
    //         method: 'get',
    //         params: queryForm
    //     })
    // }
}
