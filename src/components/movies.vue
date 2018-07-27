<template><div>
    <v-app class="index">
      <app-menu></app-menu>
        <!-- loading -->
        <div class="loading" v-if="loading">
            <img src="@/assets/img/svg/loader.svg" alt="loading..." >
            </div>
        <!-- filters -->
        <section class="filters">
            <div class="filters_wrapper">
                <!-- search filter -->
                <div class="filters_search">
                    <v-autocomplete
                        :loading="searchInput.loading"
                        :items="searchInput.items"
                        :search-input.sync="search"
                        v-model="searchInput.select"
                        cache-items
                        flat
                        hide-no-data
                        hide-details
                        clearable
                        prepend-icon="search"
                        label="Search movies"
                    ></v-autocomplete>
                </div>
                <!-- year filter -->
                <div class="filters_year">
                
                    <v-select
                        v-model="selectYear"
                        :items="items.years"
                        :search-input.sync="selectYear"
                        label="Select year"
                        prepend-icon="event"
                        hide-details
                    ></v-select>
               
                </div>
                <!-- genres filter -->
                <div class="filters_genres">
                    <v-autocomplete
                        :items="items.genres" 
                        v-model="selectGenres"                 
                        label="Select genres"
                        item-text="name"
                        item-value="id"
                        prepend-icon="list"
                        hide-details
                        multiple
                        chips
                        clearable
                        autocomplete >
                        <template slot="selection" slot-scope="data">
                            <v-chip 
                                :selected="data.selected"
                                :key="JSON.stringify(data.item)"
                                close
                                @input="data.parent.selectItem(data.item)">
                                {{ data.item.name }}
                            </v-chip>
                        </template>
                        <template slot="item" slot-scope="data">     
                            <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                        </template>
                    </v-autocomplete>
                </div>
            </div>
        </section>  
        <!-- search films -->    
        <section class="item_container" v-if="searchInput.select">

            <div v-if="!loading" class="item_wrapper">
                <div class="item" v-for="(film, index) in items.search" :key="index">
                <router-link :to="{ name: 'singleMovie', params: { id: film.id } }"> 
                    
                        <app-itemList>
                            <template slot="rate">{{film.vote_average}}</template>
                            <template slot="year">{{film.release_date}}</template>
                            <img slot="img" class="item_img" v-bind:src="film.poster_path" alt="">
                        </app-itemList>

                    </router-link>
                    <h1 class="item_name"> {{film.title}}  </h1>
                </div>
            </div> 
            <!-- pagination --> 
            <div class="pages">
                <div class="pages_wrapper">
                    <button class="pages_btn pages_btn--prev" v-show="this.page.curSearch > 1" @click="prev">prev</button>
                    <p class="pages_total"> Currently on page: {{this.page.curSearch}} of {{this.totalPages.search}}</p>
                    <button class="pages_btn pages_btn--next" v-show="this.page.curSearch < this.totalPages.search" @click="next">next</button>
                </div>
            </div>
        </section>
        <!-- discover films -->    
        
        <section class="item_container" v-if="!searchInput.select">
            
            <div v-if="!loading" class="item_wrapper">
               
                <div class="item" v-for="(film, index) in items.discover" :key="index">
                  
                    <router-link :to="{ name: 'singleMovie', params: { id: film.id } }"> 
                        <app-itemList>
                            <template slot="rate">{{film.vote_average}}</template>
                            <template slot="year">{{film.release_date}}</template>
                            <img slot="img" class="item_img" v-bind:src="film.poster_path" alt="">
                        </app-itemList>
                    </router-link>
                    <h1 class="item_name"> {{film.title}} </h1>
                
                </div>
               
            </div> 
           
            <!-- pagination --> 
            <div class="pages">
                <div class="pages_wrapper">
                    <button class="pages_btn pages_btn--prev" v-show="this.page.cur > 1" @click="prev">prev</button>
                    <p class="pages_total"> Currently on page: {{this.page.cur}} of {{this.totalPages.discover}}</p>
                    <button class="pages_btn pages_btn--next" v-show="this.page.cur < this.totalPages.discover" @click="next">next</button>
                </div>
            </div>
        </section>
    </v-app>
    <app-footer></app-footer>

</div></template>

<script>
import menu from '../components/parts/menu.vue';
import itemList from '../components/templates/itemList.vue';
import footer from '../components/parts/footer.vue';
import axios from 'axios';

