import Vue from 'vue'
import  VueRouter from 'vue-router'

import token from "@/store/token"

import Index from "@/views/Index"
import Home from "@/views/Home"
import Login from "@/views/Login"
import Signup from "@/views/SIgnup"

import Map from "@/views/Map"

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
            },
            children: [
                {
                    path: '',
                    name: 'Home',
                    component: Home,
                    meta: {
                        requireLogin: false
                    }
                },
                {
                    path: '/login',
                    name: 'Login',
                    component: Login,
                    meta: {
                        requireLogin: false
                    }
                },
                {
                    path: '/signup',
                    name: 'Signup',
                    component: Signup,
                    meta: {
                        requireLogin: false
                    }
                },
                {
                    path: '/map',
                    name: 'Map',
                    component: Map,
                    meta: {
                        requireLogin: true
                    }
                }
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    if(token.get()) {
        if(to.path === '/' || to.path  === '/login' || to.path  === '/signup'){
            next('/map')
        }else {
            next()
        }
    }else {
        if(to.path === '/'){
            next()
        }else{
            next('/')
        }
    }
})

export default router
