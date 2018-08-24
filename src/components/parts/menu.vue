<template><div>
 
    <div class="menu">
        <div class="menu_wrapper">
            <router-link  :to="{ name: 'home' }" exact> 
                
                <img src="@/assets/img/svg/logo2.svg" alt="moview" class="menu_logo"> 
            </router-link>
            <div class="menu_control">
                <v-btn v-if="!user" class=" font-weight-bold" color="primary"   round  :to="{ name: 'login' }" exact>Login</v-btn>
                <v-btn v-if="user" class=" font-weight-bold" color="primary"  flat round :to="{ name: 'profile' }" exact>Profile</v-btn>
                <!-- <v-btn v-if="user" class=" font-weight-bold" color="primary" flat  round  @click="logout" exact>Log out</v-btn> -->

            </div>
        </div>
    </div>
  
</div></template>

<script>
import { mapState } from 'vuex';
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    data () {
        return {    
            user: null
        }
    },
    created(){
        // get current user from firebase
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.user = user
            } else {
                this.user = null
            }
        })
        
       
    },

    computed: {
        //get data from store
        ...mapState([
            'like',
        ]),
    },
    methods: {
        // logout current user redirect to login page
        logout(){
            firebase.auth().signOut().then(() => {
                this.$router.push({ name: 'login'})
            })
        },
        // if favorite movie or tv show exist show favourite button
        showItem(){
            let isMovie 
            let isShow
          
            if (localStorage.movieLikes) {
                isMovie = localStorage.movieLikes.length > 2 
            } else isMovie = false
      
            if (localStorage.showLikes) {
                isShow = localStorage.showLikes.length > 2 
            } else isShow = false

            if (isMovie || isShow) {
                return true
            } else return false

        },

    }
}
</script>



<style lang='scss' scoped>
    @import '../../assets/scss/_variables';
    @import '../../assets/scss/parts/_general';
    @import '../../assets/scss/parts/_menu';







</style>