export default {
    components: {
        'app-menu': menu,
        'app-itemList': itemList,
        'app-footer': footer,
    },
    name: 'home',
    data () {
        return {        
            // serching filters
            search: "",
            selectYear: "",
            selectGenres: "",
            
            loading: false,

            searchInput: {
                search: "",
                loading: false,
                items: [],
                select: null,
                names: [],
            },
        }
    },

    created(){
        // if is search input empty discover movies is render
        this.init()
        this.discoverItems()
        // creating list of years in select input
        this.getYearsList()
        // creating list of genres in select input
        this.getGenresList()
    },
    
    watch: {
        // watching changes in search input
        search(val) {
            val && val !== this.searchInput.select && this.titleList(val)
            this.searchItems()
        },
        // watching changes in genres input
        selectGenres(val) {
            this.page.cur = 1
            this.discoverItems()
        },
        // watching changes in year input
        selectYear(val) {
            this.page.cur = 1
            this.discoverItems()
        },
    },

    computed: {
        //get data from store
        URL(){ return this.$store.state.URL },
        holder(){ return this.$store.state.holder },
        items(){ return this.$store.state.items },
        page(){ return this.$store.state.page },
        totalPages(){ return this.$store.state.totalPages },

    },

    methods: {
        //for start
        init(){
            this.page.cur = 1
            this.page.curSearch = 1
            !this.searchInput.select 
            this.items.discover = ""
            this.items.search = ""
            this.items.genres = []


        },
        //paginations prev button
        prev(){

            if (this.searchInput.select) {
                this.page.curSearch--
                this.searchItems()
            } else {
                this.page.cur--
                this.discoverItems()
            }
            this.scrollToTop(300)
        },
        //paginations next button
        next(){

            if (this.searchInput.select) {
                this.page.curSearch++
                this.searchItems()
            } else {
                this.page.cur++
                this.discoverItems()
            }
            this.scrollToTop(300)
        },
        // scroll to top
        scrollToTop(scrollDuration) {
            var scrollStep = -window.scrollY / (scrollDuration / 15),
                scrollInterval = setInterval(function(){
                if ( window.scrollY != 0 ) {
                    window.scrollBy( 0, scrollStep );
                }
                else clearInterval(scrollInterval); 
            },15)
        },
        // creating list of movie titles in autocomplete input 
        titleList(searchTerm) {
            this.searchInput.loading = true
            axios.get(`${this.URL.database}search/movie${this.URL.apiKey}&query=${searchTerm}`)
            .then(res => {
                let titles = res.data.results
                titles.forEach((movie)=> {
                    this.searchInput.names.push(movie.title)
                })
                this.searchInput.items = this.searchInput.names.filter(e => {
                    return (e || '').toLowerCase().indexOf((searchTerm || '').toLowerCase()) > -1
                })
                this.searchInput.loading = false
            }) 
        },
        // get data from database with query
        searchItems() {
            this.loading = true
            axios.get(`${this.URL.database}search/movie${this.URL.apiKey}&include_adult=false&page=${this.page.curSearch}&query=${this.searchInput.select}`)
            .then(res => {
                // base url for image
                const URL = "https://image.tmdb.org/t/p/w500"
                // get total pages of searching movies
                this.totalPages.search = res.data.total_pages
                // get data results
                this.items.search = res.data.results
                // creating complete img path 
                this.items.search.forEach((poster)=>{
                    if (poster.poster_path) {
                        poster.poster_path = URL + poster.poster_path
                    } else if (poster.poster_path == null) {
                        // replace poster with poster holder if is no poster
                        poster.poster_path = this.holder.photo
                    }
                })
                // get just year from release date
                this.items.search.forEach((year)=>{
                    if(year.release_date) {
                        year.release_date = year.release_date.slice(0,4)
                    } else {
                         year.release_date = "????"
                    }
                })
            }).then(()=> { 
                this.loading = false
               
            })    
        },
        // get data from discover database 
        discoverItems() {
            this.loading = true
            axios.get(`${this.URL.database}discover/movie${this.URL.apiKey}&include_adult=false&page=${this.page.cur}&primary_release_year=${this.selectYear}&with_genres=${this.selectGenres}`)
            .then(res => {
                // base url for image
                const URL = "https://image.tmdb.org/t/p/w500"
                // get data results        
                this.items.discover = res.data.results
               
                // get total pages of discover items
                this.totalPages.discover = res.data.total_pages   
                // creating complete img path 
                this.items.discover.forEach((poster)=>{
                    if (poster.poster_path) {
                        poster.poster_path = URL + poster.poster_path
                    } else if (poster.poster_path == null) {
                        // replace poster with poster holder if is no poster
                        poster.poster_path = this.holder.photo
                    }
                })
                // get just year from release date
                this.items.discover.forEach((year)=>{
                    if (year.release_date) {
                        year.release_date = year.release_date.slice(0,4)
                    } else {
                         year.release_date = "????"
                    }
                })

            }).then(()=> { 
                this.loading = false
               
            })   
        },
        // create list of years 
        getYearsList() {
            this.$store.commit('getYearsList')
        },
        // creating list of genres 
        getGenresList(searchTerm) {
            axios.get(`${this.URL.database}genre/movie/list${this.URL.apiKey}`)
            .then(res => {
               // genres data
               let genres = res.data.genres
                // push data to array
                genres.forEach((genre)=> {
                    this.items.genres.push(genre) 
                })
               
            }) 
        },
    }, 
}
</script>


<style lang='scss' scoped>
    @import '../assets/scss/_variables';
    @import '../assets/scss/parts/_general';
    @import '../assets/scss/parts/_filters';
    @import '../assets/scss/parts/_itemList';
    @import '../assets/scss/parts/_pagination';

    .item_wrapper {
        flex-wrap: wrap;
        justify-content: center;
    }

               
</style>
