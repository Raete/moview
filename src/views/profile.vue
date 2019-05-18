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

            <!-- department menu -->
            <v-tabs color="white" v-model="currentTab" centered height="80px">
                <v-tabs-slider color="black" ></v-tabs-slider>

                <v-tab 
                    class="tab_menu_item" 
                    color="primary" 
                    v-for="(item, index) in menu" 
                    :key="index" 
                    ripple 
                    :href="`#${item}`"
                >
                    {{item}} 
                </v-tab>
            </v-tabs>

            <v-tabs-items v-model="currentTab">
                <v-tab-item 
                    :transition="false" 
                    :reverse-transition="false" 
                    class="tab_item" 
                    v-for="(item, index) in menu" 
                    :key="index" 
                    :value="`${item}`"
                >
                    <h1 class="list_heading">My {{item}}</h1>
                    <!-- submenu -->
                    <v-toolbar flat >
                        <v-btn-toggle mandatory v-model="activeRender">
                            <v-btn
                                v-for="(item, index) in submenu" :key="index"
                                flat                               
                                class="mr-2"
                                :value="item.type"
                            >
                                {{item.name}} ({{itemCounter(item.name, itemsByType)}})
                            
                            </v-btn>
                        </v-btn-toggle>
                        <v-spacer></v-spacer>

                        <!-- sorting menu -->
                        <v-menu v-if="user.items.length">
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
                            <v-list-tile @click="sortBy(itemsByType, 'rate', reverse = !reverse)">
                                    <v-list-tile-title>Rating</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="sortBy(itemsByType, 'title', reverse = !reverse)">
                                    <v-list-tile-title >Title</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="sortBy(itemsByType, 'year', reverse = !reverse)">
                                    <v-list-tile-title >Year</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="sortBy(itemsByType, 'added', reverse = !reverse)">
                                <v-list-tile-title >Added</v-list-tile-title>
                            </v-list-tile>
                            </v-list>
                        </v-menu>
                        
                    </v-toolbar>

                    <!-- list of items -->
                    <section class="item_container">
                        <p class="text-xs-center">{{feedback(render, activeRender, currentTab,)}}</p>
            
                        <transition-group name="animation" tag="div" class="item_wrapper">
                            <div class="item" v-for="film in render" :key="film.id">
                                
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
                                
                                <div class="item_info">

                                    <div v-if="currentTab == 'rating'" class="item_rate">your rate: {{film.user_rate}}%</div>
                                    <div v-else class="item_rate">{{film.rate}}%</div>
                                    <v-btn icon ripple class="item_delete">
                                        <v-icon @click.prevent="deleteItem(film.id, film.department)">close</v-icon>
                                    </v-btn>
                                    
                                    <router-link class="item_title_box" :to="{ name: film.href, params: { id: film.iId } }">  
                                        <h1 class="item_name"> {{film.title}} </h1>
                                        <span class="item_year"> {{film.release_date}} </span>
                                    </router-link>
                                </div>
                            </div>
                        </transition-group> 
                  
                    </section>

                </v-tab-item>
            </v-tabs-items>

        </v-container>
    </v-app>
    <app-footer></app-footer>
    <!-- go up button -->
    <button 
        @click="scrollToTop(300) " 
        class="up" 
        :class="{ up_active: show.backToTop }"
    > 
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
import { mapState } from 'vuex';
// moment
import moment from 'moment'
// mixins
import { unique, setHref } from '../mixins/global'
import { profileFeedback } from '../mixins/feedbacks'
import { renderItems, filterItem, itemCounter, sortby, dynamicSort, createArrByType } from '../mixins/sorting'



export default {
    mixins: [
        setHref, unique, 
        profileFeedback,
        renderItems, filterItem, itemCounter, sortby, dynamicSort, createArrByType
    ],
    components: {
        'app-menu': menu,
        'app-footer': footer,
    },

    name: 'profile',
    data () {
        return {
            loading: false,

            // departments
            menu: ["watchlist", "rating", "seen"],

            // array of items by departments
            itemsByType:[],

            // current tab in menu
            currentTab: "",

            // filter menu
            submenu: [
                {type: "all", name: "all" },
                {type: "movie", name: "movies"},
                {type: "tv", name: "shows"},
            ],

            // current tab in submenu
            activeRender: "all",
            
            // sort by
            reverse: true,
            sorting: {
                text: "rating",
            },
            
        }
    },
    created(){
        this.init()
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
            'user',
        ]),

    },

    watch: {
        currentTab(val){
            // show items based on current tab
            this.createArrByType(val, this.user.items)
            this.activeRender =  "all"
        },
        
    },


    methods: {
        init(){
        
            this.user.login = null,
            this.user.id = null,
            this.user.name = "",
            this.user.date = "",
            this.user.photo = "",
            this.user.items = [],
            this.itemsByType = []
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

        // get data from firebase from specific databese
        getDBData(dbName){
            db.collection(dbName).orderBy('rate', 'desc').where('user', '==', this.user.id).get().then(snapshot => {
                snapshot.forEach(doc => {
                    let record = doc.data()
                    record.id = doc.id

                    this.user.items.push(record)
                    
                })
                let departments = []
                this.user.items.forEach(department => {
                    departments.push(department.department)
                })

                this.currentTab = "watchlist"
            
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
                })

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
                    this.getDBData('watchlist')
                    // rating databbase
                    this.getDBData('rating')
                    // seen database
                    this.getDBData('seen')

               
            }).then(() => {
                this.loading = false
            }).catch(error => {
                console.log(error)
            })
            
        },

        // logout current user redirect to login page
        logout(){
            firebase.auth().signOut().then(() => {
                this.$router.push({ name: 'login'})
            })
        },

        // delete item from database 
        deleteItem(id, department){
            db.collection(department).doc(id).delete().then(()=> {
               
                this.itemsByType = this.itemsByType.filter(item =>{
                    return item.id != id
                })

                this.user.items = this.user.items.filter(item =>{
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