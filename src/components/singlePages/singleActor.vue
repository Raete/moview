<template><div >
    <div class="loading" v-if="loading">
            <img src="@/assets/img/svg/loader.svg" alt="loading..." >
            </div>

    <main v-if="!loading" class="main animated"  >
        <img class="poster" :src="actor.img.profile_path" alt="">
        <div class="main_container">
            <!-- back button -->
            <div @click="goBack()"> 
                <div class="back_btn">
                    <i class="material-icons">
                        keyboard_backspace
                    </i>
                    back
                </div>
            </div>
            <!-- person detail info - image -->
            <img class="cast_img" :src="actor.data.profile_path" alt="">
            <section class="info_wrapper">
                <h1 v-if="actor.data.name" class="info_name">{{actor.data.name}}</h1>
                <!-- person overview -->
                <div class="info_overview_wrapper">
                    <h1 v-if="actor.data.biography" class="info_overview_title">Biography</h1>
                    <p class="info_overview_text"><pre>{{actor.data.short}}</pre></p>
                    <!-- more overview -->
                    <v-dialog v-model="dialog" width="600px" >
                        <button v-if="is.long" class="overview_btn" slot="activator" color="primary" dark>All biography</button>
                        <v-card class="overview_more">
                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn icon flat @click.native="dialog = false">
                                <v-icon>close</v-icon>
                            </v-btn>

                            </v-card-actions>
                            <v-card-text > <pre>{{actor.data.biography}}</pre> </v-card-text>
                            
                        </v-card>
                    </v-dialog>
                </div>
            </section>
        </div>

    </main>
    <section v-if="!loading" class="item_container animated">
        <!-- known for -->
        <h1 class="recommend"> Known for</h1> 
        <div class="item_wrapper">
            <div class="item" v-for="(film, index) in actor.movieKnown" :key="index">
                <router-link :to="{ name: 'singleMovie', params: { id: film.id } }"> 
                    <app-itemList>
                        <template slot="rate">{{film.vote_average}}</template>
                        <template slot="year">{{film.release_date}}</template>
                        <img slot="img" class="item_img" v-bind:src="film.poster_path" alt="">
                    </app-itemList>
                </router-link>
                <h1 class="item_name"> {{film.title}} </h1>
            </div>
        </div> 
    </section>
    <section v-if="!loading" class="acting animated">
        <!-- acting list -->
        <h1 class="acting_title">Acting</h1> 
        <v-tabs color="transparent" >
            <v-tabs-slider color="black" ></v-tabs-slider>

            <v-tab class="tab_menu_item" href="#movies">
                Movies
            </v-tab>
            <v-tab class="tab_menu_item" href="#tvShows">
                TV Shows
            </v-tab>
           <!-- movies list -->
            <v-tab-item class="tab_item" id="movies">
                <ul class="acting_list">
                    <li  v-for="(film, index) in  actor.movieCredits" :key="index">
                        <router-link class="acting_item" :to="{ name: 'singleMovie', params: { id: film.id } }"> 
                        <div class="acting_info">
                            <p class="acting_year">{{film.release_date}}</p>
                            <div class="acting_film">
                                <h3 class="acting_name">{{film.title}}</h3>
                                <p class="acting_role">{{film.character}}</p>
                            </div>
                        </div>
                        <span class="acting_rate">
                            {{film.vote_average}} 
                            <img src="@/assets/img/svg/star_g.svg">
                        </span>
                        </router-link>
                    </li>
                </ul>
            </v-tab-item>
            <!-- shows list -->
            <v-tab-item class="tab_item" id="tvShows">
                <ul class="acting_list">
                    <li  v-for="(film, index) in  actor.showCredits" :key="index">
                        <router-link class="acting_item" :to="{ name: 'singleShow', params: { id: film.id } }"> 
                        <div class="acting_info">
                            <p class="acting_year">{{film.first_air_date}}</p>
                            <div class="acting_film">
                                <h3 class="acting_name">{{film.name}}</h3>
                                <p class="acting_role">{{film.character}}</p>
                            </div>
                        </div>
                        <span class="acting_rate">
                            {{film.vote_average}} 
                            <img src="@/assets/img/svg/star_g.svg">
                        </span>
                        </router-link>
                    </li>
                </ul>
            </v-tab-item>
        </v-tabs>
    </section>
    <app-footer></app-footer>
   
</div></template>

