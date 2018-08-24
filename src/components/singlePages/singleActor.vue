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
                    <v-btn flat round @click="goBack()" >
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

        <section v-if="!loading && is.recomend"  class=" animated">
            <!-- known for -->
            <div class="item_container">
                <h1 class="recommend" > Known for</h1> 
                <!-- movies -->
                <h2 class="recommend_sub">movies</h2>
                <div class="item_wrapper">
                    <div class="item" v-for="(film, index) in actor.movieKnown" :key="index">
                        <!-- poster -->
                        <router-link :to="{ name: 'singleMovie', params: { id: film.id } }"> 

                            <figure class="item_content animated" >
                                <img class="item_img" v-bind:src="film.poster_path" alt="">
                                <figcaption class="item_hover">
                                    <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                                </figcaption>           
                            </figure>

                        </router-link>
                        <!-- block with bookmark and rate -->
                        <div class="item_info">
                            <!-- bookmark -->
                            <v-btn v-model="markMovie" small fab depressed icon @click="markingButtonMovie(film.id, film)">
                                <v-icon size="25px">{{styleMarkIconMovie(film.id)}}</v-icon>
                            </v-btn> 
                            <!-- rate -->
                            <div class="item_rate">
                                {{film.vote_average}}%
                                
                            </div>
                        </div>
                        <!-- title -->
                        <h1 class="item_name"> {{film.title}} </h1>
                        <span class="item_year">{{film.release_date}}</span>
                    
                    </div>
                </div> 
                <!-- shows -->
                <h2 class="recommend_sub">TV Shows</h2>
                <div class="item_wrapper">
                    <div class="item" v-for="(film, index) in actor.TVKnown" :key="index">
                        <!-- poster -->
                        <router-link :to="{ name: 'singleShow', params: { id: film.id } }"> 

                            <figure class="item_content animated" >
                                <img class="item_img" v-bind:src="film.poster_path" alt="">
                                <figcaption class="item_hover">
                                    <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                                </figcaption>           
                            </figure>

                        </router-link>
                        <!-- block with bookmark and rate -->
                        <div class="item_info">
                            <!-- bookmark -->
                            <v-btn v-model="markShow" small fab depressed icon @click="markingButtonShow(film.id, film)">
                                <v-icon size="25px">{{styleMarkIconShow(film.id)}}</v-icon>
                            </v-btn> 
                            <!-- rate -->
                            <div class="item_rate">
                                {{film.vote_average}}%
                               
                            </div>
                        </div>
                        <!-- title -->
                        <h1 class="item_name"> {{film.original_name}} </h1>
                        <span class="item_year">{{film.first_air_date}}</span>
                    
                    </div>
                </div>
            </div>
        </section>

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
                        <v-list two-line class="list">
                            <template v-for="(film, index) in  actor.movieCredits">
                                <v-list-tile
                                    :key="index"
                                    ripple
                                    :to="{ name: 'singleMovie', params: { id: film.id } }"
                                    class="list_item"
                                >
                                    <v-list-tile-action>
                                        <v-list-tile-action-text class="list_year">{{film.release_date}} </v-list-tile-action-text>
                                    </v-list-tile-action>

                                    <v-list-tile-content>
                                        <v-list-tile-title class="list_name">{{film.title}}</v-list-tile-title>
                                        <v-list-tile-sub-title class="list_role">{{film.character}}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                    
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
                        <v-list two-line class="list">
                            <template v-for="(film, index) in  actor.showCredits">
                                <v-list-tile
                                    :key="index"
                                    ripple
                                    :to="{ name: 'singleShow', params: { id: film.id } }"
                                    class="list_item"
                                >
                                    <v-list-tile-action>
                                        <v-list-tile-action-text class="list_year">{{film.first_air_date}} </v-list-tile-action-text>
                                    </v-list-tile-action>

                                    <v-list-tile-content>
                                        <v-list-tile-title class="list_name">{{film.name}}</v-list-tile-title>
                                        <v-list-tile-sub-title class="list_role">{{film.character}}, ({{film.episode_count}})</v-list-tile-sub-title>
                                    </v-list-tile-content>
                    
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
    <button @click="scrollToTop(300) " class="up" :class="{ up_active: show }"> go to top</button>
   
</div></template>

