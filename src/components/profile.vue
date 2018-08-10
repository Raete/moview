<template><div id="profile">
    <v-app>
        <app-menu></app-menu>
        <app-submenu></app-submenu>
        <main class="container" :class="{ containerFull: isFull }">
            <section class="container_movies" :class="{ containerItemsFull: isFull }">
                <h3  v-if="like.movieData.length" class="favorite_title">Favorite movies </h3>
                <!-- <div class="item_wrapper">
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
                </div> -->
                <v-list  v-if="like.movieData.length" class="list">
                    <template v-for="(film, index) in  like.movieData">
                        <v-list-tile
                            :key="index"
                            ripple
                            :to="{ name: 'singleMovie', params: { id: film.id } }"
                            class="fav_list_item"
                        >
                            <v-list-tile-avatar>
                                <img class="fav_list_img" v-bind:src="film.poster" alt="">
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title class="fav_list_name">{{film.title}} ({{film.year}}) </v-list-tile-title>
                            
                                <v-list-tile-sub-title  class="fav_list_role">
                                    <template v-for="(tag, index) in  film.genres">
                                    <span :key="index"> {{tag.name}}, </span> 
                                    </template>
                                </v-list-tile-sub-title>
            
                            </v-list-tile-content>
            
                            <v-list-tile-action>
                                <v-list-tile-action-text class="fav_list_rate">
                                    {{film.rate}} 
                                    <v-icon color="primary"> star </v-icon>
                                </v-list-tile-action-text>
                            </v-list-tile-action>

                            <v-list-tile-action>
                                <v-btn icon ripple>
                                    <v-icon @click.prevent="deleteMovie(film.id)">close</v-icon>
                                </v-btn>
                            </v-list-tile-action>

                        </v-list-tile>
                        
                    </template>
                </v-list>
            </section>
            <section class="container_shows" :class="{ containerItemsFull: isFull }">
                <h3  v-if="like.showData.length" class="favorite_title">Favorite TV Shows </h3>
                <!-- <div class="item_wrapper">
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
                </div>  -->
                <v-list  v-if="like.showData.length" class="list">
                    <template v-for="(film, index) in  like.showData">
                        <v-list-tile
                            :key="index"
                            ripple
                            :to="{ name: 'singleShow', params: { id: film.id } }"
                            class="fav_list_item"
                        >
                            <v-list-tile-avatar>
                                <img class="fav_list_img" v-bind:src="film.poster" alt="">
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title class="fav_list_name">{{film.title}} ({{film.year}}) </v-list-tile-title>
                            
                                <v-list-tile-sub-title  class="fav_list_role">
                                    <template v-for="(tag, index) in  film.genres">
                                    <span :key="index"> {{tag.name}}, </span> 
                                    </template>
                                </v-list-tile-sub-title>
            
                            </v-list-tile-content>
            
                            <v-list-tile-action>
                                <v-list-tile-action-text class="fav_list_rate">
                                    {{film.rate}} 
                                    <v-icon color="primary"> star </v-icon>
                                </v-list-tile-action-text>
                            </v-list-tile-action>

                            <v-list-tile-action>
                                <v-btn icon ripple>
                                    <v-icon @click.prevent="deleteShow(film.id)">close</v-icon>
                                </v-btn>
                            </v-list-tile-action>

                        </v-list-tile>
                        
                    </template>
                </v-list>
            </section>
        </main>
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
            tags: [],
            isFull: true
    

        }
    },
    created(){

        this.readStorage()
        this.switchList()


    


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

        // remove movie like
        deleteMovie(id){
            const index = this.like.movieData.findIndex(el => el.id == id)
            this.like.movieData.splice(index, 1)
            // remove like to local storage
            localStorage.setItem('movieLikes',JSON.stringify(this.like.movieData) );
        },
        // remove show like
        deleteShow(id){
            const index = this.like.showData.findIndex(el => el.id == id)
            this.like.showData.splice(index, 1)
            // remove like to local storage
            localStorage.setItem('showLikes',JSON.stringify(this.like.showData) );
        },
        // switch list to full width
        switchList(){
            if(this.like.showData.length && this.like.movieData.length) {
                this.isFull = false
            } else this.isFull = true
        },
    }


}
</script>

<style lang='scss' scoped>
    @import '../assets/scss/_variables';
    @import '../assets/scss/parts/_general';
    @import '../assets/scss/parts/_itemList';

    .container {
        max-width: $width;
        display: flex;
        flex-direction: column;
        &_movies, &_shows {
            width: 100%;
        }

    }

    .favorite_title {
       // text-align: center;
        margin-top: 20px;
    }

    .item_wrapper {
        flex-wrap: wrap;
        justify-content: center;
    }

    .fav_list {
    color: $color_text;
    &_year {
        color: $color_text;
        font-weight: 700;
        font-size: 100%;
    }
    &_item {
        border-bottom: 1px solid darken( $color-bg--light, 20% );
 

    }
    &_rate {
        color: $color_text;
        font-size: 100%;
        min-width: 60px;
        text-align: right
    }
}

.fav_list_role {
    display: inline-block;
}

.fav_list_img {
    height: 100px;
    width: auto;
    border-radius: $radius;
}

//--desktop--
@media screen and (min-width: 750px) {
    .container {
        flex-direction: row; //*column, justify-content: flex-start;
        &_movies, &_shows {
            width: 50%; //* 100%
        }
        &_movies {
            margin-right: 20px;
        }


    }
}
// switch to full width list
.containerFull {
    flex-direction: column;
    justify-content: flex-start;
}

.containerItemsFull {
     width: 100%;
}

</style>
