<template><div>

    <div class="menu">
        <div class="menu_wrapper">

                <v-btn flat round :to="{ name: 'movies' }" >
                    <v-icon color="primary"> movie </v-icon>
                    Movies
                </v-btn>
                <v-btn flat round :to="{ name: 'shows' }" >
                    <v-icon color="primary"> desktop_windows </v-icon>
                    TV Shows
                </v-btn>
                <v-btn flat round :to="{ name: 'celebrities' }" >
                    <v-icon color="primary"> person </v-icon>
                    Celebrities
                </v-btn>
                 <v-btn flat v-if="showItem()" color="primary"  round :to="{ name: 'profile' }" >
                    <v-icon color="primary"> star </v-icon>
                    favorite
                </v-btn>

        </div>
    </div>
   
</div></template>

<script>
import { mapState } from 'vuex';


export default {
    data () {
        return {    

        }
    },

    computed: {
        ...mapState([
            'like',
        ]),
        
    },
    methods: {
        // if favorite movie or tv show exist show favourite button
        showItem(){
            let isMovie 
            let isShow
            // check local storage if exist any liked movie
            if (localStorage.movieLikes) {
                isMovie = localStorage.movieLikes.length > 2 
            } else isMovie = false
            // check local storage if exist any liked show
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
@import '../../assets/scss/parts/_submenu';






</style>
