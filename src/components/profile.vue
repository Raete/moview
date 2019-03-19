<template><div id="profile">
    <v-app>
        <div class="loading" v-if="loading">
            <img src="@/assets/img/svg/loader.svg" alt="loading..." >
        </div>
        <v-container class="pt-0">
            <v-toolbar flat>
                <router-link  :to="{ name: 'movies' }" exact> 
                    <img src="@/assets/img/svg/logo.svg" alt="moview" class="menu_logo"> 
                </router-link>
                <v-spacer></v-spacer>
                <v-toolbar-items>

                <v-btn class="menu_item" flat :to="{ name: 'movies' }" exact > Movies </v-btn>
                <v-btn class="menu_item" flat  :to="{ name: 'shows' }" exact> TV Shows </v-btn>
                <v-btn class="profile_logout" color="primary" flat  @click="logout" exact>
                    Log out  
                    <v-icon>exit_to_app</v-icon>
                </v-btn>
                </v-toolbar-items>
            </v-toolbar>
       
       
            <!-- profile header -->
            <v-card flat class="text-xs-center py-5" color="secondary primary--text">
                <!-- user name -->
                <img class="profile_photo round" v-bind:src="user.photo" alt="profil picture" >
               
               
                    <h1 class="user_name ma-0">{{user.name }}</h1>
                    <p class="user_date ma-0">Member since {{user.date}}</p>
               
                
            </v-card>

            <!-- menu - watchlist, rating  -->
            <v-tabs
                v-model="menuItemActive"
                color="secondary darken-1"
                light 
                slider-color="primary"
                       
            >
                <v-tab
                    v-for="(item, index) in menu"
                    :key="index"
                    ripple
                    :href="`#${item.name}`">
                       
                   {{ item.name }} ({{itemNumber(item.name)}})
        
                </v-tab>
              


            
            <!-- watchlist -->
            <v-tab-item id="watchlist">
            
                <h1 class="list_heading">My watchlist</h1>
                 <!-- menu -->
                 <v-toolbar flat >
                    <v-toolbar-items>
                    <v-btn
                        v-for="(item, index) in submenu" :key="index"
                        flat 
                        @click="changeRender(item.type)"
                    >{{item.name}} ({{itemCounter(item.type)}})</v-btn>
                    </v-toolbar-items>
                </v-toolbar>

                          
                <!-- movies in watchlist -->
                <!-- <p v-if="allMarkItem() <= 0" class="empty_list"> You haven't added any movies or TV shows to your watchlist. </p> -->
                <section class="item_container">
                    <div class="item_wrapper">
                        <div class="item" v-for="(film, index) in renderWatchlistItems" :key="index">
                            <!-- poster -->
                            <div class="poster_wrapper">
                                <router-link :to="{ name: film.href, params: { id: film.iId } }">     
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
                                    <v-icon @click.prevent="deleteWatchlistItem(film.id, film.type)">close</v-icon>
                                </v-btn>
                                <!-- title -->
                                <router-link class="item_title_box" :to="{ name: film.href, params: { id: film.iId } }">  
                                    <h1 class="item_name"> {{film.title}} </h1>
                                    <span class="item_year"> {{film.year}} </span>
                                </router-link>
                            </div>
                        </div>
                    </div> 
                </section>
              
                
            </v-tab-item>
         

            
        

            <v-tab-item id="rating">
             
                
                <!-- ratings -->
                
                    <h1 class="list_heading">My ratings</h1>
                    <!-- menu -->
                    <v-toolbar flat>
                        <v-toolbar-items >
                        <v-btn
                            v-for="(item, index) in submenu" :key="index"
                            flat 
                            @click="changeRender(item.type)"
                        >{{item.name}} ({{itemCounter(item.type)}})</v-btn>
                        </v-toolbar-items>
                    </v-toolbar>

                    
                        <!-- rated movies -->
                        <!-- <p v-if="allRateItem() <= 0" class="empty_list"> You haven't rated any movies or TV shows. </p> -->
                        <section class="item_container">
                            <div class="item_wrapper">
                                <div class="item" v-for="(film, index) in renderRatedItems" :key="index">
                                    <!-- poster -->
                                    <div class="poster_wrapper">
                                        <router-link :to="{ name: film.href, params: { id: film.iId } }"> 
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
                                            <v-icon @click.prevent="deleteRatedItem(film.id, film.type)">close</v-icon>
                                        </v-btn>
                                        <!-- title -->
                                        <router-link class="item_tile_box" :to="{ name: film.href, params: { id: film.iId } }">
                                            <h1 class="item_name"> {{film.title}} </h1>
                                            <span class="item_year">{{film.year}}</span>
                                        </router-link>
                                    </div>
                                </div>
                            </div> 
                        </section>
                        
                  
            </v-tab-item>

            <v-tab-item id="seen">
            
                <h1 class="list_heading">My seen</h1>
                 <!-- menu -->
                 <v-toolbar flat >
                    <v-toolbar-items>
                    <v-btn
                        v-for="(item, index) in submenu" :key="index"
                        flat 
                        @click="changeRender(item.type)"
                    >{{item.name}} ({{itemCounter(item.type)}})</v-btn>
                    </v-toolbar-items>
                </v-toolbar>

                          
                <!-- movies in watchlist -->
                <!-- <p v-if="allMarkItem() <= 0" class="empty_list"> You haven't added any movies or TV shows to your watchlist. </p> -->
                <section class="item_container">
                    <div class="item_wrapper">
                        <div class="item" v-for="(film, index) in renderSeenItems" :key="index">
                            <!-- poster -->
                            <div class="poster_wrapper">
                                <router-link :to="{ name: film.href, params: { id: film.iId } }">     
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
                                    <v-icon @click.prevent="deleteSeenItem(film.id, film.type)">close</v-icon>
                                </v-btn>
                                <!-- title -->
                                <router-link class="item_title_box" :to="{ name: film.href, params: { id: film.iId } }">  
                                    <h1 class="item_name"> {{film.title}} </h1>
                                    <span class="item_year"> {{film.year}} </span>
                                </router-link>
                            </div>
                        </div>
                    </div> 
                </section>
              
                
            </v-tab-item>


           

            </v-tabs>
       
        </v-container>
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

                rated: {
                    all: [],
                    movies: [],
                    shows: [],
                },
                watchlist: {
                    all: [],
                    movies: [],
                    shows: [],
                },
                seen: {
                    all: [],
                    movies: [],
                    shows: [],
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

            menu: [
                {name: "watchlist"},
                {name: "rating"},
                {name: "seen"}
            ],

            submenu: [
                {type: "all", name: "all"},
                {type: "movie", name: "movies"},
                {type: "show", name: "shows"},
            ],

            menuItemActive: "watchlist",
            activeRender: "all"

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

        renderWatchlistItems(){

            return this.renderItems(this.user.watchlist.all)
        },

        renderRatedItems(){

            return this.renderItems(this.user.rated.all)

        },

        renderSeenItems(){

            return this.renderItems(this.user.seen.all)

        },


    },

    methods: {

        renderItems(arr){

            if(this.activeRender == "all") {
                return arr

            } else if (this.activeRender == "movies") {

                let movies = this.filterItem("movie", arr)
                return movies

            } else if (this.activeRender == "shows") {

                let shows = this.filterItem("show", arr)
                return shows
            }
        },

        filterItem(type, arr){
            let filteredItems = []
            

                filteredItems = arr.filter(item =>{
                    return item.type == type
                })

                return filteredItems

        },

        // sum rated movies and tv shows
        itemNumber(type){
            if(type == "watchlist") {
                return this.user.watchlist.all.length 
            }

            if(type == "rating") {
                return this.user.rated.all.length
            }

            if(type == "seen") {
                return this.user.seen.all.length
            }
        },

        itemCounter(type){
            if(this.menuItemActive == "watchlist") {

                if(type == "all") {
                return this.user.watchlist.all.length 
                }

                if(type == "movie") {
                    let movies = this.filterItem("movie", this.user.watchlist.all)
                    return movies.length
                }

                if(type == "show") {
                    let movies = this.filterItem("show", this.user.watchlist.all)
                    return movies.length
                }
            }

            if(this.menuItemActive == "rating") {

                if(type == "all") {
                return this.user.rated.all.length 
                }

                if(type == "movie") {
                    let movies = this.filterItem("movie", this.user.rated.all)
                    return movies.length
                }

                if(type == "show") {
                    let movies = this.filterItem("show", this.user.rated.all)
                    return movies.length
                }
            }

            if(this.menuItemActive == "seen") {

                if(type == "all") {
                return this.user.seen.all.length 
                }

                if(type == "movie") {
                    let movies = this.filterItem("movie", this.user.seen.all)
                    return movies.length
                }

                if(type == "show") {
                    let movies = this.filterItem("show", this.user.seen.all)
                    return movies.length
                }
            }
            
        },



        // show watchlist


        changeRender(type){
            if(type == "all") {
                return this.activeRender = "all"
                
            }

            if(type == "show") {
                return this.activeRender = "shows"
              
            }

            if(type == "movie") {
                return this.activeRender = "movies"
               
            }
            
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
                    db.collection('watchlist').orderBy('rate', 'desc').where('user', '==', this.user.id).get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            let record = doc.data()
                            record.id = doc.id

                            this.user.watchlist.all.push(record)

                            
                            
                        })
                    
                    }) 

                    //get rated shows of current user from database 
                    db.collection('rated').orderBy('rate', 'desc').where('user', '==', this.user.id).get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            let record = doc.data()
                            record.id = doc.id

                            this.user.rated.all.push(record)

                            if(record.type == "show") {
                                this.user.rated.shows.push(record)
                            }

                            if(record.type == "movie") {
                                this.user.rated.movies.push(record)
                            }
                            
                        })
                    })  

                    //get rated shows of current user from database 
                    db.collection('seen').orderBy('rate', 'desc').where('user', '==', this.user.id).get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            let record = doc.data()
                            record.id = doc.id

                            this.user.seen.all.push(record)
                            console.log(this.user.seen.all)

                            if(record.type == "show") {
                                this.user.seen.shows.push(record)
                            }

                            if(record.type == "movie") {
                                this.user.seen.movies.push(record)
                            }
                            
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
        

        deleteWatchlistItem(id, type){
            db.collection('watchlist').doc(id).delete().then(()=> {
               
                    this.user.watchlist.all = this.user.watchlist.all.filter(item =>{
                        return item.id != id
                    })
                      
            })
        },

        deleteRatedItem(id, type){
            db.collection('rated').doc(id).delete().then(()=> {
                this.user.rated.all= this.user.rated.all.filter(item =>{
                        return item.id != id
                    })
                    
            })
        },

        deleteSeenItem(id, type){
            db.collection('seen').doc(id).delete().then(()=> {
                this.user.seen.all= this.user.seen.all.filter(item =>{
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
       // background: $color_back_3
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