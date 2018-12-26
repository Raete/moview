<template><div>
    <v-app>
        <div class="loading" v-if="loading">
            <img src="@/assets/img/svg/loader.svg" alt="loading..." >
        </div>
        <!-- opened rating slider-->
        <v-dialog v-model="box.rate" width="700">
            <v-card> 
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn icon flat @click.native="box.rate = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-actions>
                <v-card-text class="rating_wrapper">
                    <v-slider
                        v-model="rate"
                        :tick-labels="rating"
                        value="0"
                        max="10"
                        thumb-label
                        thumb-size="40"
                        ticks="always"
                    >
                        <template
                        slot="thumb-label"
                        slot-scope="props"
                        >
                            <span>
                                {{ rateLabel(props.value) }}
                            </span>
                        </template>
                    </v-slider>
                </v-card-text>
                <v-card-actions> 
                    <v-spacer></v-spacer>
                    <v-btn color="primary" round flat @click.native="ratingButton()">{{styleSaveRateBtn($route.params.id)}}</v-btn>
                    <v-btn v-if="isRated($route.params.id)" color="primary" round flat @click.native="deleteRateItem($route.params.id)">Delete rating</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- opened video trailer -->
        <v-dialog v-model="box.video" width="700" >
            <v-card class="dialog_video"> 
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn icon flat @click.native="box.video = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-actions>
                <v-card-text class="video_wrapper">
                    <iframe width="560" height="315" :src="trailer()" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- opened full overview -->
        <v-dialog v-model="box.overview" width="600px" >
            <v-card class="overview_more">
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn icon flat @click.native="box.overview = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-actions>
                <v-card-text >{{detail.data.overview}}</v-card-text>
            </v-card>
        </v-dialog>
        <!-- main container -->
        <main v-if="!loading" class="main animated" v-bind:style="{ 
            backgroundImage: 'url(' + detail.data.backdrop_path + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }">
            
            <img class="poster" :src="detail.data.poster_path" alt="">
            <!-- info section -->
            <section class="main_container" >
                
                <!-- header -->
                <header class="main_container_header">
                    <!-- back button -->
                    <v-btn class="btn_animated_left" flat round :to="{ name: 'movies' }" exact>
                        <v-icon color="primary"> keyboard_arrow_left </v-icon>
                        homepage
                    </v-btn>
                    
                    <!-- profile button -->
                    <v-btn v-if="user" class=" btn_animated_right font-weight-bold" color="primary" flat round  :to="{ name: 'profile' }" exact>
                        Profile
                        <v-icon color="primary"> keyboard_arrow_right </v-icon>
                    </v-btn>
                
                </header>
                <!-- bookmark button -->
                <v-btn class="btn_mark btn_animated_left" flat round @click="markingButtonDetail()" >
                    <v-icon size="25px" color="primary"> {{styleMarkIcon($route.params.id)}} </v-icon>
                    {{this.styleMarkText($route.params.id)}}
                </v-btn>

                <!-- movie detail info -->
                <section  class="info_wrapper">
                    <div class="info_rate_wrapper">
                        <p class="info_rate">  {{detail.data.vote_average}}%</p>
                        <!-- rate movie button -->
                        <v-btn outline round color="primary"  @click.stop="showRateOnTop()" >{{this.styleRateText($route.params.id)}}</v-btn>
                    </div>
                   
                    <!-- movie name -->
                    <div class="info_name">
                        <h1 class="info_title">{{detail.data.title}}
                            <span v-if="detail.data.release_date" class="info_year">
                                ({{detail.data.release_date}})
                            </span>   
                        </h1>
                    </div>
                    <!-- movie tags -->
                    <ul class="info_tags">
                        <li v-for="(tag, index) in detail.data.genres" :key="index" class="info_tag">{{tag.name}}</li>
                    </ul>
                    <!-- movie run time-->
                    <p v-if="detail.data.runtime" class="info_time">Run time:
                        <span> {{detail.data.runtime}}</span>
                    </p>
                    <!-- movie budget and revenuw -->
                    <p v-if="detail.data.budget" class="info_money">Budget:
                        <span> ${{formatNub(detail.data.budget)}} </span>
                    </p>
                    <p v-if="detail.data.revenue" class="info_money">Revenue:
                        <span> ${{formatNub(detail.data.revenue)}} </span>
                    </p>
                    <!-- movie overview -->
                    <div v-if="detail.data.overview" class="info_overview_wrapper">
                        <h1 class="info_overview_title">Overview</h1>
                        <p class="info_overview_text">{{detail.data.short}}</p>
                        <!-- more overview button - open dialog -->
                        <button v-if="is.long" @click.stop="showViewOnTop()" class="btn_overview" slot="activator" color="primary" dark>all overview</button>                     
                    </div>
                    <!-- movie trailer button - open video dialog -->
                    <button slot="activator" v-if="is.video" @click.stop="showVideoOnTop()" class="btn_video">view trailer</button>
                </section>
            </section>
        </main>
        <!-- cast and crew section -->
        <section v-if="is.credits" class="cast animated">
            <div class="cast_wrapper" v-if="!loading">
                <v-expansion-panel :value="panel">
                    <!-- cast panel -->
                    <v-expansion-panel-content  class="credits" v-if="is.cast">
                        <h1 slot="header" class="credits_title">Cast</h1>
                        <div class="cast_person_wrapper">
                            <div v-for="(actor, index) in detail.credits.cast" :key="index" class="cast_person">
                                <!-- picture -->
                                <router-link :to="{ name: 'singleActor', params: { id: actor.id } }"> 
                                    <figure class="cast_content">
                                        <img class="cast_person_img" v-bind:src="actor.profile_path" alt="">
                                        <figcaption class="cast_content_hover">
                                            <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                                        </figcaption>           
                                    </figure>
                                </router-link>
                                <!-- name-->
                                <h2 class="cast_person_name">{{ actor.name }}</h2>
                                <p class="cast_person_role">{{ actor.character}}</p>
                            </div>
                        </div>
                    </v-expansion-panel-content>
                    <!-- crew panel -->
                    <v-expansion-panel-content class="credits" v-if="is.crew">
                        <h1 slot="header" class="credits_title">Crew</h1>
                        <div class="cast_person_wrapper" >
                            <div v-for="(actor, index) in detail.credits.crew" :key="index" class="cast_person">
                                <!-- picture -->
                                <router-link :to="{ name: 'singleActor', params: { id: actor.id } }"> 
                                    <figure class="cast_content">
                                        <img class="cast_person_img" v-bind:src="actor.profile_path" alt="">
                                        <figcaption class="cast_content_hover">
                                            <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                                        </figcaption>           
                                    </figure>
                                </router-link>
                                <!-- name-->
                                <h2 class="cast_person_name">{{ actor.name }}</h2>
                                <p class="cast_person_role">{{ actor.job}}</p>
                            </div>                    
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </div> 
        </section>
        <!-- menu -->
        <v-toolbar flat v-if="is.similar || is.recommend">
            <v-spacer></v-spacer>
            <v-toolbar-items>

                <v-btn-toggle v-model="menuItem" mandatory>
                    <v-btn v-if="is.similar" flat @click="showSimilar">
                        Similar movies
                    </v-btn>
                    <v-btn v-if="is.recommend" flat @click="showRecommend">
                        Recommendations
                    </v-btn>
                </v-btn-toggle>

            </v-toolbar-items>
            <v-spacer></v-spacer>
        </v-toolbar>

        <!-- movies recommendations -->
        <section class="animated" v-if="is.recommend && show.recommend"> 
            <div class="item_container">
        
                <div class="item_wrapper">
                    <div class="item" v-for="(film, index) in detail.recommend" :key="index">
                        <!-- poster -->
                        <div class="poster_wrapper">
                            <router-link :to="{ name: 'singleMovie', params: { id: film.id } }"> 

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
                        <!-- title -->
                        <h1 class="item_name"> {{film.title}} </h1>
                        <span class="item_year">{{film.release_date}}</span>
                    
                    </div>
                </div>
            </div>
        </section>

        <!-- movies similar -->
        <section v-if="is.similar && show.similar"> 
            <div class="item_container">
            
                <div class="item_wrapper">
                    <div class="item" v-for="(film, index) in detail.similar" :key="index">
                        <!-- poster -->
                        <div class="poster_wrapper">
                            <router-link :to="{ name: 'singleMovie', params: { id: film.id } }"> 

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
                        <!-- title -->
                        <h1 class="item_name"> {{film.title}} </h1>
                        <span class="item_year">{{film.release_date}}</span>
                    
                    </div>
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
import footer from '@/components/parts/footer.vue';
// API database
import axios from 'axios';
// firebase
import db from '@/firebase/init'
import firebase from 'firebase/app'
// vuex -- store
import { mapState } from 'vuex';