<script>
import footer from '@/components/parts/footer.vue';
import itemList from '@/components/templates/itemList.vue';
import axios from 'axios';


export default {
    components: {
        'app-footer': footer,
        'app-itemList': itemList,
    },

    data () {
        return {
            dialog: false,
            loading: false,
        }
    },

    created(){
       
        // render actor data
        this.getActorData()
        // render movies credits
        this.getMovieCredits()
        // render shows credits
        this.getShowCredits()
        // render movie known
        this.getMovieKnow()
        // render actor image
        this.getActorImg()

    },

    computed: {
        //get data from store
        URL(){ return this.$store.state.URL },
        holder(){ return this.$store.state.holder },
        actor(){ return this.$store.state.actor },
        is(){ return this.$store.state.is },    
    },

    methods: {
       
        //go back
        goBack(){
            return window.history.back();
        },
        // sort movies and tv shows by year
        dynamicSort(property) {
            var sortOrder = 1;
            if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a,b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        },    
        // get actor data from database
        getActorData() {
            this.loading = true
            axios.get(`${this.URL.database}person/${this.$route.params.id}${this.URL.apiKey}`)
            .then(res => {
                const URLFace = "https://image.tmdb.org/t/p/w235_and_h235_face"
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
                    this.actor.data.profile_path = URLFace + this.actor.data.profile_path
                } else if (this.actor.data.profile_path == null) {
                    this.actor.data.profile_path = this.holder.person
                }
            }).then(()=> { 
                this.loading = false
            })  
        },
        // get image of actor
        getActorImg() {
            this.loading = true
            this.actor.img = ""
            axios.get(`${this.URL.database}person/${this.$route.params.id}${this.URL.apiKey}`)
            .then(res => {
                this.actor.img = res.data
                const URL = "https://image.tmdb.org/t/p/original"
                // if is no image replace with holder
                if (this.actor.img.profile_path) {
                    this.actor.img.profile_path = URL + this.actor.img.profile_path
                } else if (this.actor.img.profile_path == null) {
                    this.actor.img.profile_path = this.holder.photo
                }
            }).then(()=> {
                this.loading = false
            })  
        },
        // get movies credits
        getMovieCredits() {
            this.loading = true
            axios.get(`${this.URL.database}person/${this.$route.params.id}/movie_credits${this.URL.apiKey}`)
            .then(res => {
                this.actor.movieCredits = res.data.cast
                // sort list of movies by date
                this.actor.movieCredits = this.actor.movieCredits.sort(this.dynamicSort("-release_date"))
                this.actor.movieCredits.forEach((date)=>{
                    // if somethig missing replace with ????
                    if (!date.release_date) {
                        date.release_date = "????"
                    } else {
                        date.release_date = date.release_date.slice(0,4)
                    }
                    if (!date.character) {
                        date.character = "????"
                    } 
                    if (!date.title) {
                        date.title = "????"
                    } 
                })

            }).then(()=> {
                this.loading = false
            }) 
        },
        // get shows credits
        getShowCredits() {
            this.loading = true
            axios.get(`${this.URL.database}person/${this.$route.params.id}/tv_credits${this.URL.apiKey}`)
            .then(res => {
                this.actor.showCredits = res.data.cast
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
           
            }).then(()=> {
                this.loading = false
            }) 
        },
        // get movie known
        getMovieKnow() {
            this.loading = true
            axios.get(`${this.URL.database}person/${this.$route.params.id}/movie_credits${this.URL.apiKey}`)
            .then(res => {
                const URL = "https://image.tmdb.org/t/p/w500"
                const URLFace = "https://image.tmdb.org/t/p/w235_and_h235_face"
                this.actor.movieKnown = res.data.cast
                // if is no poster image replace with holder
                this.actor.movieKnown.forEach((poster)=>{
                    if (poster.poster_path) {
                        poster.poster_path = URL + poster.poster_path
                    } else if (poster.poster_path == null) {
                        poster.poster_path = this.holder.photo
                    }
                })
                // get just year from release date
                this.actor.movieKnown.forEach((year)=>{
                    if(year.release_date) {
                        year.release_date = year.release_date.slice(0,4)
                    } else {
                         year.release_date = "????"
                    }
                })
                // sort movie by rate
                this.actor.movieKnown.sort(this.dynamicSort("-vote_average"))
                // render only 6 movies
                if (this.actor.movieKnown) {
                    this.actor.movieKnown = this.actor.movieKnown.slice(0,6)
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
