<template><div >
    <v-app>
        <div class="loading" v-if="loading">
            <img src="@/assets/img/svg/loader.svg" alt="loading..." >
        </div>
        <!-- open full overview -->
        <v-dialog v-model="dialog" width="600px" >
            <v-card class="overview_more">
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn icon flat @click.native="dialog = false">
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

        <section v-if="is.acting" class="acting animated" id="acting">
                <!-- acting list -->
                <h1 class="acting_title">Acting</h1> 
                <div v-if="!loading" class="acting_wrapper">
                <v-tabs color="transparent" >
                    <v-tabs-slider color="black" ></v-tabs-slider>

                    <v-tab class="tab_menu_item" href="#movies" v-if="is.movies"  >
                        Movies
                    </v-tab>
                    <v-tab class="tab_menu_item" href="#tvShows" v-if="is.shows">
                        TV Shows
                    </v-tab>
                    <!-- movies list -->
                    <v-tab-item class="tab_item" id="movies">
                        <v-list three-line class="list">
                            <template v-for="(film, index) in  actor.movieCredits">
                                <v-list-tile
                                    :key="index"
                                    ripple
                                    :to="{ name: 'singleMovie', params: { id: film.id } }"
                                    class="list_item"
                                >
                                    <!-- movie poster -->
                                    <v-list-tile-action>
                                        <img class="list_img" :src="film.poster_path" alt="">
                                    </v-list-tile-action>
                                    <!-- date -->
                                    <v-list-tile-action>
                                        <v-list-tile-action-text class="list_year">
                                            {{film.release_date}} 
                                        </v-list-tile-action-text>
                                    </v-list-tile-action>
                                    <!-- movie title and role -->
                                    <v-list-tile-content>
                                        <v-list-tile-title class="list_name">
                                            {{film.title}}
                                        </v-list-tile-title>
                                        <v-list-tile-sub-title class="list_role">
                                            {{film.character}}
                                        </v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    <!-- rate -->
                                    <v-list-tile-action>
                                        <v-list-tile-action-text class="list_rate">
                                            {{film.vote_average}}%                                   
                                        </v-list-tile-action-text>
                                    </v-list-tile-action>
                                </v-list-tile>   
                            </template>
                        </v-list>
                    </v-tab-item>
                    <!-- shows list -->
                    <v-tab-item class="tab_item" id="tvShows">
                        <v-list three-line class="list">
                            <template v-for="(film, index) in  actor.showCredits">
                                <v-list-tile
                                    :key="index"
                                    ripple
                                    :to="{ name: 'singleShow', params: { id: film.id } }"
                                    class="list_item"
                                >
                                    <!-- tv show poster -->
                                    <v-list-tile-action>
                                        <img class="list_img" :src="film.poster_path" alt="">
                                    </v-list-tile-action>
                                    <!-- date -->
                                    <v-list-tile-action>
                                        <v-list-tile-action-text class="list_year">
                                            {{film.first_air_date}} 
                                        </v-list-tile-action-text>
                                    </v-list-tile-action>
                                    <!-- tv show title and role -->
                                    <v-list-tile-content>
                                        <v-list-tile-title class="list_name">
                                            {{film.name}}
                                        </v-list-tile-title>
                                        <v-list-tile-sub-title class="list_role">
                                            {{film.character}}, ({{film.episode_count}})
                                        </v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    <!-- rate-->
                                    <v-list-tile-action>
                                        <v-list-tile-action-text class="list_rate">
                                            {{film.vote_average}}%
                                        </v-list-tile-action-text>
                                    </v-list-tile-action>
                                </v-list-tile>
                            </template>
                        </v-list>
                    </v-tab-item>
                </v-tabs>
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
    <button @click="scrollToTop(300) " class="up" :class="{ up_active: show.backToTop }"> go to top</button>
   
</div></template>

<script>
// components
import footer from '@/components/parts/footer.vue';
// API database
import axios from 'axios';
// vuex -- store
import { mapState, mapMutations } from 'vuex';


