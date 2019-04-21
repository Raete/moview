<template><div id="profile">
    <v-app>
        <div class="loading" v-if="loading">
            <img src="@/assets/img/svg/loader.svg" alt="loading..." >
        </div>
        <v-container class="pt-0">

            <!-- menu -->
            <app-menu></app-menu>

            <!-- profile header -->
            <v-card flat class="text-xs-center pb-5" color=" primary--text">
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- log out button -->
                    <v-btn class="profile_logout" color="primary" flat  @click="logout" exact>
                        Log out  
                        <v-icon>exit_to_app</v-icon>
                    </v-btn>
                </v-card-actions>
                <!-- user name -->
                <img class="profile_photo round" v-bind:src="user.photo" alt="profil picture" >
                <h1 class="user_name ma-0">{{user.name }}</h1>
                <p class="user_date ma-0">Member since {{user.date}}</p>
            </v-card>

            <v-divider></v-divider>
            <!-- menu - watchlist, rating, seen  -->
            <v-tabs
                v-model="menuItemActive"
                light 
                slider-color="primary"    
            >
                <v-tab
                    v-for="(item, index) in menu"
                    :key="index"
                    ripple
                    :href="`#${item.name}`"
                    color="primary"
                >        
                   {{ item.name }} ({{itemNumber(item.name)}})  
                </v-tab>

                <!-- watchlist section -->
                
                <v-tab-item value="watchlist">
                
                    <h1 class="list_heading">My watchlist</h1>
                    <!-- filter all item, movies, tv shows -->
                    <v-toolbar flat >
                        <v-btn-toggle mandatory v-model="activeRender">
                            <v-btn
                                v-for="(item, index) in submenu" :key="index"
                                flat                             
                                class="mr-2"
                                :value="item.type"
                            >
                                {{item.name}} ({{itemCounter(item.type, user.watchlist.all, 'watchlist')}})
                            </v-btn>
                        </v-btn-toggle>
                        <v-spacer></v-spacer>
                        <v-menu v-if="user.watchlist.all.length">
                            <v-btn
                                slot="activator"
                                flat
                                depressed
                            >
                            <v-icon>swap_vert</v-icon>
                                Sort by
                            </v-btn>
                            <!-- list of sort option -->
                            <v-list class="white">
                                <v-list-tile @click="sortBy(user.watchlist.all, 'rate', reverse = !reverse)">
                                    <v-list-tile-title>Rating</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="sortBy(user.watchlist.all, 'title', reverse = !reverse)">
                                    <v-list-tile-title >Title</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="sortBy(user.watchlist.all, 'year', reverse = !reverse)">
                                    <v-list-tile-title >Year</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="sortBy(user.watchlist.all, 'added', reverse = !reverse)">
                                    <v-list-tile-title >Added</v-list-tile-title>
                                </v-list-tile>
                               
                            </v-list>
                        </v-menu>
                        <p>{{sorting.text}} ({{sortStatus()}})</p>
                    </v-toolbar>

                    <!-- movies and tv shows in watchlist -->
                   
                    <section class="item_container">
                        
                        <transition-group name="animation" tag="div" class="item_wrapper">
                            <div class="item" v-for="film in renderWatchlistItems" :key="film.id">
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
                                        <v-icon @click.prevent="deleteWatchlistItem(film.id)">close</v-icon>
                                    </v-btn>
                                    <!-- title -->
                                    <router-link class="item_title_box" :to="{ name: film.href, params: { id: film.iId } }">  
                                        <h1 class="item_name"> {{film.title}} </h1>
                                        <span class="item_year"> {{film.year}} </span>
                                    </router-link>
                                </div>
                            </div>
                        </transition-group> 
                        <p class="text-xs-center"> 
                        {{feedback(renderWatchlistItems, activeRender, "watchlist")}}
                        </p> 
                    </section>
                </v-tab-item>
                

                <!-- rating section -->
                <v-tab-item value="rating">

                    <h1 class="list_heading">My ratings</h1>
                    <!-- filter all item, movies, tv shows -->
                    <v-toolbar flat >
                        <v-btn-toggle mandatory v-model="activeRender">
                            <v-btn
                                v-for="(item, index) in submenu" :key="index"
                                flat                           
                                class="mr-2"
                                :value="item.type"
                            >
                                {{item.name}} ({{itemCounter(item.type, user.rated.all, 'rating')}})
                            </v-btn>
                        </v-btn-toggle>
                        <v-spacer></v-spacer>
                        <v-menu v-if="user.rated.all.length">
                            <v-btn
                                slot="activator"
                                flat
                                depressed
                            >
                            <v-icon>swap_vert</v-icon>
                                Sort by
                            </v-btn>
                            <!-- list of sort option -->
                            <v-list class="white">
                               <v-list-tile @click="sortBy(user.rated.all, 'user_rate', reverse = !reverse)">
                                    <v-list-tile-title>Rating</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="sortBy(user.rated.all, 'title', reverse = !reverse)">
                                    <v-list-tile-title >Title</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="sortBy(user.rated.all, 'year', reverse = !reverse)">
                                    <v-list-tile-title >Year</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="sortBy(user.rated.all, 'added', reverse = !reverse)">
                                    <v-list-tile-title >Added</v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                        <p>{{sorting.text}} ({{sortStatus()}})</p>                     
                    </v-toolbar>

                    <!-- rated movies and tv shows -->
                    <section class="item_container">
                        
                        <transition-group name="animation" tag="div" class="item_wrapper">
                            <div class="item" v-for="film in renderRatedItems" :key="film.id">
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
                                        <v-icon @click.prevent="deleteRatedItem(film.id)">close</v-icon>
                                    </v-btn>
                                    <!-- title -->
                                    <router-link class="item_tile_box" :to="{ name: film.href, params: { id: film.iId } }">
                                        <h1 class="item_name"> {{film.title}} </h1>
                                        <span class="item_year">{{film.year}}</span>
                                    </router-link>
                                </div>
                            </div>
                        </transition-group> 
                        <p class="text-xs-center"> 
                        {{feedback(renderRatedItems, activeRender, "rating")}}
                        </p> 
                    </section>

                </v-tab-item>

                <!-- seen section -->
                <v-tab-item value="seen">
                
                    <h1 class="list_heading">My seen</h1>
                    <!-- filter all item, movies, tv shows -->
                    <v-toolbar flat >
                        <v-btn-toggle mandatory v-model="activeRender">
                            <v-btn
                                v-for="(item, index) in submenu" :key="index"
                                flat                               
                                class="mr-2"
                                :value="item.type"
                            >
                                {{item.name}} ({{itemCounter(item.type, user.seen.all, 'seen')}})
                            </v-btn>
                        </v-btn-toggle>
                        <v-spacer></v-spacer>
                        <v-menu v-if="user.seen.all.length">
                            <v-btn
                                slot="activator"
                                flat
                                depressed
                            >
                            <v-icon>swap_vert</v-icon>
                                Sort by
                            </v-btn>
                            <!-- list of sort option -->
                            <v-list class="white">
                               <v-list-tile @click="sortBy(user.seen.all, 'rate', reverse = !reverse)">
                                    <v-list-tile-title>Rating</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="sortBy(user.seen.all, 'title', reverse = !reverse)">
                                    <v-list-tile-title >Title</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="sortBy(user.seen.all, 'year', reverse = !reverse)">
                                    <v-list-tile-title >Year</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="sortBy(user.seen.all, 'added', reverse = !reverse)">
                                    <v-list-tile-title >Added</v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                        <p>{{sorting.text}} ({{sortStatus()}})</p>
                    </v-toolbar>

                    <!-- movies and tv shows in seen -->
                    <section class="item_container">
                        <transition-group name="animation" tag="div" class="item_wrapper">
                            <div class="item" v-for="film in renderSeenItems" :key="film.id">
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
                                        <v-icon @click.prevent="deleteSeenItem(film.id)">close</v-icon>
                                    </v-btn>
                                    <!-- title -->
                                    <router-link class="item_title_box" :to="{ name: film.href, params: { id: film.iId } }">  
                                        <h1 class="item_name"> {{film.title}} </h1>
                                        <span class="item_year"> {{film.year}} </span>
                                    </router-link>
                                </div>
                            </div>
                        </transition-group> 
                        <p class="text-xs-center"> 
                            {{feedback(renderSeenItems, activeRender, "seen")}}
                        </p>
                    </section>
                </v-tab-item>
            </v-tabs>
        </v-container>
    </v-app>
    <app-footer></app-footer>
    <!-- go up button -->
    <button @click="scrollToTop(300) " class="up" :class="{ up_active: show.backToTop }"> 
        go to top
    </button>
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
import { mapState, mapMutations, mapActions } from 'vuex';
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

            menu: [
                {name: "watchlist", icon: "bookmark"},
                {name: "rating", icon: "star"},
                {name: "seen", icon: "visibility"}
            ],

            submenu: [
                {type: "all", name: "all" },
                {type: "movie", name: "movies"},
                {type: "show", name: "shows"},
            ],

            menuItemActive: "watchlist",
            activeRender: "all",

            reverse: true,

            sorting: {
                text: "rating",
            }
                
            

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
        ...mapMutations([
           // 'scrollToTop',
          //  'backToTopBtn',
        ]),
        ...mapActions([
          //  'infoAlert',

        ]),

        // show item
        renderItems(arr){
            // show all item in array
            if(this.activeRender == "all") {
                return arr

            // show only item with type movie
            } else if (this.activeRender == "movie") {
                let movies = this.filterItem("movie", arr)
                return movies

            // show only item with type show
            } else if (this.activeRender == "show") {
                let shows = this.filterItem("show", arr)
                return shows
            }
        },

        // get item in specific array based on specific type
        filterItem(type, arr){
            let filteredItems = []
            
            filteredItems = arr.filter(item =>{
                return item.type == type
            })

            return filteredItems
        },

        // sum rated movies and tv shows
        // main menu (watchlist, rated, seen)
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

        // type = item in menu, arr = array of items, db = name of array
        // submenu (all, movies, shows)
        itemCounter(type, arr, name){
            if(this.menuItemActive == name) {

                if(type == "all") {
                    return arr.length 
                }

                if(type == "movie") {
                    let movies = this.filterItem("movie", arr)
                    return movies.length
                }

                if(type == "show") {
                    let movies = this.filterItem("show", arr)
                    return movies.length
                }
            }  
        },

        sortBy(array, param, reverse) {
            let _this = this
			let filterA, filterB;
			return array.sort(function (a, b) {
				switch (param) {
					case 'title':
						filterA = b.title;
                        filterB = a.title;
                        _this.sorting.text = "title"
                        break;
                    case 'rate':
						filterA = b.rate;
                        filterB = a.rate;
                        _this.sorting.text = "rating"
                        break;
                    case 'year':
						filterA = b.year;
                        filterB = a.year;
                        _this.sorting.text = "year"
                        break;
                    case 'user_rate':
						filterA = b.user_rate;
                        filterB = a.user_rate;
                        _this.sorting.text = "your rate"
                        break;
                    case 'added':
						filterA = b.added;
                        filterB = a.added;
                        _this.sorting.text = "added"
						break;
				}
				if (reverse) {
                    return (filterA > filterB) ? 1 : -1;
				} else {
                    return (filterA < filterB) ? 1 : -1;
				}
            });

        },
        
        sortStatus(){
            if (this.reverse) {
                return `des`
            } else return `asc`
        },

        // scroll to top
        // scrollToTop(time) {
        //     this.$store.commit('scrollToTop', time)
        // },
        // back to top button is appear
        // backToTopBtn() {
        //     this.$store.commit('backToTopBtn')
        // },
 
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

        // get data from firebase from specific databese
        getDBData(dbName, arr){
            db.collection(dbName).orderBy('rate', 'desc').where('user', '==', this.user.id).get().then(snapshot => {
                snapshot.forEach(doc => {
                    let record = doc.data()
                    record.id = doc.id

                    arr.push(record)
                })
            
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
                    // watchlist database
                    this.getDBData('watchlist', this.user.watchlist.all)
                    // rating databbase
                    this.getDBData('rated', this.user.rated.all)
                    // seen database
                    this.getDBData('seen', this.user.seen.all)

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

        // delete item from database - watchlist
        deleteWatchlistItem(id){
            db.collection('watchlist').doc(id).delete().then(()=> {
               
                    this.user.watchlist.all = this.user.watchlist.all.filter(item =>{
                        return item.id != id
                    })
                      
            })
        },

        // delete item from database - rated
        deleteRatedItem(id){
            db.collection('rated').doc(id).delete().then(()=> {
                this.user.rated.all= this.user.rated.all.filter(item =>{
                        return item.id != id
                    })
                    
            })
        },

        // delete item from database - seen
        deleteSeenItem(id){
            db.collection('seen').doc(id).delete().then(()=> {
                this.user.seen.all= this.user.seen.all.filter(item =>{
                        return item.id != id
                    })
                    
            })
        },

        // feedback
        feedback(arr, type, menu){
            if(!arr.length && menu == "watchlist"){
                if(type == "all") {
                    return `Your watchlist is empty.`
                }
                if(type == "movie") {
                    return `You don't have any movies in the watchlist.`
                }
                if(type == "show") {
                    return `You don't have any TV shows in the watchlist.`
                }
            }
            if(!arr.length && menu == "rating"){
                if(type == "all") {
                    return `You have no rated movies or TV shows.`
                }
                if(type == "movie") {
                    return `You have no rated movies.`
                }
                if(type == "show") {
                    return `You have no rated TV shows.`
                }
            }
            if(!arr.length && menu == "seen"){
                if(type == "all") {
                    return `No movies or TV shows marked as seen.`
                }
                if(type == "movie") {
                    return `No movies marked as seen.`
                }
                if(type == "show") {
                    return `No TV shows marked as seen.`
                }
            }
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

    .item {
        transition: all .6s;
        width: 190px;
    }

    .animation-enter, .animation-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }

    .animation-leave-active {
        position: absolute;
    }





</style>