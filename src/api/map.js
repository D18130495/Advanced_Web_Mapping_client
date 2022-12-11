import request from '@/utils/request'

export default {
    updateLocation(location) {
        return request({
            url: `/api/updateLocation/`,
            method: 'post',
            data: location
        })
    },
    queryOverpass(query) {
        return request({
            url: `/api/queryOverpass/`,
            method: 'post',
            data: query
        })
    }
}
