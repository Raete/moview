<template><div>
    <v-app>
        <app-menu></app-menu>
        <div class="loading" v-if="loading">
            <img src="@/assets/img/svg/loader.svg" alt="moview" >
        </div>
        <app-submenu></app-submenu>
     
        <!-- filters -->
        <section class="filters">
            <div class="filters_wrapper">
                <!-- search filter -->
                <div class="filters_search">
                    <v-autocomplete
                        :items="searchInput.items"
                        :search-input.sync="search"
                        v-model="searchInput.select"
                        cache-items
                        flat
                        hide-no-data
                        hide-details
                        clearable
                        solo
                        prepend-inner-icon="search"
                        label="Search celebrities"
                    ></v-autocomplete>
                </div>
                
            </div>
        </section>  
        <!-- search celebrity-->    
        <section class="item_container" v-if="searchInput.select">
            <div v-if="!loading" class="item_wrapper">
                <div class="item" v-for="(actor, index) in items.search" :key="index">
                    <!-- picture --> 
                    <router-link :to="{ name: 'singleActor', params: { id: actor.id } }"> 
                        
                        <figure class="item_content animated">
                            <img class="item_img" v-bind:src="actor.profile_path" alt="">
                            <figcaption class="item_hover">
                                <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                            </figcaption>           
                        </figure>

                    </router-link>
                    <!-- name --> 
                    <h1 class="item_name"> {{actor.name}} </h1>
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
        <!-- discover celebrity-->     
        <section class="item_container" v-if="!searchInput.select">
            <div v-if="!loading" class="item_wrapper">
                <div class="item" v-for="(actor, index) in items.discover" :key="index">
                <!-- picture -->
                <router-link :to="{ name: 'singleActor', params: { id: actor.id } }"> 
                    
                    <figure class="item_content animated">
                        
                        <img class="item_img" v-bind:src="actor.profile_path" alt="">
                        <figcaption class="item_hover">
                            <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                        </figcaption>           
                    </figure>

                </router-link>
                <!-- name -->
                <h1 class="item_name"> {{actor.name}} </h1>
                    
                </div>
            </div> 
             <!-- pagination --> 
            <div class="pages">
                <div class="pages_wrapper">
                    <v-btn flat round v-show="this.page.cur > 1" @click="prev" >
                        <v-icon color="primary"> keyboard_arrow_left </v-icon>
                        prev
                    </v-btn>
                    <p class="pages_total"> Currently on page: {{this.page.cur}} of {{this.totalPages.discover}}</p>
                    <v-btn flat round v-show="this.page.cur < this.totalPages.discover" @click="next" >
                        next
                        <v-icon color="primary"> keyboard_arrow_right </v-icon>
                    </v-btn>
                </div>
            </div>
        </section>
    </v-app>
    <app-footer></app-footer>

</div></template>

<script>
import menu from '@/components/parts/menu.vue';
import subMenu from '../components/parts/subMenu.vue';
import footer from '@/components/parts/footer.vue';
import axios from 'axios';
import { mapState } from 'vuex';

export default {
    components: {
        'app-menu': menu,
        'app-submenu': subMenu,
        'app-footer': footer,
    },
    data () {
        return {   
            loading: false,    
            // filters 
            search: "",

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
        this.init()
        // render data from API
        this.discoverItems()
    },
    
    watch: {
        // watching changes in search input
        search(val) {
            val && val !== this.searchInput.select && this.titleList(val)
            this.searchItems()
        },

    },

    computed: {
        //get data from store
        ...mapState([
            'URL',
            'holder',
            'items',
            'page',
            'totalPages',
        ]),
    },

    methods: {
        //for start
        init(){
            this.page.cur = 1
            this.page.curSearch = 1
            !this.searchInput.select 
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
        // creating list of movie titles in autocomplete input 
        titleList(searchTerm) {
            this.searchInput.loading = true
            axios.get(`${this.URL.database}search/person${this.URL.apiKey}&query=${searchTerm}`)
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
        // scroll to top
        scrollToTop(time) {
            this.$store.commit('scrollToTop', time)
        },
        // get data from database with query
        searchItems() {
            this.items.search = ""
            this.loading = true
            axios.get(`${this.URL.database}search/person${this.URL.apiKey}&page=${this.page.curSearch}&query=${this.searchInput.select}`)
            .then(res => {
                // base url for image
                const URL = "https://image.tmdb.org/t/p/w500"
                // get total pages of searching items
                this.totalPages.search = res.data.total_pages
                // get data results
                this.items.search = res.data.results
                // creating complete img path 
                this.items.search.forEach((poster)=>{
                    if (poster.profile_path) {
                        poster.profile_path = URL + poster.profile_path
                    } else if (poster.profile_path == null) {
                        // replace poster with poster holder if is no poster
                        poster.profile_path = this.holder.photo
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
            axios.get(`${this.URL.database}person/popular${this.URL.apiKey}&page=${this.page.cur}`)
            .then(res => {
                // base url for image
                const URL = "https://image.tmdb.org/t/p/w500"
                // get data results        
                this.items.discover = res.data.results
             
                // get total pages of discover items
                this.totalPages.discover = res.data.total_pages   
                // creating complete img path 
                this.items.discover.forEach((poster)=>{
                    if (poster.profile_path) {
                        poster.profile_path = URL + poster.profile_path
                    } else if (poster.profile_path == null) {
                        // replace poster with poster holder if is no poster
                        poster.profile_path = this.holder.photo
                    }
                })
            }).then(()=> { 
                this.loading = false
               
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
