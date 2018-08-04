<template><div>
 
    <div class="menu">
        <div class="menu_wrapper">
            <router-link  :to="{ name: 'home' }" exact> 
                <img src="@/assets/img/svg/logo.svg" alt="moview" class="menu_logo"> 
            </router-link>
            <div class="menu_control">
               
            </div>
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
    computed(){
       
    },

    computed: {
        //get data from store
        ...mapState([
            'like',
        ]),
    },
    methods: {
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
