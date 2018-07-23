<template><div>
    
     
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
                <img src="@/assets/img/svg/logo.svg" alt="moview" class="menu_logo"> 
            </router-link>
            <div class="menu_control">
                <router-link class="menu_control_item " :to="{ name: 'movies' }" exact> Movies </router-link>
                <router-link class="menu_control_item " :to="{ name: 'shows' }" exact> TV Shows </router-link>
                <router-link class="menu_control_item " :to="{ name: 'celebrities' }" exact> Celebrities </router-link>
            </div>
        </div>
    </div>

        <div class="main_container">
            
            <section class="claim_wrapper">
                
                <h1 class="claim">discover new stories</h1>

            </section>
        </div>
    </main>
    
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
@import '../assets/scss/parts/_menu';

.menu {
    background: transparent;
    font-weight: 700;
}



</style>
