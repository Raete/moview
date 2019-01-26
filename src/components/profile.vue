<template><div id="profile">
    <v-app>
        <div class="loading" v-if="loading">
            <img src="@/assets/img/svg/loader.svg" alt="loading..." >
        </div>
        <app-menu></app-menu>
       
        <main class="container">
            <!-- profile header -->
            <header class="profile">
                    <!-- log out button -->
                <v-btn class="profile_logout" color="primary" flat round @click="logout" exact>
                    Log out  
                    <v-icon>exit_to_app</v-icon>
                </v-btn>
                <!-- user name -->
                <img class="profile_photo" v-bind:src="user.photo" alt="profil picture" >
               
                <div class="profile_name">
                    <h1 class="user_name">{{user.name }}</h1>
                    <p class="user_date">Member since {{user.date}}</p>
                </div>
                
            </header>
            <!-- menu - watchlist, rating  -->
            <v-toolbar flat color="white">
                
                <v-toolbar-items>

                    <v-btn-toggle v-model="menuItemActive" mandatory>
                        <v-btn  flat active-class='active_item active_item--dark' @click="showWatchlist">
                            Watchlist ({{allMarkItem()}})
                        </v-btn>
                        <v-btn  flat active-class='active_item active_item--dark' @click="showRatings">
                            Ratings ({{allRateItem()}})
                        </v-btn>
                    </v-btn-toggle>

                </v-toolbar-items>
                <v-spacer></v-spacer>
            </v-toolbar>

            
            <!-- watchlist -->
            <section class="watchlist" v-if="watchlist.status">
                <h1 class="list_heading">My watchlist</h1>
                 <!-- menu -->
                <v-toolbar flat dense color="back_3">
                    <v-spacer></v-spacer>
                    <v-toolbar-items>

                        <v-btn-toggle v-model="watchItemActive" mandatory >
                            <v-btn flat active-class='active_item active_item--light' @click="showWatchlistMovies" >
                                Movies ({{user.movies.mark.length }})
                            </v-btn>
                            <v-btn  flat active-class='active_item active_item--light' @click="showWatchlistShows">
                                TV Shows ({{user.shows.mark.length }})
                            </v-btn>
                        </v-btn-toggle>

                    </v-toolbar-items>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <!-- movies in watchlist -->
                <p v-if="allMarkItem() <= 0" class="empty_list"> You haven't added any movies or TV shows to your watchlist. </p>
                <section class="item_container" v-if="watchlist.movies">
                    <div class="item_wrapper">
                        <div class="item" v-for="(film, index) in user.movies.mark" :key="index">
                            <!-- poster -->
                            <div class="poster_wrapper">
                                <router-link :to="{ name: 'singleMovie', params: { id: film.iId } }">     
                                    <figure class="item_content animated">
                                        <img class="item_img" v-bind:src="film.poster" alt="">
                                        <figcaption class="item_hover">
                                            <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                                        </figcaption>           
                                    </figure>
                                </router-link>
                                <div class="poster_shadow--colored" v-bind:style="{ 
                                    backgroundImage: 'url(' + film.poster + ')',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }"></div>
                            </div>
                            <!-- box with bookmark and delete -->
                            <div class="item_info">
                                <!-- rating -->
                                <div class="item_rate">{{film.rate}}%</div>
                                <v-btn icon ripple class="item_delete">
                                    <v-icon @click.prevent="deleteMovie(film.id)">close</v-icon>
                                </v-btn>
                                <!-- title -->
                                <router-link class="item_title_box" :to="{ name: 'singleMovie', params: { id: film.iId } }">  
                                    <h1 class="item_name"> {{film.title}} </h1>
                                    <span class="item_year"> {{film.year}} </span>
                                </router-link>
                               
                                
                                
                            </div>
                            
                            
                        </div>
                    </div> 
                </section>
                <!-- tv shows in watchlist -->
                <section class="item_container" v-if="watchlist.shows" >

                
                    <div class="item_wrapper">
                        <div class="item" v-for="(film, index) in user.shows.mark" :key="index">
                            <!-- poster -->
                            <div class="poster_wrapper">
                                <router-link :to="{ name: 'singleShow', params: { id: film.iId } }"> 
                                    <figure class="item_content animated" >
                                        <img class="item_img" v-bind:src="film.poster" alt="">
                                        <figcaption class="item_hover">
                                            <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                                        </figcaption>           
                                    </figure>
                                </router-link>
                                <div class="poster_shadow--colored" v-bind:style="{ 
                                        backgroundImage: 'url(' + film.poster + ')',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }"></div>
                            </div>
                            <!-- block with bookmark and delete -->
                            <div class="item_info">
                                <!-- rating -->
                                <div class="item_rate">{{film.rate}}%</div>
                                <v-btn icon ripple class="item_delete">
                                    <v-icon @click.prevent="deleteShow(film.id)">close</v-icon>
                                </v-btn>
                                <!-- title -->
                                <router-link class="item_title_box" :to="{ name: 'singleShow', params: { id: film.iId } }"> 
                                    <h1 class="item_name"> {{film.title}} </h1>
                                    <span class="item_year">{{film.year}}</span>
                                </router-link>
                            </div>
                            
                        </div>
                    </div> 
                </section>
            </section>

            <!-- ratings -->
            <section class="ratings" v-if="ratings.status">
                <h1 class="list_heading">My ratings</h1>

                 <!-- menu -->
            <v-toolbar flat dense color="back_3">
                <v-spacer></v-spacer>
                <v-toolbar-items>

                    <v-btn-toggle v-model="rateItemActive" mandatory>
                        <v-btn  flat active-class='active_item active_item--light' @click="showRatingsMovies">
                            Movies ({{user.movies.rate.length }})
                        </v-btn>
                        <v-btn  flat active-class='active_item active_item--light' @click="showRatingsShows">
                            TV Shows ({{user.shows.rate.length }})
                        </v-btn>
                    </v-btn-toggle>

                </v-toolbar-items>
                <v-spacer></v-spacer>
            </v-toolbar>
                <!-- rated movies -->
                <p v-if="allRateItem() <= 0" class="empty_list"> You haven't rated any movies or TV shows. </p>
                <section class="item_container" v-if="ratings.movies">
                    <div class="item_wrapper">
                        <div class="item" v-for="(film, index) in user.movies.rate" :key="index">
                            <!-- poster -->
                            <div class="poster_wrapper">
                                <router-link :to="{ name: 'singleMovie', params: { id: film.iId } }"> 
                                    <figure class="item_content animated" >
                                        <img class="item_img" v-bind:src="film.poster" alt="">
                                        <figcaption class="item_hover">
                                            <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                                        </figcaption>           
                                    </figure>
                                </router-link>
                                <div class="poster_shadow--colored" v-bind:style="{ 
                                    backgroundImage: 'url(' + film.poster + ')',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }"></div>
                            </div>
                            <!-- block with bookmark and delete -->
                            <div class="item_info">
                                <!-- rating -->
                                <div class="item_rate">Your rate: {{film.user_rate}}%</div>
                                <v-btn icon ripple class="item_delete">
                                    <v-icon @click.prevent="deleteMovieRate(film.id)">close</v-icon>
                                </v-btn>
                                <!-- title -->
                                <router-link class="item_tile_box" :to="{ name: 'singleMovie', params: { id: film.iId } }">
                                	<h1 class="item_name"> {{film.title}} </h1>
                                    <span class="item_year">{{film.year}}</span>
                                </router-link>
                            </div>
                        </div>
                    </div> 
                </section>
                <!-- tv shows movies -->
                <section class="item_container" v-if="ratings.shows">
                    <div class="item_wrapper">
                        <div class="item" v-for="(film, index) in user.shows.rate" :key="index">
                            <!-- poster -->
                            <div class="poster_wrapper">
                                <router-link :to="{ name: 'singleShow', params: { id: film.iId } }"> 
                                    <figure class="item_content animated" >
                                        <img class="item_img" v-bind:src="film.poster" alt="">
                                        <figcaption class="item_hover">
                                            <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                                        </figcaption>           
                                    </figure>
                                </router-link>
                                <div class="poster_shadow--colored" v-bind:style="{ 
                                    backgroundImage: 'url(' + film.poster + ')',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }"></div>
                            </div>
                            <!-- block with bookmark and delete -->
                            <div class="item_info">
                                <!-- rating -->
                                <div class="item_rate">Your rate: {{film.user_rate}}%</div>
                                <v-btn icon ripple class="item_delete">
                                    <v-icon @click.prevent="deleteShowRate(film.id)">close</v-icon>
                                </v-btn>
                                <!-- title -->
                                <router-link class="item_title_box" :to="{ name: 'singleShow', params: { id: film.iId } }">
                                    <h1 class="item_name"> {{film.title}} </h1>
                                    <span class="item_year">{{film.year}}</span>
                                </router-link>
                            </div>
                        </div>
                    </div> 
                </section>
            </section>
        </main>
    </v-app>
    <app-footer></app-footer>
    <!-- go up button -->
     <button @click="scrollToTop(300) " class="up" :class="{ up_active: show.backToTop }"> go to top</button>
