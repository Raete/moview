import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Movies from '@/components/movies'
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
        path: '/movies',
        name: 'movies',
        component: Movies
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
        path: '/singleMovie/:id',
        name: 'singleMovie',
        component: SingleMovie
    },
    {
        path: '/singleShow/:id',
        name: 'singleShow',
        component: SingleShow
    },
    {
        path: '/singleActor/:id',
        name: 'singleActor',
        component: SingleActor
    }
  ],
  scrollBehavior: function(to, from, savedPosition) {
    if (to.hash) {
        return {
            selector: to.hash
    
          }
    } else {
        return { x: 0, y: 0 }
    }
},
})
