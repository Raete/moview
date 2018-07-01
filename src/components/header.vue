<template><div>

    <main v-for="(item, index) in randomImg" :key="index"  class="main" 
        v-bind:style="{ 
            backgroundImage: 'url(' + item.img + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }"      
    >
    
        <div class="main_container">
            <img src="@/assets/img/svg/logo.svg" alt="moview" class="logo">
            <section class="claim_wrapper">
                
                <h1 class="claim">discover new stories</h1>
                <div class="search">
                    <input type="text" class="search_input">
                    <img src="@/assets/img/svg/search.svg" alt="search" class="search_icon">
                </div>
            </section>
        </div>
        <span class="arrow">
            <i class="material-icons">
                expand_more
            </i>
        </span>
    </main>
    <v-toolbar color="white" flat>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-btn flat :to="{ name: 'home' }" exact> Movies</v-btn>
            <v-btn flat :to="{ name: 'shows' }" exact>TV Shows</v-btn>
            <v-btn flat :to="{ name: 'celebrities' }" exact>Celebrities</v-btn>
        </v-toolbar-items>
        <v-spacer></v-spacer>
    </v-toolbar>
</div></template>

<script>

export default {
    name: 'app_header',
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
@import '../assets/scss/_searchHeader';



</style>
