<template><div id="profile">
    <v-app>
        <div class="loading" v-if="loading">
            <img src="@/assets/img/svg/loader.svg" alt="loading..." >
        </div>
        <app-menu></app-menu>
       
        <main class="container">
            <!-- profile header -->
            <header class="profile_header">
                <!-- user name -->
                <div class="profile_name">
                    <h1 class="user_name">{{user.name }}</h1>
                    <p class="user_date">Member since {{user.date}}</p>
                </div>
                    <!-- log out button -->
                <v-btn class=" font-weight-bold" color="primary" flat round @click="logout" exact>Log out</v-btn>
            </header>
            <!-- menu - watchlist, rating  -->
            <nav class="profile_nav">
                <v-btn  class="menu_item" :color="watchlist.color" depressed round @click="showWatchlist"> Watchlist ({{allMarkItem()}})</v-btn>
                <v-btn  class="menu_item" :color="ratings.color" depressed round @click="showRatings" > Ratings ({{allRateItem()}})</v-btn>
            </nav>
            <!-- watchlist -->
            <section class="watchlist" v-if="watchlist.status">
                <!-- movies in watchlist -->
                <p v-if="allMarkItem() <= 0" class="empty_list"> You haven't added any movies or TV shows to your watchlist. </p>
                <section class="item_container" >
                    <h3 v-if="user.movies.mark.length" class="section_title">Movies ({{user.movies.mark.length }})</h3>
                    <div class="item_wrapper">
                        <div class="item" v-for="(film, index) in user.movies.mark" :key="index">
                            <!-- poster -->
                            <router-link :to="{ name: 'singleMovie', params: { id: film.iId } }">     
                                <figure class="item_content animated">
                                    <img class="item_img" v-bind:src="film.poster" alt="">
                                    <figcaption class="item_hover">
                                        <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                                    </figcaption>           
                                </figure>
                            </router-link>
                            <!-- block with bookmark and rate -->
                            <div class="item_info">
                                <!-- rating -->
                                <div class="item_rate">{{film.rate}}%</div>
                                <v-btn icon ripple>
                                    <v-icon @click.prevent="deleteMovie(film.id)">close</v-icon>
                                </v-btn>
                            </div>
                            <!-- title -->
                            <h1 class="item_name"> {{film.title}} </h1>
                            <span class="item_year">{{film.year}}</span>
                        </div>
                    </div> 
                </section>
                <!-- tv shows in watchlist -->
                <section class="item_container" >
                    <h3 v-if="user.shows.mark.length" class="section_title">TV Shows ({{user.shows.mark.length }})</h3>
                    <div class="item_wrapper">
                        <div class="item" v-for="(film, index) in user.shows.mark" :key="index">
                            <!-- poster -->
                            <router-link :to="{ name: 'singleShow', params: { id: film.iId } }"> 
                                <figure class="item_content animated" >
                                    <img class="item_img" v-bind:src="film.poster" alt="">
                                    <figcaption class="item_hover">
                                        <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                                    </figcaption>           
                                </figure>
                            </router-link>
                            <!-- block with bookmark and rate -->
                            <div class="item_info">
                                <!-- rating -->
                                <div class="item_rate">{{film.rate}}%</div>
                                <v-btn icon ripple>
                                    <v-icon @click.prevent="deleteShow(film.id)">close</v-icon>
                                </v-btn>
                            </div>
                            <!-- title -->
                            <h1 class="item_name"> {{film.title}} </h1>
                            <span class="item_year">{{film.year}}</span>
                        </div>
                    </div> 
                </section>
            </section>

            <!-- ratings -->
            <section class="ratings" v-if="ratings.status">
                <!-- rated movies -->
                <p v-if="allRateItem() <= 0" class="empty_list"> You haven't rated any movies or TV shows. </p>
                <section class="item_container" >
                    <h3 v-if="user.movies.rate.length" class="section_title">Movies ({{user.movies.rate.length }})</h3>
                    <div class="item_wrapper">
                        <div class="item" v-for="(film, index) in user.movies.rate" :key="index">
                            <!-- poster -->
                            <router-link :to="{ name: 'singleShow', params: { id: film.iId } }"> 
                                <figure class="item_content animated" >
                                    <img class="item_img" v-bind:src="film.poster" alt="">
                                    <figcaption class="item_hover">
                                        <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                                    </figcaption>           
                                </figure>
                            </router-link>
                            <!-- block with bookmark and rate -->
                            <div class="item_info">
                                <!-- rating -->
                                <div class="item_rate">{{film.user_rate}}%</div>
                                <v-btn icon ripple>
                                    <v-icon @click.prevent="deleteMovieRate(film.id)">close</v-icon>
                                </v-btn>
                            </div>
                            <!-- title -->
                            <h1 class="item_name"> {{film.title}} </h1>
                            <span class="item_year">{{film.year}}</span>
                        </div>
                    </div> 
                </section>
                <!-- tv shows movies -->
                <section class="item_container" >
                    <h3 v-if="user.shows.rate.length" class="section_title">TV Shows ({{user.shows.rate.length }})</h3>
                    <div class="item_wrapper">
                        <div class="item" v-for="(film, index) in user.shows.rate" :key="index">
                            <!-- poster -->
                            <router-link :to="{ name: 'singleShow', params: { id: film.iId } }"> 
                                <figure class="item_content animated" >
                                    <img class="item_img" v-bind:src="film.poster" alt="">
                                    <figcaption class="item_hover">
                                        <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                                    </figcaption>           
                                </figure>
                            </router-link>
                            <!-- block with bookmark and rate -->
                            <div class="item_info">
                                <!-- rating -->
                                <div class="item_rate">{{film.user_rate}}%</div>
                                <v-btn icon ripple>
                                    <v-icon @click.prevent="deleteShowRate(film.id)">close</v-icon>
                                </v-btn>
                            </div>
                            <!-- title -->
                            <h1 class="item_name"> {{film.title}} </h1>
                            <span class="item_year">{{film.year}}</span>
                        </div>
                    </div> 
                </section>
            </section>
        </main>
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
// moment
import moment from 'moment'



