import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Shows from '@/components/shows'
import Celebrities from '@/components/celebrities'
import SingleMovie from '@/components/singleMovie'
import SingleShow from '@/components/singleShow'
import SingleActor from '@/components/singleActor'

Vue.use(Router)

export default new Router({
  routes: [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/shows',
        name: 'shows',
        component: Shows
    },
    {
        path: '/celebrities',
        name: 'celebrities',
        component: Celebrities
    },
    {
        path: '/singleMovie',
        name: 'singleMovie',
        component: SingleMovie
    },
    {
        path: '/singleShow',
        name: 'singleShow',
        component: SingleShow
    },
    {
        path: '/singleActor',
        name: 'singleActor',
        component: SingleActor
    }
  ]
})
