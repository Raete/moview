<template><div id="profile">
    <v-app>
        <app-menu></app-menu>
        <app-submenu></app-submenu>
        <h3 v-if="like.movieData.length" class="favorite_title">Favourite movies </h3>
        <div class="item_wrapper">
            <div class="item" v-for="(film, index) in like.movieData" :key="index">
                <router-link :to="{ name: 'singleMovie', params: { id: film.id } }"> 
                    <app-itemList>
                        <template slot="rate">{{film.rate}} </template>
                        <template slot="year">{{film.year}} </template>
                        <img slot="img" class="item_img" v-bind:src="film.poster" alt="">
                    </app-itemList>
                </router-link>
                <h1 class="item_name"> {{film.title}} </h1>
            </div>
        </div>
        <h3 v-if="like.showData.length" class="favorite_title">Favourite TV Shows </h3>
        <div class="item_wrapper">
            <div class="item" v-for="(film, index) in like.showData" :key="index">
                <router-link :to="{ name: 'singleShow', params: { id: film.id } }"> 
                    <app-itemList>
                        <template slot="rate">{{film.rate}} </template>
                        <template slot="year">{{film.year}} </template>
                        <img slot="img" class="item_img" v-bind:src="film.poster" alt="">
                    </app-itemList>
                </router-link>
                <h1 class="item_name"> {{film.title}} </h1>
            </div>
        </div>
        <h3 v-if="like.showData.length" class="favorite_title">random </h3>
        <div class="item_wrapper">
            <div class="item" v-for="(film, index) in like.showData" :key="index">
                <router-link :to="{ name: 'singleShow', params: { id: film.id } }"> 
                    <app-itemList>
                        <template slot="rate">{{film.rate}} </template>
                        <template slot="year">{{film.year}} </template>
                        <img slot="img" class="item_img" v-bind:src="film.poster" alt="">
                    </app-itemList>
                </router-link>
                <h1 class="item_name"> {{film.title}} </h1>
            </div>
        </div>
    </v-app>
    <app-footer></app-footer>
</div></template>

<script>
import menu from '../components/parts/menu.vue';
import subMenu from '../components/parts/subMenu.vue';
import itemList from '../components/templates/itemList.vue';
import footer from '../components/parts/footer.vue';
import axios from 'axios';
import { mapState, mapMutations } from 'vuex';


export default {
    components: {
        'app-menu': menu,
        'app-submenu': subMenu,
        'app-itemList': itemList,
        'app-footer': footer,
    },


    name: 'profile',
    data () {
        return {
    

        }
    },
    created(){

        this.readStorage()



    },
    computed: {
        //get data from store
        ...mapState([
            'URL',
            'holder',
            'detail',
            'like',
            'box',
            'is',
        ]),
    },

    methods: {
        ...mapMutations([
            'readStorage',
        ]),

    }


}
</script>

<style lang='scss' scoped>
    @import '../assets/scss/_variables';
    @import '../assets/scss/parts/_general';
    @import '../assets/scss/parts/_itemList';

    .favorite_title {
        text-align: center;
        margin-top: 20px;
    }

    .item_wrapper {
        flex-wrap: wrap;
        justify-content: center;
    }




</style>
