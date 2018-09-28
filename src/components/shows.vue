<template><div>
    <v-app>
        <app-menu></app-menu>
        <div class="loading" v-if="loading">
            <img src="@/assets/img/svg/loader.svg" alt="loading..." >
        </div>
        <h1 class="page_title">Discover new tv shows</h1>
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
                        flat
                        solo
                        prepend-inner-icon="event"
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
                        flat
                        solo
                        prepend-inner-icon="list"
                        hide-details
                        multiple
                        chips
                        clearable
                        hide-selected
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
                    <!-- poster -->
                    <div class="poster_wrapper">
                        <router-link :to="{ name: 'singleShow', params: { id: film.id } }"> 

                            <figure class="item_content animated" >
                                <img class="item_img" v-bind:src="film.poster_path" alt="">
                                <figcaption class="item_hover">
                                    <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                                </figcaption>           
                            </figure>

                        </router-link>
                        <div class="poster_shadow--colored" v-bind:style="{ 
                                backgroundImage: 'url(' + film.poster_path + ')',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                        }"></div>
                    </div>
                    <!-- block with bookmark and rate -->
                    <div class="item_info">
                        <!-- rate -->
                        <div class="item_rate"> {{film.vote_average}}% </div>
                        <!-- bookmark -->
                        <v-tooltip left color="primary">
                            <v-btn v-model="mark" slot="activator" small fab depressed icon @click="markingButton(film.id, film)">
                                <v-icon size="25px">{{styleMarkIcon(film.id)}}</v-icon>
                            </v-btn>  
                            <span>Bookmark</span>
                        </v-tooltip>
            
                    </div>
                    <!-- title-->
                    <h1 class="item_name"> {{film.original_name}} </h1>
                    <span class="item_year">{{film.first_air_date}}</span>
                
                </div>
            </div> 
             <!-- pagination --> 
            <div class="pages">
                <div class="pages_wrapper">
                    <v-btn flat round v-show="this.page.curSearch > 1" @click="prev" >
                        <v-icon color="primary"> keyboard_arrow_left </v-icon>
                        prev
                    </v-btn>
                    <p class="pages_total"> Currently on page: {{this.page.curSearch}} of {{this.totalPages.search}}</p>
                    <v-btn flat round v-show="this.page.curSearch < this.totalPages.search" @click="next" >
                        next
                        <v-icon color="primary"> keyboard_arrow_right </v-icon>
                    </v-btn>
                </div>
            </div>
        </section>
        <!-- discover films -->    
        <section class="item_container" v-if="!searchInput.select">
            <div v-if="!loading" class="item_wrapper">
                <div class="item" v-for="(film, index) in items.discover" :key="index">
                    <!-- poster -->
                    <div class="poster_wrapper">
                        <router-link :to="{ name: 'singleShow', params: { id: film.id } }"> 

                            <figure class="item_content animated" >
                                <img class="item_img" v-bind:src="film.poster_path" alt="">
                                <figcaption class="item_hover">
                                    <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                                </figcaption>           
                            </figure>

                        </router-link>
                        <div class="poster_shadow--colored" v-bind:style="{ 
                            backgroundImage: 'url(' + film.poster_path + ')',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }"></div>
                    </div>
                    <!-- block with bookmark and rate -->
                    <div class="item_info">
                        <!-- rate -->
                        <div class="item_rate"> {{film.vote_average}}% </div>
                        <!-- bookmark -->
                        <v-tooltip left color="primary">
                            <v-btn v-model="mark" slot="activator" small fab depressed icon @click="markingButton(film.id, film)">
                                <v-icon size="25px">{{styleMarkIcon(film.id)}}</v-icon>
                            </v-btn>  
                            <span>Bookmark</span>
                        </v-tooltip>
                        
                    </div>
                    <!-- title-->
                    <h1 class="item_name"> {{film.original_name}} </h1>
                    <span class="item_year">{{film.first_air_date}}</span>
                
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
        <!-- alert messages -->
        <v-alert
            v-model="alert.active"
            dismissible
            :type="alert.type"
            class="alert"
            transition="fade-transition"
            >
            {{alert.text}}
        </v-alert>
    </v-app>
    <app-footer></app-footer>

</div></template>

<script>
// components
import menu from '../components/parts/menu.vue';
import footer from '../components/parts/footer.vue';
// API database
import axios from 'axios';
// firebase
import db from '@/firebase/init'
import firebase from 'firebase'
// vuex -- store
import { mapState } from 'vuex';

