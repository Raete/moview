import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Login from '@/views/login'
import Movies from '@/views/movies'
import Shows from '@/views/shows'
import Profile from '@/views/profile'

import SingleMovie from '@/views/singlePages/singleMovie'
import SingleShow from '@/views/singlePages/singleShow'
import SingleActor from '@/views/singlePages/singleActor'


Vue.use(Router)

const router = new Router({
   // mode: 'history',
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/',
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
            component: Profile,
            meta: {
                requiresAuth: true
            }
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

// router guards
router.beforeEach((to, from, next) => {
    // check to see if route has auth guard
    if(to.matched.some(rec => rec.meta.requiresAuth)){
      // check auth state of user
      let user = firebase.auth().currentUser
      if (user) {
        // User is signed in. Proceed to route
        next()
      } else {
        // No user is signed in. Redirect to login
        next({
          name: 'login'
        })
      }
    } else {
      // if route is not guarded by auth, proceed
      next()
    }
  })
  
  export default router

  
