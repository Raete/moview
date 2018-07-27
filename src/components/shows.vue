<template><div>
    <v-app class="index">
        <app-menu></app-menu>
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
                        label="Search TV Shows"
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
                <div class="item"   v-for="(film, index) in items.search" :key="index">
                <router-link :to="{ name: 'singleShow', params: { id: film.id } }"> 
                    
                        <app-itemList>
                            <template slot="rate">{{film.vote_average}}</template>
                            <template slot="year"> {{film.first_air_date}}</template>
                            <img slot="img" class="item_img" v-bind:src="film.poster_path" alt="">
                        </app-itemList>

                    </router-link>
                    <h1 class="item_name"> {{film.original_name}}  </h1>
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
            
            <div v-show="!loading" class="item_wrapper">
                <div class="item" v-for="(film, index) in items.discover" :key="index">
                <router-link :to="{ name: 'singleShow', params: { id: film.id } }"> 

                    <app-itemList>
                        <template slot="rate">{{film.vote_average}}</template>
                        <template slot="year"> {{film.first_air_date}}</template>
                        <img slot="img" class="item_img" v-bind:src="film.poster_path" alt="">
                    </app-itemList>

                    </router-link>
                    <h1 class="item_name"> {{film.name}} </h1>
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
    data () {
        return {        
         
            loading: false,
            // serching filters
            search: "",
            selectYear: "",
            selectGenres: "",

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
        this.getYearsList()
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
       // searchInput(){ return this.$store.state.searchInput },
        items(){ return this.$store.state.items },
        filters(){ return this.$store.state.filters },
        page(){ return this.$store.state.page },
        totalPages(){ return this.$store.state.totalPages },

    },

    methods: {
        // for start 
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
                this.page.curSearchP--
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
            axios.get(`${this.URL.database}search/tv${this.URL.apiKey}&query=${searchTerm}`)
            .then(res => {
                let titles = res.data.results
                titles.forEach((movie)=> {
                    this.searchInput.names.push(movie.name)
                })
                this.searchInput.items = this.searchInput.names.filter(e => {
                    return (e || '').toLowerCase().indexOf((searchTerm || '').toLowerCase()) > -1
                })
                this.searchInput.loading = false
            }) 
        },
        // get data from database with query
        searchItems() {
            this.items.search = ""
            this.loading = true
            axios.get(`${this.URL.database}search/tv${this.URL.apiKey}&page=${this.page.curSearch}&query=${this.searchInput.select}`)
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
                    if(year.first_air_date) {
                        year.first_air_date = year.first_air_date.slice(0,4)
                    } else {
                        year.first_air_date = "????"
                    }
                })
            }).then(()=> { 
                this.loading = false
               
            })     
        },
        // get data from discover database 
        discoverItems() {
            this.items.discover = ""
            this.loading = true
            axios.get(`${this.URL.database}discover/tv${this.URL.apiKey}&page=${this.page.cur}&first_air_date_year=${this.selectYear}&with_genres=${this.selectGenres}`)
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
                    if(year.first_air_date) {
                        year.first_air_date = year.first_air_date.slice(0,4)
                    } else {
                        year.first_air_date = "????"
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
            this.items.genres = []
            axios.get(`${this.URL.database}genre/tv/list${this.URL.apiKey}`)
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