</div></template>

<script>
// components
import menu from '../components/parts/menu.vue';
import footer from '../components/parts/footer.vue';
// API database
import axios from 'axios';
// firebase
import db from '@/firebase/init'
import firebase from 'firebase/app'
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
                photo: "",
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
                movies: true,
                shows: false,
       
            },

            watchlist: {
                status: true,
            
                movies: true,
                shows: false,
            },

            watchMoviesColor: "backLight",
            watchShowsColor: "background",

            menuItemActive: 0,
            watchItemActive: 0,
            rateItemActive: 0,

        }
    },
    created(){
        this.loading = true
        // get current user from firebase
        this.getCurrentUser()
        // get user data from firebase
        this.getUserData()
        // back to seasons button
        window.addEventListener("scroll", this.backToTopBtn)

        



    },
    computed: {
        //get data from store
        ...mapState([
            'URL',
            'holder',
            'detail',
            'show',
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
            this.ratings.status = false
        },

        showWatchlistMovies(){
            this.watchlist.movies = true,
            this.watchlist.shows = false
        },

        showWatchlistShows(){
            this.watchlist.movies = false,
            this.watchlist.shows = true
        },

        // show rating list
        showRatings(){
            this.watchlist.status = false,
            this.ratings.status = true
        },

        showRatingsMovies(){
            this.ratings.movies = true,
            this.ratings.shows = false
        },

        showRatingsShows(){
            this.ratings.movies = false,
            this.ratings.shows = true
        },

        // scroll to top
        scrollToTop(time) {
            this.$store.commit('scrollToTop', time)
        },
        // back to top button is appear
        backToTopBtn() {
            this.$store.commit('backToTopBtn')
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
            this.loading = true
            db.collection('users').where('user_id', '==', firebase.auth().currentUser.uid).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    // id of current user
                    this.user.id = doc.id
                
                    // get username from database
                    db.collection('users').doc(this.user.id).get()
                        .then(user => {

                            if (user.data().photo) {
                                this.user.photo = user.data().photo
                            } else {
                                this.user.photo = this.holder.person
                            }
                          
                            
                            this.user.name = user.data().alias 
                            this.user.date = moment(user.data().date).format('LL')
                        }) 
                
                    //get marked movies of current user from database 
                    db.collection('movies_marked').orderBy('rate', 'desc').where('user', '==', this.user.id).get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            let record = doc.data()
                            record.id = doc.id
                            this.user.movies.mark.push(record)
                            
                        })
                    
                    }) 
                    

                    //get marked shows of current user from database 
                    db.collection('shows_marked').orderBy('rate', 'desc').where('user', '==', this.user.id).get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            let record = doc.data()
                            record.id = doc.id
                            this.user.shows.mark.push(record)
                        })
                    })  

                    //get rated movies of current user from database 
                    db.collection('movies_rated').orderBy('rate', 'desc').where('user', '==', this.user.id).get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            let record = doc.data()
                            record.id = doc.id
                            this.user.movies.rate.push(record)
                        })
                    })  

                    //get rated shows of current user from database 
                    db.collection('shows_rated').orderBy('rate', 'desc').where('user', '==', this.user.id).get()
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
    @import '../assets/scss/parts/_pagination';

    .container {
        max-width: $width;
    }

    .profile {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        background: $color_back_1;
        border-bottom: 1px solid $color_back_3;
        border-radius: 5px 5px 0 0;
        &_photo {
            width: 80px;
            border-radius: 100%;
        }
        &_name {
            margin: 20px 0 40px 0;
        }
        &_logout {
            font-weight: 700;
            align-self: flex-end
        }
    }

    .empty_list {
        padding-top: 50px;
        text-align: center
    }

    // section headings
    .list_heading {
        padding:  16px;
        text-align: center;
        background: $color_back_3
    }

    // active item in menu
    .active_item {
        font-weight: 700;
        &--light {
            background: $color_back_2 !important
        }
        &--dark {
            background: $color_back_3 !important
        }
    }


</style>