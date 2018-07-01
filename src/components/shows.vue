<template><div>
    <v-app class="index">  
    <app-header></app-header>
        <section class="filters">
            <div class="filters_wrapper">
                <div class="filters_item filters_years">
                    <v-select
                        :items="years"
                    
                        label="Year"
                        item-value="text"
                    ></v-select>
                </div>
                <div class="filters_item filters_sort">
                    <v-select
                        :items="sort"
                    
                        label="Sort by"
                        item-value="text"
                    ></v-select>
                </div>
                <div class="filters_item filters_genres">
                    <v-select
                        :items="genres"                 
                        label="Genres"
                        item-text="name"
                        item-value="name"
                        multiple
                        chips
                        max-height="auto"
                        autocomplete 
                    >
                        <template slot="selection" slot-scope="data">
                            <v-chip
                                :selected="data.selected"
                                :key="JSON.stringify(data.item)"
                                close
                                class="chip--select-multi"
                                @input="data.parent.selectItem(data.item)"
                            >
                                {{ data.item.name }}
                            </v-chip>
                        </template>
                        <template slot="item" slot-scope="data">     
                            <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                        </template>
                    </v-select>
                </div>
            </div>
        </section>
        <section class="item_container">
            <div class="item_wrapper"><!-- film list -->    
                <div class="item" v-for="(film, index) in films" :key="index">
                     <router-link :to="{ name: 'singleShow' }"> 
                    <figure class="item_content">
                        <span class="item_rate">{{film.rate}}</span>
                        <img class="item_img" v-bind:src="film.img" alt="">
                        <figcaption class="item_hover">
                            <img class="item_hover_ico" src="../assets/img/svg/plus.svg" alt="">
                        </figcaption>           
                    </figure>
                    </router-link>
                    <h1 class="item_name"> {{film.title}}  </h1>
                </div>
            </div> <!-- END film list wrapper -->
        </section>
    </v-app>
    <app-footer></app-footer>

</div></template>

<script>
import header from '../components/header.vue';
import footer from '../components/footer.vue';

export default {
    components: {
        'app-header': header,
        'app-footer': footer,
    },
    name: 'home',
    data () {
        return {
            genres: [
                { name: 'action' },
                { name: 'adventure'},
                { name: 'animation'},
                { name: 'comedy'},
                { name: 'crime'},
                { name: 'documentary'},
                { name: 'drama'},
                { name: 'family'},
                { name: 'fantasy'},
                { name: 'history'},
                { name: 'horror'},
            ],
            years: [
               '2018','2017','2016','2015','2014', 
            ],
            sort: [
               'Popular','Top Rated'
            ],
            films: [
                { 
                    img: require('../assets/img/posters/3.jpg'), 
                    title: '3%',
                    rate: '80%'
                },
                { 
                    img: require('../assets/img/posters/black_mirror.jpg'), 
                    title: 'Black Mirror',
                    rate: '84%'
                },
                { 
                    img: require('../assets/img/posters/breaking_bad.jpg'),  
                    title: 'Breaking Bad',
                    rate: '57%'
                },
                { 
                    img: require('../assets/img/posters/dark.jpg'),  
                    title: 'Dark',
                    rate: '38%'
                },
                { 
                    img: require('../assets/img/posters/dexter.jpg'), 
                    title: 'Dexter',
                    rate: '87%'
                },
               
            ],
            
        }
    }
}
</script>


<style lang='scss'>
@import '../assets/scss/_variables';
@import '../assets/scss/_filters';
@import '../assets/scss/_itemList';




</style>