export default {
    components: {
        'app-menu': menu,
        'app-footer': footer,
    },

    name: 'profile',
    data () {
        return {
            loading: false,
            // current user data
            user: {
                login: null,
                id: null,
                name: "",
                date: "",
                movies: {
                    mark: [],
                    rate: [],
                },
                shows: {
                    mark: [],
                    rate: [],
                },
            },
         
            ratings: {
                status: false,
                color: "background",
            },

            watchlist: {
                status: true,
                color: "backLight"
            },
        }
    },
    created(){
        this.loading = true
        // get current user from firebase
        this.getCurrentUser()
        // get user data from firebase
        this.getUserData()
    },
    computed: {
        //get data from store
        ...mapState([
            'URL',
            'holder',
            'detail',
        ]),
    },

    methods: {
        // sum rated movies and tv shows
        allRateItem(){
            return this.user.movies.rate.length + this.user.shows.rate.length
        },
        // sum movies an tv shows in watchlist
        allMarkItem(){
            return this.user.movies.mark.length + this.user.shows.mark.length
        },
        // show watchlist
        showWatchlist(){
            this.watchlist.status = true,
            this.watchlist.color = "backLight"
            this.ratings.status = false
            this.ratings.color = "background"
        },
        // show rating list
        showRatings(){
            this.watchlist.status = false,
            this.watchlist.color = "background"
            this.ratings.status = true,
            this.ratings.color = "backLight"
        },
 
        // FIREBASE 
        // get current user from firebase
        getCurrentUser(){
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    this.user.login = user
                } else {
                    this.user.login = null
                }
            })
        },
        // get user data from firebase
        getUserData(){
            db.collection('users').where('user_id', '==', firebase.auth().currentUser.uid).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    // id of current user
                    this.user.id = doc.id
                    // get username from database
                    db.collection('users').doc(this.user.id).get()
                        .then(user => {
                            this.user.name = user.data().alias  
                            this.user.date = moment(user.data().date).format('LL')
                        }) 
                
                    //get marked movies of current user from database 
                    db.collection('movies_marked').where('user', '==', this.user.id).get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            let record = doc.data()
                            record.id = doc.id
                            this.user.movies.mark.push(record)
                        })
                    })  

                    //get marked shows of current user from database 
                    db.collection('shows_marked').where('user', '==', this.user.id).get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            let record = doc.data()
                            record.id = doc.id
                            this.user.shows.mark.push(record)
                        })
                    })  

                    //get rated movies of current user from database 
                    db.collection('movies_rated').where('user', '==', this.user.id).get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            let record = doc.data()
                            record.id = doc.id
                            this.user.movies.rate.push(record)
                        })
                    })  

                    //get rated shows of current user from database 
                    db.collection('shows_rated').where('user', '==', this.user.id).get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            let record = doc.data()
                            record.id = doc.id
                            this.user.shows.rate.push(record)
                        })
                    })  
                    
                })
            }).then(() => {
                    this.loading = false
            })
            
        },
        // logout current user redirect to login page
        logout(){
            firebase.auth().signOut().then(() => {
                this.$router.push({ name: 'login'})
            })
        },
        
        // remove movie from watchlist
        deleteMovie(id){
            db.collection('movies_marked').doc(id).delete().then(()=> {
                    this.user.movies.mark = this.user.movies.mark.filter(item =>{
                    return item.id != id
                })
            })
        },
        // remove show from watchlist
        deleteShow(id){
            db.collection('shows_marked').doc(id).delete().then(()=> {
                    this.user.shows.mark = this.user.shows.mark.filter(item =>{
                    return item.id != id
                })
            })
        },
        // remove show from watchlist
        deleteMovieRate(id){
            db.collection('movies_rated').doc(id).delete().then(()=> {
                    this.user.movies.rate = this.user.movies.rate.filter(item =>{
                    return item.id != id
                })
            })
        },
         // remove show from watchlist
        deleteShowRate(id){
            db.collection('shows_rated').doc(id).delete().then(()=> {
                    this.user.shows.rate = this.user.shows.rate.filter(item =>{
                    return item.id != id
                })
            })
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
}

.profile {
    &_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        margin-bottom: 50px;
    }
    &_nav {
        margin-bottom: 20px;
        text-align: center
    }
}

.section_title {
    text-align: center
}

.item {
    width: 160px; 
    &_wrapper {
        padding: 25px 0 ;
        flex-wrap: nowrap;
        overflow-x: auto;
        justify-content: flex-start;  
    }
    &_info {
        padding: 5px 0 5px 9px
    }
}

.empty_list {
    text-align: center
}




</style>