export default {
    components: {
        'app-footer': footer,
    },

    data () {
        return {
            rate: "",
            loading: false,
            // cast and crew expansion panel
            panel: 0,   
            // bookmark movies in recommend
            mark: "",
            movieData: {},

            menuItem: 0

        }
    },

    created(){
        // for start
        this.init()
        // render movie data
        this.getItemData()
        // get data from firebase
        this.getFirebaseData()
    },

    watch: {
        rate(val) {
            this.user.movies.curRate = val * 10
        },
    },

    computed: {
        //get data from store
        ...mapState([
            'URL',
            'holder',
            'detail',
            'box',
            'is',
            'alert',
            'btn',
            'user',
            'rating',
            'show',
        ]),
    },

    methods: {

        //start setting - reset data
        init(){
            this.loading = true
            // movie details
            this.detail.data = ""
            this.detail.credits.cast = ""
            this.detail.recommend = ""
            this.detail.similar = ""
            this.detail.video = ""
            // dialog boxes
            this.box.video = false
            this.box.overview = false   
            // show section
            this.show.recommend = false
            this.show.similar = true

        },
        // format budget and revenue currancy 
        formatNub(num){ 
            num = Math.abs(num);
            num = num.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
            return num
        },
        // scroll to top
        scrollToTop(time) {
            this.$store.commit('scrollToTop', time)
        },
        // scroll up and show video
        showVideoOnTop(){
            this.scrollToTop(200)
            this.box.video = !this.box.video
        },
        // scroll up and show overview
        showViewOnTop(){
            this.scrollToTop(200)
            this.box.overview = !this.box.overview
        },
        showRateOnTop(){
            if(firebase.auth().currentUser){
                this.scrollToTop(200)
                this.box.rate = !this.box.rate
            } else {
                // show alert 
                this.alert.type = "error"
                this.infoAlert("You must log in.")
            }
        },
        // format run time
        timeConvert(data) {
            let minutes = data % 60
            let hours = (data - minutes) / 60
            return  `${hours}h ${minutes}m`
        },
        // show similar or recommend section
        showSimilar(){
            this.show.similar = true,
            this.show.recommend = false
        },
        showRecommend(){
            this.show.recommend = true,
            this.show.similar = false
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
                        // get user rate from database
                        db.collection('movies_rated').where('user', '==', this.user.id).where('iId', '==', this.$route.params.id).get()
                        .then(snapshot => {    
                             
                            if (snapshot.docs[0]) {
                                this.user.movies.curRate = snapshot.docs[0].data().user_rate
                            }   
                                
                        }) 

                        // read firebase database in real time
                        db.collection('movies_marked').where('user', '==', this.user.id)
                        .onSnapshot((snapshot) => {
                            snapshot.docChanges().forEach(change => {
                                // if marked movie is add to the database then:
                                if (change.type == 'added') {
                                    // read record and save to array
                                    let record = change.doc.data()
                                    record.id = change.doc.id
                                    this.user.movies.mark.push(record)
                                }
                                // if marked movie is remove to the database then:
                                if (change.type == 'removed') {
                                    // remove movie from array
                                    this.user.movies.mark = this.user.movies.mark.filter(item =>{
                                        return item.id != change.doc.id
                                    }) 
                                }    
                            })
                        })

                        // read firebase database in real time
                        db.collection('movies_rated').where('user', '==', this.user.id)
                        .where('iId', '==', this.$route.params.id)
                        .onSnapshot((snapshot) => {
                            snapshot.docChanges().forEach(change => {
                                let userRate
                                // if marked movie is add to the database then:
                                if (change.type == 'added') {
                                    userRate = snapshot.docs[0].data().user_rate
                                    this.user.movies.curRate = userRate
                                    // read record and save to array
                                    let record = change.doc.data()
                                    record.id = change.doc.id
                                    this.user.movies.rate.push(record)
                                }
                                // if marked movie is remove to the database then:
                                if (change.type == 'removed') {
                                    // remove movie from array
                                    this.user.movies.rate = this.user.movies.rate.filter(item =>{
                                        return item.id != change.doc.id
                                    }) 
                                } 
                            })  
                        })
                    })
                })
            }
        },
        // RATE BUTTON 
        // decide if movie is already rated
        isRated(id){
            return this.user.movies.rate.findIndex(el => el.iId == id) !== -1
        },

        rateLabel(val) {
            return this.rating[val]
        },
        // add movie to wishlist
        addRateItem(){
            // create new marked object with id, title and poster path... in firebase
            db.collection('movies_rated').add({
                id: "", // id in firebase - autogenerated by firebase
                iId: this.$route.params.id, // item id from API
                title: this.detail.data.title,
                poster: this.detail.data.poster_path,
                year: this.detail.data.release_date,
                rate: this.detail.data.vote_average,
                genres: this.detail.data.genres,
                user: this.user.id,
                user_rate: this.user.movies.curRate

            }).then(() => {
                // alert type and settings
                this.alert.type = "success"
                this.infoAlert("Successfully rated")

            }).catch(err => {
                console.log(err)
            })
        },
        // add movie to wishlist
        updateRateItem(id){
             // *iId (item id) is id of movie from API and id is id of item in firebase
            db.collection('movies_rated').where('user', '==', this.user.id).where('iId', '==', id).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    db.collection('movies_rated').doc(doc.id).update({
                        user_rate: this.user.movies.curRate

                    }).then(() => {
                        // alert type and settings
                        this.alert.type = "success"
                        this.infoAlert("Successfully update")

                    }).catch(err => {
                        console.log(err)
                    })
                })
            })
        },
        // delete movie from 
        deleteRateItem(id){
            // *iId (item id) is id of movie from API and id is id of item in firebase
            db.collection('movies_rated').where('user', '==', this.user.id).where('iId', '==', id).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    db.collection('movies_rated').doc(doc.id).delete().then(()=> {
                        this.user.movies.rate = this.user.movies.rate.filter(item =>{
                            return item.id != doc.id
                        })
                    })  
                })
            })
            // alert type and settings
            this.alert.type = "success"
            this.infoAlert("Successfully removed rate.")     
            this.box.rate = false
        },

        // add or remove button
        ratingButton(){
            // if user is login then:
            if(firebase.auth().currentUser){
                // if movie is not marked then:
                if (this.isRated(this.$route.params.id)) {
                    // add movie to marked
                    this.updateRateItem(this.$route.params.id)
                   // this.deleteRateItem(this.$route.params.id)

                // if movie is marked then:
                } else if (!this.isRated(this.$route.params.id)) {
                    // delete movie from marked 
                    this.addRateItem()
                }
            // if user is not login then:
            } else {
                // show alert 
                this.alert.type = "error"
                this.infoAlert("You must log in.")
            }
            this.box.rate = false
        },

        // stylize rating button depending on whether the movie is rated
        // text button
        styleRateText(id){
            // if user is login then:
            if(firebase.auth().currentUser){

                if (this.isRated(id)) {
                    return `Your rate is: ${this.user.movies.curRate}%`
                } else if (!this.isRated(id)) {
                    return "Rate movie"
                }
            } else return "Rate movie"
        },
        // text button
        styleSaveRateBtn(id){
         
            if (this.isRated(id)) {
                return "Update rating"
            } else if (!this.isRated(id)) {
                return "Save rating"
            }
         
        },

        // BOOKMARK BUTTON in movie detail
        // decide if movie is already marked
        isMarked(id){
            return this.user.movies.mark.findIndex(el => el.iId == id) !== -1
        },
        // add movie to wishlist
        addMarkedItemDetail(){
            // create new marked object with id, title and poster path... in firebase
            db.collection('movies_marked').add({
                id: "", // id in firebase - autogenerated by firebase
                iId: this.$route.params.id, // item id from API
                title: this.detail.data.title,
                poster: this.detail.data.poster_path,
                year: this.detail.data.release_date,
                rate: this.detail.data.vote_average,
                genres: this.detail.data.genres,
                user: this.user.id,
                user_rate: this.user.movies.curRate

            }).then(() => {
                // alert type and settings
                this.alert.type = "success"
                this.infoAlert("Successfully added to watchlist")

            }).catch(err => {
                console.log(err)
            })
        },
        // delete movie from wishlist
        deleteMarkedItem(id){
            // *iId (item id) is id of movie from API and id is id of item in firebase
            db.collection('movies_marked').where('user', '==', this.user.id).where('iId', '==', id).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    db.collection('movies_marked').doc(doc.id).delete().then(()=> {
                        this.user.movies.mark = this.user.movies.mark.filter(item =>{
                            return item.id != doc.id
                        })
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
        
        // add or remove button
        markingButtonDetail(){
            // if user is login then:
            if(firebase.auth().currentUser){
                // if movie is not marked then:
                if (this.isMarked(this.$route.params.id)) {
                    // add movie to marked
                    this.deleteMarkedItem(this.$route.params.id)
                // if movie is marked then:
                } else if (!this.isMarked(this.$route.params.id)) {
                    // delete movie from marked 
                    this.addMarkedItemDetail()
                }
            // if user is not login then:
            } else {
                // show alert 
                this.alert.type = "error"
                this.infoAlert("You must log in.")
            }
        },
       
        // BOOKMARK BUTTON in recommend movies
        // add movie to watchlist and send to firebase*
        addMarkedItem(id, arr){

            this.movieData = arr
            db.collection('movies_marked').add({
                id: "",
                iId: this.movieData.id,
                title: this.movieData.title,
                genres: this.movieData.genre_ids,
                poster: this.movieData.poster_path,
                rate: this.movieData.vote_average,
                year: this.movieData.release_date,
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
        // add or remove bookmark
        markingButton(id, arr){
            // if user is login then:
            if(firebase.auth().currentUser){
                // if movie is not marked then:
                if (this.isMarked(id)) {
                    // add movie to wishlist
                    this.deleteMarkedItem(id)
               
                // if movie is marked then:
                } else if (!this.isMarked(id)) {
                    // delete movie from wishlist 
                    this.addMarkedItem(id, arr)
                }
            // if user is not login then:
            } else {
                // show alert 
                this.alert.type = "error"
                this.infoAlert("You must log in.")
            }
        },

        // stylize marking button depending on whether the movie is mark
        // icon button
        styleMarkIcon(id){
            // if user is login then:
            if(firebase.auth().currentUser){
       
                if (this.isMarked(id)) {
                    return "bookmark"
                } else if (!this.isMarked(id)) {
                    return "bookmark_border"
                }
            } else return "bookmark_border"
            
        },
        // text button
        styleMarkText(id){
            // if user is login then:
            if(firebase.auth().currentUser){

                if (this.isMarked(id)) {
                    return "Remove from watchlist"
                } else if (!this.isMarked(id)) {
                    return "Add to watchlist"
                }
            } else return "Add to watchlist"
        },

        // API DATABASE
        // get movie data from API database
        getItemData() {
            //start setting - reset data
            this.init()
            // API database
            axios.get(`${this.URL.database}movie/${this.$route.params.id}${this.URL.apiKey}&append_to_response=videos,credits,recommendations,similar`)
            .then(res => {
           
             
                //** MOVIE DETAIL **//
                //*****************//
                const URLposter = "https://image.tmdb.org/t/p/original"
                this.detail.data = res.data

                // if is no poster image replace with holder
                if (this.detail.data.poster_path) {
                    this.detail.data.poster_path = URLposter + this.detail.data.poster_path
                } else if (this.detail.data.poster_path == null) {
                    this.detail.data.poster_path = this.holder.detail
                }

                // slice overview -- show all overview button
                if (this.detail.data.overview.length > 350) {
                    this.is.long = true
                    this.detail.data.short = this.detail.data.overview.slice(0,300) + "..."
                } else { 
                    this.detail.data.short = this.detail.data.overview
                    this.is.long = false
                }
                // set backdrop url
                this.detail.data.backdrop_path = URLposter + this.detail.data.backdrop_path
                // get just year from release date
                if(this.detail.data.release_date ) {
                   this.detail.data.release_date = this.detail.data.release_date.slice(0,4)
                }
                // format run time 
                if (this.detail.data.runtime) {
                    this.detail.data.runtime = this.timeConvert(this.detail.data.runtime)
                } 
                // rate number formating to one decimal
                if (this.detail.data.vote_average < 10) {
                    this.detail.data.vote_average = this.detail.data.vote_average.toFixed(1)
                } 

                if (this.detail.data.vote_average) {
                    this.detail.data.vote_average = this.detail.data.vote_average * 10
                } 
           
                //** CREDITS **//
                //************//
                const URLface = "https://image.tmdb.org/t/p/w235_and_h235_face"
                this.detail.credits.crew = res.data.credits.crew
                this.detail.credits.cast = res.data.credits.cast

                let crew = this.detail.credits.crew
                let cast = this.detail.credits.cast

                // if is no profile image in cast replace with holder
                cast.forEach((profile)=> {
                    if (profile.profile_path) {
                        profile.profile_path = URLface + profile.profile_path
                    } else if (profile.profile_path == null) {
                        profile.profile_path = this.holder.person
                    }
                })
                // if is no profile image in crew replace with holder
                crew.forEach((profile)=> {
                    if (profile.profile_path) {
                        profile.profile_path = URLface + profile.profile_path
                    } else if (profile.profile_path == null) {
                        profile.profile_path = this.holder.person
                    }
                })
                // show crew section only if crew exist
                !crew.length ? (this.is.crew = false) : this.is.crew = true
                // show cast section only if cast exist if not crew panel is expand
                if (!cast.length) {
                    this.is.cast = false
                } else {
                    this.is.cast = true
                }

                // if crew and cast don't exist hide all credits
                if ( !this.is.crew && !this.is.cast ) {
                    this.is.credits = false
                }

                //** RECOMMENDATIONS **//
                //********************//
                const URLrecom = "https://image.tmdb.org/t/p/w500"
                this.detail.recommend = res.data.recommendations.results
                // if is no poster image replace with holder
                this.detail.recommend.forEach((poster)=>{
                    if (poster.poster_path) {
                        poster.poster_path = URLrecom + poster.poster_path
                    } else if (poster.poster_path == null) {
                        poster.poster_path = this.holder.photo
                    }
                })
                // get just year from release date
                this.detail.recommend.forEach((year)=>{
                    if(year.release_date) {
                        year.release_date = year.release_date.slice(0,4)
                    } else {
                         year.release_date = "????"
                    }
                })

                // rate number formating to one decimal
                this.detail.recommend.forEach((rate)=>{
                    if (rate.vote_average < 10) {
                        rate.vote_average =  rate.vote_average.toFixed(1)
                    }

                    if (rate.vote_average) {
                        rate.vote_average =  rate.vote_average * 10
                    }
                })


                // show recomend item if exist
                this.detail.recommend.length > 0 ? this.is.recommend = true : this.is.recommend = false  

                //** SIMILAR **//
                //************//
                this.detail.similar = res.data.similar.results
                // if is no poster image replace with holder
                this.detail.similar.forEach((poster)=>{
                    if (poster.poster_path) {
                        poster.poster_path = URLrecom + poster.poster_path
                    } else if (poster.poster_path == null) {
                        poster.poster_path = this.holder.photo
                    }
                })
                // get just year from release date
                this.detail.similar.forEach((year)=>{
                    if(year.release_date) {
                        year.release_date = year.release_date.slice(0,4)
                    } else {
                         year.release_date = "????"
                    }
                })

                // rate number formating to one decimal
                this.detail.similar.forEach((rate)=>{
                    if (rate.vote_average < 10) {
                        rate.vote_average =  rate.vote_average.toFixed(1)
                    }

                    if (rate.vote_average) {
                        rate.vote_average =  rate.vote_average * 10
                    }
                })

                // show similar item if exist
                this.detail.similar.length > 0 ? this.is.similar = true : this.is.similar = false

                // show recommend movies or similar 
                if (this.is.similar && !this.is.recommend) {
                    this.show.recommend = false
                    this.show.similar = true
        
                }
                if (this.is.recommend && !this.is.similar) {
                    this.show.recommend = true
                    this.show.similar = false
                } 

                //** TRAILER **//
                //************//
                const URLvideo = "https://www.youtube.com/embed/"
                this.detail.video = res.data.videos.results   

                // set video url
                this.detail.video.forEach((video)=>{   
                    if (video.key) {
                        video.key = URLvideo + video.key + "?rel=0&amp;autoplay=1"
                    } 
                    this.detail.video = video.key 
                })
                //show trailer button if video exist
                !this.detail.video.length ? this.is.video = false : this.is.video = true 

            }).then(()=> {
                this.loading = false
            }) 
        },

        // video trailer - active only when dialog si active
        trailer(){        
            if (this.box.video) {
                return this.detail.video
            } else if (!this.box.video) {
                return ' '   
            }
        },
    },
}
</script>


<style lang='scss' scoped>
    @import '../../assets/scss/_variables';
    @import '../../assets/scss/parts/_general';
    @import '../../assets/scss/singlePage/_movies';
    @import '../../assets/scss/parts/_cast';
    @import '../../assets/scss/parts/_itemList';

    .rating_wrapper {
        padding: 30px
    }


    

</style>
