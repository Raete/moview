<template><div >
    <v-app>
        <div class="loading" v-if="loading">
            <img src="@/assets/img/svg/loader.svg" alt="loading..." >
        </div>

        <!-- open full overview -->
        <v-dialog v-model="box.overview" width="600px" >
            <v-card class="overview_more">
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn icon flat @click.native="box.overview = false" >
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-actions>
                <v-card-text > 
                    <pre class="pre_text">{{actor.data.biography}}</pre> 
                </v-card-text>
            </v-card>
        </v-dialog>

        <main v-if="!loading" class="main animated">
            <!-- poster -->
            <div class="poster">
                <img class="poster" :src="actor.data.profile_path" alt="">
            </div>
           
            <div class="main_container">
                <!-- back button -->
                <header class="main_container_header">
                    <v-btn class="btn_animated_left" flat round @click="goBack()" >
                        <v-icon color="primary"> keyboard_backspace </v-icon>
                        back
                    </v-btn>           
                </header>
                
                <section class="info_wrapper">
                    <h1 v-if="actor.data.name" class="info_name">{{actor.data.name}}</h1>
                    <!-- person overview -->
                    <div class="info_overview_wrapper">
                        <h1 v-if="actor.data.biography" class="info_overview_title">Biography</h1>
                        <p class="info_overview_text"><pre class="pre_text">{{actor.data.short}}</pre></p>
                        <!-- more overview button -->
                        <button v-if="is.long" @click.stop="showViewOnTop()" class="btn_overview" slot="activator" color="primary" dark>All biography</button>
                    </div>
                </section>
            </div>
        </main> 

        <!-- actor's departments menu -->
        <v-tabs color="white" v-model="currentTab" centered height="80px">
            <v-tabs-slider color="black" ></v-tabs-slider>
            <v-tab class="tab_menu_item" v-for="(item, index) in menu" :key="index" :href="`#${item}`">
                {{item}}
            </v-tab>
        </v-tabs>
        
        <!-- section with actor movies or tv shows based on department -->
        <section v-if="is.acting" class="acting animated" id="acting">
            <div v-if="!loading" class="acting_wrapper">
                
                <v-tabs-items v-model="currentTab">
                    <v-tab-item 
                        :transition="false" 
                        :reverse-transition="false" 
                        class="tab_item" 
                        v-for="(item, index) in menu" 
                        :key="index" 
                        :value="`${item}`"
                    >
                        <!-- box title -->
                        <h1 class="list_heading">{{item}}</h1>

                        <v-toolbar flat >
                            <!-- filter all item, movies, tv shows -->
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
                            <v-menu v-if="actor.roles.length">
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
                                </v-list>
                            </v-menu>
                        </v-toolbar>

                        <!-- list of movies and tv shows -->
                        <v-list three-line class="list">
                            {{feedback(render, currentTab, activeRender)}}
                            
                            <transition-group name="animation" tag="div">
                                <v-list-tile
                                    v-for=" film in  render"
                                    :key="film.id"
                                    ripple
                                    :to="{ name: setHref(film.media_type), params: { id: film.id } }"
                                    class="list_item"
                                >
                                    <!-- item poster -->
                                    <v-list-tile-action>
                                        <img class="list_img" :src="film.poster_path" alt="">
                                    </v-list-tile-action>

                                    <!-- item year -->
                                    <v-list-tile-action>
                                        <v-list-tile-action-text class="list_year">
                                            {{film.release_date}} 
                                        </v-list-tile-action-text>
                                    </v-list-tile-action>

                                    <!-- item info -->
                                    <v-list-tile-content>
                                        <!-- item title -->
                                        <v-list-tile-title class="list_name">
                                            {{film.title}}
                                        </v-list-tile-title>
                                        <!-- item character -->
                                        <v-list-tile-sub-title class="list_role">
                                            {{film.character}} {{film.episode_count}}
                                        </v-list-tile-sub-title>
                                        <!-- item job -->
                                        <v-list-tile-sub-title class="list_role">
                                            {{film.job}}
                                        </v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    
                                    <!-- item rating -->
                                    <v-list-tile-action>
                                        <v-list-tile-action-text class="list_rate">
                                            {{film.vote_average}}%                                   
                                        </v-list-tile-action-text>
                                    </v-list-tile-action>
                                </v-list-tile>  
                            </transition-group>   
                        </v-list>

                    </v-tab-item>
                </v-tabs-items>
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

    <!-- go up button -->
    <button 
        @click="scrollToTop(300)" 
        class="up" 
        :class="{ up_active: show.backToTop }"
    > go to top </button>
   
</div></template>

<script>
// components
import footer from '@/components/parts/footer.vue';
// API database
import axios from 'axios';
// vuex -- store
import { mapState } from 'vuex';
// mixins
import { scroll } from '../../mixins/scroll'
import { unique, setHref } from '../../mixins/global'
import { actorFeedback } from '../../mixins/feedbacks'
import { renderItems, filterItem, itemCounter, sortby, dynamicSort, createArrByType } from '../../mixins/sorting'

