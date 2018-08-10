<template><div>
    <v-app>
    
     
    <main v-for="(item, index) in randomImg" :key="index"  class="main"
        v-bind:style="{ 
            backgroundImage: 'url(' + item.img + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }"      
    >
    <div class="menu">
        <div class="menu_wrapper">
            <router-link  :to="{ name: 'home' }" exact> 
                
                <img src="@/assets/img/svg/logo2.svg" alt="moview" class="menu_logo"> 
            </router-link>
            <div class="menu_control">
                <v-btn class="secondary--text" large round color="primary" :to="{ name: 'login' }" exact>Login</v-btn>
               

            </div>
        </div>
    </div>

        <div class="main_container">
            
            <section class="claim_wrapper">
                
                <h1 class="claim font-weight-black">discover <br>new stories</h1>
                <v-btn  round large class="claim_btn secondary--text" color="primary" :to="{ name: 'movies' }" exact> start now </v-btn>
                 


            </section>
             

        </div>
    </main>
    </v-app>
</div></template>

<script>
import menu from '../components/parts/menu.vue';
export default {
    components: {
        'app-menu': menu,
    },
    data () {
        return {
            backgroundImage: [
                { img: require('../assets/img/homeBack.jpg')},
                { img: require('../assets/img/homeBack2.jpg')},
                { img: require('../assets/img/homeBack3.jpg')},
                { img: require('../assets/img/homeBack4.jpg')},
                { img: require('../assets/img/homeBack5.jpg')},
            ], 
        }
    },
    computed: {
        randomImg() {
            return this.backgroundImage = _.shuffle(this.backgroundImage).slice(0,1) 
        },
    },
}
</script>


<style lang='scss' scoped>
    @import '../assets/scss/_variables';
    @import '../assets/scss/parts/_general';
    @import '../assets/scss/_home';

</style>
