import Vue from 'vue'

import  VueRouter from 'vue-router'

import Index from "../views/Index"
// import Map from "../views/Map"

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes:[
        {
            path: '/',
            name: 'Index',
            component: Index,
            meta: {
                requireLogin: false
            }
        },
        // {
        //     path: '/map',
        //     name: 'Map',
        //     component: Map,
        //     meta: {
        //         requireLogin: false
        //     }
        // }
    ]
})

export default router