<script>
// components
import footer from '@/components/parts/footer.vue';
// API database
import axios from 'axios';
// firebase
import db from '@/firebase/init'
import firebase from 'firebase'
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
            // back to top button is appear
            show: true,
            // bookmark
            markMovie: "",
            markShow: "",
            movieData: {},
            showData: {},
        }
    },

    created(){
        // render actor data
        this.getActorData()
         // back to seasons button
        window.addEventListener("scroll", this.scrollButton)
        // get data from firebase
        this.getFirebaseDataShow()
        this.getFirebaseDataMovie()
        
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
        // scrollToTop(scrollDuration) {
        //     var scrollStep = -window.scrollY / (scrollDuration / 15),
        //         scrollInterval = setInterval(function(){
        //         if ( window.scrollY != 0 ) {
        //             window.scrollBy( 0, scrollStep );
        //         }
        //         else clearInterval(scrollInterval); 
        //     },15)
        // },  
        // // scroll to anchor element (seasons)
        // scrollTo(time) {
        //     this.$store.commit('scrollToTop', time)
        // },
        // // smooth scrolling
        // smoothScrollTo(elem) {
        //     let _this = this
        //     let jump = parseInt(elem.getBoundingClientRect().top * .3);
        //     document.body.scrollTop += jump;
        //     document.documentElement.scrollTop += jump
        //     //lastjump detects anchor unreachable, also manual scrolling to cancel animation if scroll > jump
        //     if (!elem.lastjump || elem.lastjump > Math.abs(jump)) {
        //         elem.lastjump = Math.abs(jump)
        //         setTimeout(()=> {
        //         _this.smoothScrollTo(elem)
        //         }, 20)
        //     } else {
        //         elem.lastjump = null;
        //     }
        // },

        // scroll to top
        scrollToTop(time) {
            this.$store.commit('scrollToTop', time)
        },
        // back to top button is appear
        scrollButton() {
            if (window.scrollY >= 1000) {
                this.show = false
            } else {
                this.show = true
            }
        },
        // FIREBASE DATA
        // get movies data from firebase
        getFirebaseDataMovie(){
            // get current user from firebase if user is login
            if(firebase.auth().currentUser) {
                db.collection('users').where('user_id', '==', firebase.auth().currentUser.uid).get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        //user slug
                        this.user.id = doc.id

                        // read firebase database in real time
                        db.collection('movies_marked').where('user', '==', this.user.id)
                        .onSnapshot((snapshot) => {
                            snapshot.docChanges().forEach(change => {
                                // add movie to array if movie is add to database
                                if (change.type == 'added') {
                                    let record = change.doc.data()
                                    record.id = change.doc.id
                                    this.user.movies.mark.push(record)
                                }
                                // remove movie from array if movie is remove from database
                                if (change.type == 'removed') {
                                    this.user.movies.mark = this.user.movies.mark.filter(item =>{
                                        return item.id != change.doc.id
                                    }) 
                                }
                            })
                        })
                    })
                }) 
            }  
        },

        // get tv shows data from firebase
        getFirebaseDataShow(){
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
                                
                                if (change.type == 'added') {
                                    let record = change.doc.data()
                                    record.id = change.doc.id
                                    this.user.shows.mark.push(record)
                                }

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

        // BOOKMARK BUTTON -- MOVIE
        // decide if movie is already marked
        isMarked(id, arr){
            return arr.findIndex(el => el.iId == id) !== -1
        },
        // add movie to watchlist and send to firebase
        addMarkedItemMovie(id, arr){

            this.movieData = arr
            db.collection('movies_marked').add({
                id:     "",
                iId:    this.movieData.id,
                title:  this.movieData.title,
                genres: this.movieData.genre_ids,
                poster: this.movieData.poster_path,
                rate:   this.movieData.vote_average,
                year:   this.movieData.release_date,
                user:   this.user.id

            }).then(() => {
                // alert type and settings
                this.alert.type = "success"
                this.infoAlert("Successfully added to watchlist")
                
            })
            .catch(err => {
                console.log(err)
            })
        },
        // delete movie from firebase
        deleteMarkedItemMovie(id){
            // *iId (item id) is id of movie from API and id is id of item in firebase
            db.collection('movies_marked').where('user', '==', this.user.id).where('iId', '==', id).get()
            .then(snapshot => {
                // id of item in firebase
                let snapshotID = snapshot.docs[0].id
                // delete item from firebase
                db.collection('movies_marked').doc(snapshotID).delete().then(()=> {
                    // delete from local array
                    this.user.movies.mark = this.user.movies.mark.filter(item =>{
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
        markingButtonMovie(id, arr){
          
           // if user is login then:
            if(firebase.auth().currentUser){
                // if movie is not marked then:
                if (this.isMarked(id, this.user.movies.mark)) {
                    // add movie to marked
                    this.deleteMarkedItemMovie(id)
               
                // if movie is marked then:
                } else if (!this.isMarked(id, this.user.movies.mark)) {
                    // delete movie from marked 
                    this.addMarkedItemMovie(id, arr)
                }
            // if user is not login then:
            } else {
                // show alert 
                this.alert.type = "error"
                this.infoAlert("You must log in.")
            }

        },
        // stylize marking button depending on whether the movie is mark
        styleMarkIconMovie(id){
            // if user is login then:
            if(firebase.auth().currentUser){
                // if movie is not marked then:
                if (this.isMarked(id, this.user.movies.mark)) {
                    // slyle icon
                    return "bookmark"
                } else if (!this.isMarked(id, this.user.movies.mark)) {
                    // slyle icon
                    return "bookmark_border"
                }
            // if user is not login style icon
            } else return "bookmark_border"
        },

        // BOOKMARK BUTTON -- SHOW
        // add show to watchlist and send to firebase
        addMarkedItemShow(id, arr){

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
        // delete show from firebase
        deleteMarkedItemShow(id){
            // *iId (item id) is id of show from API and id is id of item in firebase
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
        
        // add or remove bookmark
        markingButtonShow(id, arr){
             // if user is login then:
            if(firebase.auth().currentUser){
                // if tv show is not marked then:
                if (this.isMarked(id, this.user.shows.mark)) {
                    // add tv show to marked
                    this.deleteMarkedItemShow(id)
               
                // if tv show is marked then:
                } else if (!this.isMarked(id, this.user.shows.mark)) {
                    // delete tv show from marked 
                    this.addMarkedItemShow(id, arr)
                }
            // if user is not login then:
            } else {
                // show alert 
                this.alert.type = "error"
                this.infoAlert("You must log in.")
            }
        },
        // stylize marking button depending on whether the show is mark
        styleMarkIconShow(id){
            // if user is login then:
            if(firebase.auth().currentUser){
                // if tv show is marked then: 
                if (this.isMarked(id, this.user.shows.mark)) {
                    // slyle icon
                    return "bookmark"
                } else if (!this.isMarked(id, this.user.shows.mark)) {
                    // slyle icon
                    return "bookmark_border"
                }
            // if user is not login style icon
            } else return "bookmark_border"
            
        },
        // API
        // get actor data from API
        getActorData() {
            this.loading = true
            this.actor.data = ""
            this.actor.movieKnown = ""
            axios.get(`${this.URL.database}person/${this.$route.params.id}${this.URL.apiKey}&append_to_response=movie_credits,tv_credits`)
            .then(res => {

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
                    // rate number formating to one decimal
                    this.actor.movieCredits.forEach((rate)=>{
                        // if (rate.vote_average < 10) {
                        //     rate.vote_average =  rate.vote_average.toFixed(1)
                        // }
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
                if (this.actor.showCredits.length > 0 && this.actor.showCredits.length > 0){
                    this.is.acting = true
                } else if (this.actor.showCredits.length <= 0 && this.actor.showCredits.length <= 0) {
                    this.is.acting = false
                }
                

                //** KNOWN FOR - MOVIES **//
                //*********************//
                const URL = "https://image.tmdb.org/t/p/w500"

                this.actor.movieKnown = res.data.movie_credits.cast
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
                // this.actor.movieKnown.sort(this.dynamicSort("-vote_average"))
                // render only 6 movies
                if (this.actor.movieKnown) {
                    this.actor.movieKnown = this.actor.movieKnown.slice(0,6)
                }
                // show recomend item if exist
                this.actor.movieKnown.length > 0 ? this.is.recomend = true : this.is.recomend = false  


                //** KNOWN FOR - TV SHOWS **//
                //*************************//

                this.actor.TVKnown = res.data.tv_credits.cast
                // if is no poster image replace with holder
                this.actor.TVKnown.forEach((poster)=>{
                    if (poster.poster_path) {
                        poster.poster_path = URL + poster.poster_path
                    } else if (poster.poster_path == null) {
                        poster.poster_path = this.holder.photo
                    }
                })
                // get just year from release date
                this.actor.TVKnown.forEach((year)=>{
                    if(year.first_air_date) {
                        year.first_air_date = year.first_air_date.slice(0,4)
                    } else {
                         year.first_air_date = "????"
                    }
                })
                // sort movie by rate
                // this.actor.TVKnown.sort(this.dynamicSort("-vote_average"))
                // render only 6 movies
                if (this.actor.TVKnown) {
                    this.actor.TVKnown = this.actor.TVKnown.slice(0,6)
                }
                // show recomend item if exist
                this.actor.TVKnown.length > 0 ? this.is.recomend = true : this.is.recomend = false

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
    
.item {
    width: 160px; //160
    &_wrapper {
        display: flex;
        padding: 25px 0 ;
        max-width: $width; 
        margin: 0 auto;
        flex-wrap: nowrap;
        overflow-x: auto;
        justify-content: flex-start;  
        text-align: left
    
    }
}

</style>