export default {
    components: {
        'app-footer': footer,
    },

    data () {
        return {

            loading: false,
            // overview
            dialog: false,
        }
    },

    created(){
        // render actor data
        this.getActorData()
         // back to seasons button
        window.addEventListener("scroll", this.backToTopBtn)
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
        ]),  
    },

    methods: {
        //go back
        goBack(){
            return window.history.back();
        },
        // sort movies and tv shows by year
        dynamicSort(property) {
            let sortOrder = 1;
            if (property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a,b) {
                let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        },

        // scroll up and show overview
        showViewOnTop(){
            this.scrollToTop(300)
            this.dialog = !this.dialog
        },

        // scroll to top
        scrollToTop(time) {
            this.$store.commit('scrollToTop', time)
        },

        // back to top button is appear
        backToTopBtn() {
            this.$store.commit('backToTopBtn')
        },

        // API
        // get actor data from API
        getActorData() {
            this.loading = true
            this.actor.data = ""

            axios.get(`${this.URL.database}person/${this.$route.params.id}${this.URL.apiKey}&append_to_response=movie_credits,tv_credits`)
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
                    this.actor.data.profile_path = this.URL.actor + this.actor.data.profile_path
                    // create actor picture for mobile device (square picture)
                    this.actor.data.profile_path_face = this.URL.face + this.actor.data.profile_path_face
                    // if profile path dont exist replace image holder
                } else if (this.actor.data.profile_path == null) {
                    this.actor.data.profile_path = this.holder.detail
                    this.actor.data.profile_path_face = this.holder.person
                }
                //** MOVIES CREDITS **//
                //*******************//
                // COPY data from database to actor.movieCredits 
                if (this.actor.movieCredits ) {
                    this.actor.movieCredits = res.data.movie_credits.cast.slice()
                }
               
                // show movies section if exist
                if (this.actor.movieCredits.length > 0) {
                    this.is.movies = true
                    // sort list of shows by date
                    this.actor.movieCredits = this.actor.movieCredits.sort(this.dynamicSort("-release_date"))
                    this.actor.movieCredits.forEach((date)=>{
                        if (date.release_date) {
                            date.release_date = date.release_date.slice(0,4)
                        }
                        // if somethig missing replace with ????
                        if (date.release_date == "") {
                            date.release_date = "????"
                        } 
                        if (date.character == "") {
                            date.character = "????"
                        } 
                        if (date.title == "") {
                            date.title = "????"
                        } 
                    })

                    // if is no poster image replace with holder
                    this.actor.movieCredits.forEach((poster)=>{
                        if (poster.poster_path) {
                            poster.poster_path = URL + poster.poster_path
                        } else if (poster.poster_path == null) {
                            poster.poster_path = this.holder.photo
                        }
                    })

                    // rate number formating to one decimal
                    this.actor.movieCredits.forEach((rate)=>{
                        rate.vote_average =  rate.vote_average * 10
                    })

                } else if (this.actor.movieCredits.length <= 0) {
                    this.is.movies = false
                }

                //** TV SHOWS CREDITS **//
                //*********************//
                this.actor.showCredits = res.data.tv_credits.cast
        
                // show tv shows section if exist
                if (this.actor.showCredits.length > 0) {
                    this.is.shows = true
                    // sort list of shows by date
                    this.actor.showCredits = this.actor.showCredits.sort(this.dynamicSort("-first_air_date"))
                    this.actor.showCredits.forEach((date)=>{
                        if (date.first_air_date) {
                            date.first_air_date = date.first_air_date.slice(0,4)
                        }
                        // if somethig missing replace with ????
                        if (date.first_air_date == "") {
                            date.first_air_date = "????"
                        } 
                        if (date.character == "") {
                            date.character = "????"
                        } 
                        if (date.title == "") {
                            date.title = "????"
                        } 

                    })

                    // if is no poster image replace with holder
                    this.actor.showCredits.forEach((poster)=>{
                        if (poster.poster_path) {
                            poster.poster_path = URL + poster.poster_path
                        } else if (poster.poster_path == null) {
                            poster.poster_path = this.holder.photo
                        }
                    })

                    // rate number formating to one decimal
                    this.actor.showCredits.forEach((rate)=>{
                        rate.vote_average =  rate.vote_average * 10
                    })

                } else if (this.actor.showCredits.length <= 0) {
                    this.is.shows = false
                }
                
                // add plural of episode if is more then 1
                this.actor.showCredits.forEach((ep)=>{
                    if (ep.episode_count > 1) {
                        ep.episode_count = ep.episode_count + " episodes"
                    } else if (ep.episode_count == 1) {
                        ep.episode_count = ep.episode_count + " episode"
                    }
                })

                // show acting section if exist
                if (this.actor.showCredits.length > 0){
                    this.is.acting = true
                } else if (this.actor.showCredits.length <= 0) {
                    this.is.acting = false
                }

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
    @import '../../assets/scss/singlePage/_actor';
</style>
