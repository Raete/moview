import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
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

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/home',
            name: 'home',
            component: Home
        },
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

  
