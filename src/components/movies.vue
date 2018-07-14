<template><div>
    <v-app class="index">
      <app-header></app-header>
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
                        :items="movies.years"
                        :search-input.sync="selectYear"
                        label="Select year"
                        prepend-icon="event"
                    ></v-select>
                </div>
                <!-- genres filter -->
                <div class="filters_genres">
                    <v-autocomplete
                        :items="movies.genres" 
                        v-model="selectGenres"                 
                        label="Select genres"
                        item-text="name"
                        item-value="id"
                        prepend-icon="list"
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
            <div class="item_wrapper">
                <div class="item"   v-for="(film, index) in movies.search" :key="index">
                <router-link :to="{ name: 'singleMovie', params: { id: film.id } }"> 
                    
                        <app-itemList>
                            <template slot="rate">{{film.vote_average}}</template>
                            <template slot="year">{{film.release_date.slice(0,4)}}</template>
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
            <div class="item_wrapper">
                <div class="item" v-for="(film, index) in movies.discover" :key="index">
                    <router-link :to="{ name: 'singleMovie', params: { id: film.id } }"> 
                        <app-itemList>
                            <template slot="rate">{{film.vote_average}}</template>
                            <template slot="year">{{film.release_date.slice(0,4)}}</template>
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
import header from '../components/header.vue';
import itemList from '../components/templates/itemList.vue';
import footer from '../components/footer.vue';
import axios from 'axios';

export default {
    components: {
        'app-header': header,
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

            searchInput: {
                search: "",
                loading: false,
                items: [],
                select: null,
                states: [],
            },
        }
    },

    created(){
        // if is search input empty discover movies is render
        this.page.cur = 1
        this.page.curSearch = 1
        !this.searchInput.select 
        this.discoverMovies()
        this.getYearsList()
        this.getGenresList()
    },
    
    watch: {
        // watching changes in search input
        search(val) {
            val && val !== this.searchInput.select && this.titleList(val, "search/movie")
            this.searchMovies()
        },
        // watching changes in genres input
        selectGenres(val) {
            this.page.cur = 1
            this.discoverMovies()
        },
        // watching changes in year input
        selectYear(val) {
            this.page.cur = 1
            this.discoverMovies()
        },
    },

    computed: {
        //get data from store
        URL(){ return this.$store.state.URL },
        holder(){ return this.$store.state.holder },
        //searchInput(){ return this.$store.state.searchInput },
        movies(){ return this.$store.state.movies },

        page(){ return this.$store.state.page },
        totalPages(){ return this.$store.state.totalPages },

    },

    methods: {
        //paginations prev button
        prev(){
            if (this.searchInput.select) {
                this.page.curSearch--
                this.searchMovies()
            } else {
                this.page.cur--
                this.discoverMovies()
            }
        },
        //paginations next button
        next(){
            if (this.searchInput.select) {
                this.page.curSearch++
                this.searchMovies()
            } else {
                this.page.cur++
                this.discoverMovies()
            }
        },
        // creating list of movie titles in autocomplete input 
        titleList(searchTerm, place) {
            this.searchInput.loading = true
            axios.get(`${this.URL.database}${place}${this.URL.apiKey}&query=${searchTerm}`)
            .then(res => {
                let titles = res.data.results
                titles.forEach((movie)=> {
                    this.searchInput.states.push(movie.title)
                })
                this.searchInput.items = this.searchInput.states.filter(e => {
                    return (e || '').toLowerCase().indexOf((searchTerm || '').toLowerCase()) > -1
                })
                this.searchInput.loading = false
            }) 
        },
        // get data from database with query
        searchMovies() {
            axios.get(`${this.URL.database}search/movie${this.URL.apiKey}&page=${this.page.curSearch}&query=${this.searchInput.select}`)
            .then(res => {
                // base url for image
                const URL = "https://image.tmdb.org/t/p/w500"
                // get total pages of searching movies
                this.totalPages.search = res.data.total_pages
                // get data results
                this.movies.search = res.data.results
                // creating complete img path 
                this.movies.search.forEach((poster)=>{
                    if (poster.poster_path) {
                        poster.poster_path = URL + poster.poster_path
                    } else if (poster.poster_path == null) {
                        // replace poster with poster holder if is no poster
                        poster.poster_path = this.holder.photo
                    }
                })
            }) 
        },
        // get data from discover database 
        discoverMovies() {
            axios.get(`${this.URL.database}discover/movie${this.URL.apiKey}&page=${this.page.cur}&primary_release_year=${this.selectYear}&with_genres=${this.selectGenres}`)
            .then(res => {
                // base url for image
                const URL = "https://image.tmdb.org/t/p/w500"
                // get data results        
                this.movies.discover = res.data.results
               
                // get total pages of discover movies
                this.totalPages.discover = res.data.total_pages   
                // creating complete img path 
                this.movies.discover.forEach((poster)=>{
                    if (poster.poster_path) {
                        poster.poster_path = URL + poster.poster_path
                    } else if (poster.poster_path == null) {
                        // replace poster with poster holder if is no poster
                        poster.poster_path = this.holder.photo
                    }
                })
            }) 
        },
        // create list of years 
        getYearsList() {
            // set year 1900
            let first = "1900"
            // set current year
            let current = new Date().getFullYear()
        
            // push list of year to movies.years
            for (var i = first; i <= current; i++) this.movies.years.push(i);
            // sorting years array first is "none" then current year - 1900
            this.movies.years = this.movies.years.slice(0, 1)
            .concat(this.movies.years = this.movies.years.slice(1, this.movies.years.length).reverse())
        },
        // creating list of genres 
        getGenresList(searchTerm) {
            this.movies.genres = []
            axios.get(`${this.URL.database}genre/movie/list${this.URL.apiKey}`)
            .then(res => {
               // genres data
               let genres = res.data.genres
                // push data to array
                genres.forEach((genre)=> {
                    this.movies.genres.push(genre) 
                })
               
            }) 
        },
    }, 
}
</script>


<style lang='scss' scoped>
    @import '../assets/scss/_variables';
    @import '../assets/scss/_filters';
    @import '../assets/scss/_tips';
    @import '../assets/scss/_pagination';


    [v-autocomplete]{
       min-height: 0; 
    }
</style>