export default {
    mixins: [
        scroll, 
        setHref, unique, 
        actorFeedback,
        renderItems, filterItem, itemCounter, sortby, dynamicSort, createArrByType
    ],

    components: {
        'app-footer': footer,
    },

    data () {
        return {

            loading: false,

            // departments
            menu: [],

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
        // render actor data
        this.getActorData()
        // back to seasons button
        window.addEventListener("scroll", this.backToTopBtn)

    },

    watch: {
        currentTab(val){
            // show items based on department
            this.createArrByType(val, this.actor.roles)
            // set filter menu to "all"
            this.activeRender =  "all"
         
        },
    },

    computed: {
        //get data from store
        ...mapState([
            'URL',
            'holder',
            'detail',
            'actor',
            'is', 
            'user', 
            'alert',
            'show',
            'box',
        ]),  

    },

    methods: {

        //go back
        goBack(){
            return window.history.back();
        },

        // API
        // get actor data from API
        getActorData() {
            this.loading = true
            this.actor.data = {}

            axios.get(`${this.URL.database}person/${this.$route.params.id}${this.URL.apiKey}&append_to_response=combined_credits`)
            .then(res => {
                const URL = "https://image.tmdb.org/t/p/w500"

                //** ACTOR DATA **//
                //***************//
                this.actor.data = res.data
                // show only 350 characters overview
                if (this.actor.data.biography.length > 350) {
                    this.is.long = true
                    this.actor.data.short = this.actor.data.biography.slice(0,350) + "..."
                } else { 
                    this.actor.data.short = this.actor.data.biography 
                    this.is.long = false
                }
                // if is no poster image replace with holder
                if (this.actor.data.profile_path) {
                    // copy profile path to profile path face
                    this.actor.data.profile_path_face = res.data.profile_path.slice()
                    // create full url of actor poster (desktop picture)
                    this.actor.data.profile_path = this.URL.poster + this.actor.data.profile_path
                    // create actor picture for mobile device (square picture)
                    this.actor.data.profile_path_face = this.URL.face + this.actor.data.profile_path_face
                    // if profile path dont exist replace image holder
                } else if (this.actor.data.profile_path == null) {
                    this.actor.data.profile_path = this.holder.detail
                    this.actor.data.profile_path_face = this.holder.person
                }

                // set item in department menu to actor known department
                this.currentTab = this.actor.data.known_for_department
            
                //** MOVIES AND TV SHOWS CREDITS **//
                //********************************//
                // COPY data from database to local arrays
                this.actor.cast = res.data.combined_credits.cast.slice()
                this.actor.crew = res.data.combined_credits.crew.slice()

                // add department to movie in cast
                this.actor.cast.forEach(item=>{
                    item.department = "Acting"
                })

                // merge cast array and crew array together
                this.actor.roles = this.actor.cast.concat(this.actor.crew)
                
                this.actor.roles.forEach(item=>{
                    // rename item (because in database is diferent keys for tv and movie)
                    if(item.media_type == "tv") {
                        item.title = item.name
                        item.release_date = item.first_air_date
                    }
                    // episode counter    
                    if (item.episode_count > 1) {
                        item.episode_count = `(${ item.episode_count} episodes)` 
                    } else if (item.episode_count == 1) {
                        item.episode_count = `(${ item.episode_count} episode)` 
                    }
                })

                // create departments menu
                let departments = []
                this.actor.roles.forEach(department => {
                    departments.push(department.department)
                })

                // remove same department
                this.menu = [...new Set(departments)]
                
                // sort list by date
                this.actor.roles = this.actor.roles.sort(this.dynamicSort("-release_date"))

                this.actor.roles.forEach((movie)=>{
                    // get only year form release date
                    if (movie.release_date) {
                        movie.release_date = movie.release_date.slice(0,4)
                    }
                    // if somethig missing replace with ????
                    if (movie.release_date == "") {
                        movie.release_date = "????"
                    } 
                    if (movie.character == "") {
                        movie.character = "????"
                    } 
                    if (movie.title == "") {
                        movie.title = "????"
                    } 
                })

                // if is no poster image replace with holder
                this.actor.roles.forEach((poster)=>{
                    if (poster.poster_path) {
                        poster.poster_path = URL + poster.poster_path
                    } else if (poster.poster_path == null) {
                        poster.poster_path = this.holder.photo
                    }
                })

                // rate number formating to one decimal
                this.actor.roles.forEach((rate)=>{
                    rate.vote_average =  rate.vote_average * 10
                })

            }).then(()=> { 
                this.loading = false
          
            })  
        },
    },
}
</script>


<style lang='scss' scoped>
    @import '../../assets/scss/_variables';
    @import '../../assets/scss/parts/_general';
    @import '../../assets/scss/parts/_itemList';
    @import '../../assets/scss/pages/_actor';

    // animation in list items
    .list_item {
        transition: all .6s;
        height: 100px;
    }

    .animation-enter, .animation-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }

    .animation-leave-active {
        position: absolute;
    }

</style>
