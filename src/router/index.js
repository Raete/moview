import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Login from '@/components/login'
import Movies from '@/components/movies'
import Shows from '@/components/shows'
import Profile from '@/components/profile'
import Celebrities from '@/components/celebrities'
import SingleMovie from '@/components/singlePages/singleMovie'
import SingleShow from '@/components/singlePages/singleShow'
import SingleActor from '@/components/singlePages/singleActor'


Vue.use(Router)

export default new Router({
  //  mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: Login
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
            path: '/profile',
            name: 'profile',
            component: Profile
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
    scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 }
    },
//   scrollBehavior: function(to, from, savedPosition) {
//     if (to.hash) {
//         return {
//             selector: to.hash
    
//           }
//     } else {
//         return { x: 0, y: 0 }
//     }
// },
})