export default {
    components: {
        'app-menu': menu,
        'app-footer': footer,
    },
    name: 'shows',
    data () {
        return {        
            loading: false,
            // filters
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
            // bookmark movies
            mark: "",
            showData: {},
        }
    },

    created(){
        
        this.init()
        // render data from API
        this.discoverItems()
        // creating list of years in select input
        this.getYearsList()
        // creating list of genres in select input
        this.getGenresList()
        // get data from firebase
        this.getFirebaseData()

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
        ...mapState([
            'URL',
            'holder',
            'items',
            'page',
            'totalPages',
            'is',
            'alert',
            'btn',
            'user',
        ]),
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
        scrollToTop(time) {
            this.$store.commit('scrollToTop', time)
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
        // get data from firebase
        getFirebaseData(){
            // get current user from firebase if user is login
            if(firebase.auth().currentUser) {
                db.collection('users').where('user_id', '==', firebase.auth().currentUser.uid).get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        //user slug
                        this.user.id = doc.id

                        // read firebase database in real time
                        db.collection('shows_marked').where('user', '==', this.user.id)
                        .onSnapshot((snapshot) => {
                            snapshot.docChanges().forEach(change => {
                                // add tv show to array if tv show is add to database
                                if (change.type == 'added') {
                                    let record = change.doc.data()
                                    record.id = change.doc.id
                                    this.user.shows.mark.push(record)
                                }
                                // remove tv show from array if tv show is remove from database 
                                if (change.type == 'removed') {
                                    this.user.shows.mark = this.user.shows.mark.filter(item =>{
                                        return item.id != change.doc.id
                                    }) 
                                }
                            })
                        })
                    })
                }) 
            } 
        },
        // BOOKMARK BUTTON
        // decide if tv show is already marked
        isMarked(id){
            return this.user.shows.mark.findIndex(el => el.iId == id) !== -1
        },
        // add tv show to watchlist and send to firebase
        addMarkedItem(id, arr){

            this.showData = arr
            db.collection('shows_marked').add({
                id: "",
                iId: this.showData.id,
                title: this.showData.original_name,
                genres: this.showData.genre_ids,
                poster: this.showData.poster_path,
                rate: this.showData.vote_average,
                year: this.showData.first_air_date,
                user: this.user.id

            }).then(() => {
                // alert type and settings
                this.alert.type = "success"
                this.infoAlert("Successfully added to watchlist")
                
            })
            .catch(err => {
                console.log(err)
            })
        },

        // delete tv show from firebase
        deleteMarkedItem(id){
            // *iId (item id) is id of tv show from API and id is id of item in firebase
            db.collection('shows_marked').where('user', '==', this.user.id).where('iId', '==', id).get()
            .then(snapshot => {
                // id of item in firebase
                let snapshotID = snapshot.docs[0].id
                // delete item from firebase
                db.collection('shows_marked').doc(snapshotID).delete().then(()=> {
                    // delete from local array
                    this.user.shows.mark = this.user.shows.mark.filter(item =>{
                        return item.id != snapshotID
                    }) 
                }) 
            }) 
            // alert type and settings
            this.alert.type = "success"
            this.infoAlert("Successfully removed from watchlist.")    
        },

        // alert messages
        infoAlert(alertText){
            this.$store.commit('infoAlert', alertText)
        },

        // add or remove bookmark
        markingButton(id, arr){
             // if user is login then:
            if(firebase.auth().currentUser){
                // if tv show is not mark then:
                if (this.isMarked(id)) {
                    // add tv show to mark
                    this.deleteMarkedItem(id)
               
                // if tv show is mark then:
                } else if (!this.isMarked(id)) {
                    // delete tv show from mark 
                    this.addMarkedItem(id, arr)
                }
            // if user is not login then:
            } else {
                // show alert 
                this.alert.type = "error"
                this.infoAlert("You must log in.")
            }
        },
        // stylize marking button depending on whether the tv show is mark
        styleMarkIcon(id){
            // if user is login then:
            if(firebase.auth().currentUser){
                // if tv show is marked then: 
                if (this.isMarked(id)) {
                    // slyle icon
                    return "bookmark"
                    // if not:
                } else if (!this.isMarked(id)) {
                    // style icon
                    return "bookmark_border"
                }
            // if user is not login style icon
            } else return "bookmark_border"  
        },

        // API DATABASE
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
                // rate number formating to one decimal
                this.items.search.forEach((rate)=>{
                    if (rate.vote_average < 10) {
                        rate.vote_average =  rate.vote_average.toFixed(1)
                    }

                    if (rate.vote_average) {
                        rate.vote_average =  rate.vote_average * 10
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
                    } else if (poster == null || poster.poster_path == null) {
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
                // rate number formating to one decimal
                this.items.discover.forEach((rate)=>{
                    if (rate.vote_average < 10) {
                        rate.vote_average =  rate.vote_average.toFixed(1)
                    }

                    if (rate.vote_average) {
                        rate.vote_average =  rate.vote_average * 10
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

</style>
