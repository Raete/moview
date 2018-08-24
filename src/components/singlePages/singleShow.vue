<template><div>
    <v-app class="index">
        <div class="loading" v-if="loading">
            <img src="@/assets/img/svg/loader.svg" alt="loading..." >
        </div>
        <!-- opened video trailer -->
        <v-dialog v-model="box.video" width="700">
            <v-card>
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
            <section class="main_container">
                <!-- header -->
                <header class="main_container_header">
                    <!-- back button -->
                    <v-btn flat round :to="{ name: 'shows' }" >
                        <v-icon color="primary"> keyboard_backspace </v-icon>
                        homepage
                    </v-btn>
                    <!-- bookmark button -->
                    <div>
                        <v-btn flat round @click="markingButtonDetail()" >
                            <v-icon color="primary"> {{styleMarkIcon($route.params.id)}} </v-icon>
                            {{this.styleMarkText($route.params.id)}}
                        </v-btn>
                    </div>
                </header>
                <!-- show detail info -->
                <section  class="info_wrapper">
                    <div class="info_rate_wrapper">
                        <p class="info_rate">  {{detail.data.vote_average}}%</p>
                        <v-btn outline round color="primary">rate movie</v-btn>
                    </div>
                    <!-- show name -->
                    <div class="info_name">
                        <h1 class="info_title">{{detail.data.name}}
                            <span v-if="detail.data.first_air_date" class="info_year">
                                ({{detail.data.first_air_date}})
                            </span>   
                        </h1>
                    </div>
                    <!-- show tags -->
                    <ul class="info_tags">
                        <li v-for="tag in detail.data.genres" :key="tag.id" class="info_tag">{{tag.name}}</li>
                    </ul>
                    <!-- show episode time-->
                    <p class="info_time" v-if="is.episode">Average episode time:
                        <span> {{detail.data.episode_run_time_average}}min</span>           
                    </p>
                    <!-- number of seasons and episodes -->
                    <p v-if="detail.data.number_of_seasons" class="info_money">                  
                        <span> {{detail.data.number_of_seasons}} </span>{{season}}
                    </p>
                    <p v-if="detail.data.number_of_episodes" class="info_money">
                        <span> {{detail.data.number_of_episodes}} </span>{{episode}}
                    </p>
                    <!-- show overview -->
                    <div v-if="detail.data.overview" class="info_overview_wrapper">
                        <h1 class="info_overview_title">Overview</h1>
                        <p class="info_overview_text">{{detail.data.short}}</p>
                        <!-- more overview button - open dialog -->
                        <button v-if="is.long" @click.stop="showViewOnTop()" class="btn_overview" slot="activator" color="primary" dark>all overview</button>                            
                    </div>
                    <!-- movie trailer button - open video dialog -->
                    <button v-if="is.video" @click.stop="showVideoOnTop()" class="btn_video">view trailer
                    </button>                 
                </section>
            </section>
        </main>
        <!-- cast and crew section -->
        <section v-if="is.credits" class="cast animated">
            <div class="cast_wrapper" v-if="!loading">
                <v-expansion-panel >
                    <!-- cast panel -->
                    <v-expansion-panel-content v-model="panel" class="credits" v-if="is.cast">
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
                                <!-- name -->
                                <h2 class="cast_person_name">{{ actor.name }}</h2>
                                <p class="cast_person_role">{{ actor.character}}</p>
                            </div>
                        </div>
                    </v-expansion-panel-content>
                    <!-- crew panel -->
                    <v-expansion-panel-content  class="credits" v-if="is.crew">
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
                                <!-- name -->
                                <h2 class="cast_person_name">{{ actor.name }}</h2>
                                <p class="cast_person_role">{{ actor.job}}</p>
                            </div>                    
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel> 
            </div> 
        </section>
        <!-- shows recommendations -->
        <section class="animated" v-if="is.recomend">
            <div class="item_container">
                <h1 class="recommend">Recommendations</h1> 
                <div class="item_wrapper">
                    <div class="item" v-for="(film, index) in detail.recommend" :key="index">
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
                            <v-btn v-model="mark" small fab depressed icon @click="markingButton(film.id, film)">
                                <v-icon size="25px">{{styleMarkIcon(film.id)}}</v-icon>
                            </v-btn>  
                            <!-- rate -->
                            <div class="item_rate"> {{film.vote_average}}% </div>
                        </div>
                        <!-- title -->
                        <h1 class="item_name"> {{film.original_name}} </h1>
                        <span class="item_year">{{film.first_air_date}}</span>
                    </div>
                </div>
            </div>
        </section>
        <!-- episode list -->
        <section id="allSeasons" v-if="!loading" class="animated">
            <div class="episode_wrapper">
                <h1 class="recommend">Seasons</h1> 
                <!-- episode list -->
                <v-tabs v-model="currentTab" centered color="transparent" >
                    <v-tabs-slider color="black" ></v-tabs-slider>
                    <!-- list of seasons (tabs) -->
                    <v-tab  
                    v-for="(season, i) in detail.data.seasons" 
                    :key="i" 
                    class="tab_menu_item"  
                    :href="`#season_${season.season_number}`">
                        {{season.name}}
                    </v-tab>
        
                    <!-- list of episodes  -->
                    <v-tab-item 
                    v-for="(season, i) in detail.data.seasons" 
                    :key="i"  
                    class="tab_item" 
                    :id="`season_${season.season_number}`">
                        <div class="episode" v-for="(episode, i) in detail.episodes"  :key="i" >
                            <img class="episode_img" :src="episode.still_path" alt="episode img">
                            <div>
                                <h1 class="episode_name"> {{episode.episode_number}}. {{episode.name}} </h1>
                                <p class="episode_date">{{episode.air_date}}</p>
                                <p class="episode_content"><pre class="pre_text">{{episode.overview}}</pre></p>
                            </div>
                        </div>
                        <div class="episode_feedback" v-if="!detail.episodes.length">
                            There are no episodes added to this season.
                        </div>
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
    <button @click="scrollToTop(300)" class="up" :class="{ up_active: show }"> go to top </button>
   
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
            // cast and crew expansion panel
            panel: true,
            currentTab: "season_1",
            // singular/plural of season and episode
            season: "season",
            episode: "episode",
            // back to top button
            show: true,
            // bookmark shows in recommend
            mark: "",
            showData: {},
        }
    },

    created(){
        // for start
        this.init()
        // render movie data
        this.getMovieData()
        // render episodes
        this.getEpisode(1)
        // get data from firebase
        this.getFirebaseData()
        // back to seasons button
        window.addEventListener("scroll", this.scrollButton)

        
    },

    watch: {
        currentTab(){
            // set number of season in episode list
            this.getEpisode(this.currentTab.split("_").pop())
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
        ]),
    },

    methods: {
        //start setting - reset data
        init(){
            this.loading = true
            this.detail.data = ""
            this.detail.credits.cast = ""
            this.detail.recommend = ""  
            this.detail.video = ""

            this.box.video = false
            this.box.overview = false
        },
        // scroll to anchor element (seasons)
        // scrollTo(name) {
        //     this.smoothScrollTo(document.getElementById(name));
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

        // back to top button is appear
        scrollButton() {
            if (window.scrollY >= 800) {
                this.show = false
            } else {
                this.show = true
            }
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
        // scroll to top
        scrollToTop(time) {
            this.$store.commit('scrollToTop', time)
        },
        // average item in array
        average(array){
            let total =  0;
            for (let i = 0; i < array.length; ++i)
                {
                    if ( isNaN(array[i]) ){
                        continue;
                    }
                    total += +(array[i]);
                }
            return Math.round(total/array.length);
        },
        // plural season and epsisode when is more then one
        plural(){
            if (this.detail.data.number_of_seasons > 1) {
                this.season = "seasons"
            }
            if (this.detail.data.number_of_episodes > 1) {
                this.episode = "episodes"
            }  
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

                        // watch changes in firebase 
                        db.collection('shows_marked').where('user', '==', this.user.id)
                        .onSnapshot((snapshot) => {
                            snapshot.docChanges().forEach(change => {
                                // if favorite movie is add to the database then:
                                if (change.type == 'added') {
                                    // read record and save to array
                                    let record = change.doc.data()
                                    record.id = change.doc.id
                                    this.user.shows.mark.push(record)
                                }
                                // if favorite movie is remove to the database then:
                                if (change.type == 'removed') {
                                    // remove movie from array
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
        // BOOKMARK BUTTON in show detail
        // decide if show is already marked
        isMarked(id){
            return this.user.shows.mark.findIndex(el => el.iId == id) !== -1
        },
        // add show to watchlist and send to firebase (from detail show)
        addMarkedItemDetail(){
            // create new favorite object with id, title and poster path... in firebase
            db.collection('shows_marked').add({
                id: "", // id in firebase - autogenerated by firebase
                iId: this.$route.params.id, // item id from API
                title: this.detail.data.name,
                poster: this.detail.data.poster_path,
                year: this.detail.data.first_air_date,
                rate: this.detail.data.vote_average,
                genres: this.detail.data.genres,
                user: this.user.id

            }).then(() => {
                // alert type and settings
                this.alert.type = "success"
                this.infoAlert("Successfully added to watchlist")

            }).catch(err => {
                console.log(err)
            })
        },
        // delete show from firebase
        deleteMarkedItem(id){
            // *iId (item id) is id of movie from API and id is id of item in firebase
            db.collection('shows_marked').where('user', '==', this.user.id).where('iId', '==', id).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    db.collection('shows_marked').doc(doc.id).delete().then(()=> {
                        this.user.shows.mark = this.user.shows.mark.filter(item =>{
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
        
        // add or remove bookmark
        markingButtonDetail(){
            // if user is login then:
            if(firebase.auth().currentUser){
                // if movie is not marked then:
                if (this.isMarked(this.$route.params.id)) {
                    // add movie to wishlist
                    this.deleteMarkedItem(this.$route.params.id)
                // if movie is marked then:
                } else if (!this.isMarked(this.$route.params.id)) {
                    // delete movie from wishlist
                    this.addMarkedItemDetail()
                }
            // if user is not login then:
            } else {

                // show alert 
                this.alert.type = "error"
                this.infoAlert("You must log in.")
            }
        },

        // BOOKMARK BUTTON in recommend shows
        // add show to watchlist and send to firebase
        addMarkedItem(id, arr){

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

        // add or remove bookmark
        markingButton(id, arr){
            // if user is login then:
            if(firebase.auth().currentUser){
                // if movie is not marked then:
                if (this.isMarked(id)) {
                    // add movie to watchlist
                    this.deleteMarkedItem(id)
                // if movie is marked then:
                }  else if (!this.isMarked(id)) {
                    // delete movie from watchlist 
                     this.addMarkedItem(id, arr)
                }
            // if user is not login then:
            } else {
                // show alert 
                this.alert.type = "error"
                this.infoAlert("You must log in.")
            }
        },

        // stylize marking button depending on whether the movie is mark*
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
        // get show data from database
        getMovieData() {
            this.init()
            axios.get(`${this.URL.database}tv/${this.$route.params.id}${this.URL.apiKey}&append_to_response=videos,credits,recommendations`)
            .then(res => {
               
                //** MOVIE DETAIL **//
                //*****************//
                const URL = "https://image.tmdb.org/t/p/original"
                this.detail.data = res.data
                // if is no poster image replace with holder
                if (this.detail.data.poster_path) {
                    this.detail.data.poster_path = URL + this.detail.data.poster_path
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
                // episode average run time
                this.detail.data.episode_run_time_average = this.average(this.detail.data.episode_run_time)
                
                // set backdrop url
                this.detail.data.backdrop_path = URL + this.detail.data.backdrop_path
                // get just year from first air date
                if (this.detail.data.first_air_date) {
                    this.detail.data.first_air_date = this.detail.data.first_air_date.slice(0,4)
                }
                // show episode run time if exist
                this.detail.data.episode_run_time.length > 0 ? this.is.episode = true : this.is.episode = false  
                // plural season and epsisode when is more then one
                this.plural()
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
                // only 3 crew person in overview
                // if (this.detail.credits.crew) {
                //    this.detail.credits.crew = this.detail.credits.crew.slice(0,3)
                // }
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
                    this.panel = true
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
                    if (year.first_air_date) {
                        year.first_air_date = year.first_air_date.slice(0,4)
                    } else {
                         year.first_air_date = "????"
                    }
                })
                // sort movie by rate
                // this.detail.recommend.sort(this.dynamicSort("-vote_average"))
                // render only 6 movies
                // if (this.detail.recommend) {
                //     this.detail.recommend = this.detail.recommend.slice(0,6)
                // }

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
                this.detail.recommend.length > 0 ? this.is.recomend = true : this.is.recomend = false   

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
        
        // get episode from database
        getEpisode(val) {
         
            axios.get(`${this.URL.database}tv/${this.$route.params.id}/season/${val}${this.URL.apiKey}`)
            .then(res => {
        
                const URL = "https://image.tmdb.org/t/p/w500"
                let ep = res.data.episodes
                // if is no screen image replace with holder
                ep.forEach((screen)=>{
                    if (screen.still_path) {
                        screen.still_path = URL + screen.still_path
                    } else if (screen.still_path == null) {
                        // replace poster with poster holder if is no poster
                        screen.still_path = this.holder.episode
                    }
                })
                // format episode date
                ep.forEach((date)=>{
                    if(date.air_date) {
                        date.air_date = date.air_date.split("-").reverse().join(".")
                    }
                })
               this.detail.episodes = ep
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
    @import '../../assets/scss/parts/_seasons';

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
