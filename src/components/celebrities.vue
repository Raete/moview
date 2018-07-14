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
                        label="Search celebrities"
                    ></v-autocomplete>
                </div>
                
            </div>
        </section>  
        <!-- search films -->    
        <section class="item_container" v-if="searchInput.select">
            <div class="item_wrapper">
                <div class="item"   v-for="(film, index) in movies.search" :key="index">
                <router-link :to="{ name: 'singleActor', params: { id: film.id } }"> 
                    <figure class="item_content">
                        
                        <img class="item_img" v-bind:src="film.profile_path" alt="">
                        <figcaption class="item_hover">
                            <img class="item_hover_ico" src="../assets/img/svg/plus.svg" alt="">
                        </figcaption>           
                    </figure>
                    </router-link>
                    <h1 class="item_name"> {{film.name}}  </h1>
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
                <router-link :to="{ name: 'singleActor', params: { id: film.id } }"> 
                    <figure class="item_content">
                        
                        <img class="item_img" v-bind:src="film.profile_path" alt="">
                        <figcaption class="item_hover">
                            <img class="item_hover_ico" src="../assets/img/svg/plus.svg" alt="">
                        </figcaption>           
                    </figure>
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
import header from '../components/header.vue';
import footer from '../components/footer.vue';
import axios from 'axios';

export default {
    components: {
        'app-header': header,
        'app-footer': footer,
    },
    name: 'home',
    data () {
        return {        
            search: "",
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
    },
    
    watch: {
        // watching changes in search input
        search(val) {
            val && val !== this.searchInput.select && this.titleList(val, "search/person")
            this.searchMovies()
        },

    },

    computed: {
        //get data from store
        URL(){ return this.$store.state.URL },
        holder(){ return this.$store.state.holder },
       // searchInput(){ return this.$store.state.searchInput },
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
                    this.searchInput.states.push(movie.name)
                })
                this.searchInput.items = this.searchInput.states.filter(e => {
                    return (e || '').toLowerCase().indexOf((searchTerm || '').toLowerCase()) > -1
                })
                this.searchInput.loading = false
            }) 
        },
        // get data from database with query
        searchMovies() {
            axios.get(`${this.URL.database}search/person${this.URL.apiKey}&page=${this.page.curSearch}&query=${this.searchInput.select}`)
            .then(res => {
                // base url for image
                const URL = "https://image.tmdb.org/t/p/w500"
                // get total pages of searching movies
                this.totalPages.search = res.data.total_pages
                // get data results
                this.movies.search = res.data.results
                // creating complete img path 
                this.movies.search.forEach((poster)=>{
                    if (poster.profile_path) {
                        poster.profile_path = URL + poster.profile_path
                    } else if (poster.profile_path == null) {
                        // replace poster with poster holder if is no poster
                        poster.profile_path = this.holder.photo
                    }
                })
            }) 
        },
        // get data from discover database 
        discoverMovies() {
            axios.get(`${this.URL.database}person/popular${this.URL.apiKey}&page=${this.page.cur}`)
            .then(res => {
                // base url for image
                const URL = "https://image.tmdb.org/t/p/w500"
                // get data results        
                this.movies.discover = res.data.results
             
                // get total pages of discover movies
                this.totalPages.discover = res.data.total_pages   
                // creating complete img path 
                this.movies.discover.forEach((poster)=>{
                    if (poster.profile_path) {
                        poster.profile_path = URL + poster.profile_path
                    } else if (poster.profile_path == null) {
                        // replace poster with poster holder if is no poster
                        poster.profile_path = this.holder.photo
                    }
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
</style>
