<template><div>
   
    <nav>
        <div class="menu_wrapper">
            <!-- logo -->
            <router-link  :to="{ name: 'movies' }" exact> 
                <img src="@/assets/img/svg/logo.svg" alt="moview" class="menu_logo"> 
            </router-link>
            <!-- menu -->
            <div class="menu_controls">
                <v-btn class="menu_item" flat round :to="{ name: 'movies' }" exact > Movies </v-btn>
                <v-btn class="menu_item" flat round  :to="{ name: 'shows' }" exact> TV Shows </v-btn>
                <!-- <v-btn class="menu_item" flat round  :to="{ name: 'celebrities' }" > Celebrities </v-btn> -->
                <!-- login/profile button -->
                <v-btn  v-if="!user" class=" menu_item font-weight-bold" color="primary" round  :to="{ name: 'login' }" exact>Login</v-btn>
                <v-btn v-if="user" class=" menu_item font-weight-bold" color="primary" flat round  :to="{ name: 'profile' }" exact>Profile</v-btn>
            </div>
        </div>
    </nav>
   
</div></template>

<script>
    // firebase
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
    }
</script>



<style lang='scss' scoped>
    @import '../../assets/scss/_variables';
    @import '../../assets/scss/parts/_general';
    @import '../../assets/scss/parts/_menu';
</style>
