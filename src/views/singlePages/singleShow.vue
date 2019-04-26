<template><div>
    <v-app class="index">
        <div class="loading" v-if="loading">
            <img src="@/assets/img/svg/loader.svg" alt="loading..." >
        </div>
        <!-- opened RATING SLIDER -->
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
                    <!-- save rating -->
                    <v-btn color="primary" round flat 
                        @click.native="ratingButton(
                            user.shows.curRate, 
                            user.shows.rate,
                            'tv',
                            'singleShow'
                        )"
                    >
                        {{styleText(
                            $route.params.id, 
                            user.shows.rate, 
                            'Save rating', 
                            'Update rating')
                        }}
                  
                    </v-btn>
                     <!-- delete rating -->
                    <v-btn 
                        v-if="isItem($route.params.id, user.shows.rate)" 
                        color="primary" 
                        round 
                        flat 
                        @click.native="deleteItemFromDB($route.params.id, user.shows.rate, 'rating')"
                    >
                        Delete rating
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- opened VIDEO TRAILER -->
        <v-dialog v-model="box.video" width="700">
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

        <!-- opened FULL OVERVIEW -->
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

        <!-- main container  POSTER AND TV SHOW INFO -->
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
                    <v-btn class="btn_animated_left" color="primary" flat round :to="{ name: 'shows' }" exact>
                        <v-icon color="primary"> keyboard_arrow_left </v-icon>
                        homepage
                    </v-btn>
                    
                    <!-- profile button -->
                    <v-btn v-if="user" class=" btn_animated_right font-weight-bold" color="primary" flat round  :to="{ name: 'profile' }" exact>
                        Profile
                        <v-icon color="primary"> keyboard_arrow_right </v-icon>
                    </v-btn>
                
                </header>
                <div class="info_rate_wrapper">
                    <!-- bookmark button -->
                    <v-btn class="btn_mark btn_animated_left" color="primary" flat round 
                        @click="toggleItemInDB(
                            $route.params.id, 
                            user.shows.mark, 
                            'watchlist',
                            'tv',
                            'singleShow'
                        )" 
                    >
                        <!-- button icon -->
                        <v-icon size="25px" color="primary"> 
                            {{styleIcon(
                                $route.params.id, 
                                user.shows.mark, 
                                'bookmark_border', 
                                'bookmark')
                            }} 
                        </v-icon>

                        <!-- button text -->
                        {{styleText(
                            $route.params.id, 
                            user.shows.mark, 
                            'Add to watchlist', 
                            'Remove from watchlist')
                        }}
                    </v-btn>

                    <!-- seen button -->
                    <v-btn class="btn_mark btn_animated_right" color="primary" flat round 
                        @click="toggleItemInDB(
                            $route.params.id, 
                            user.shows.seen, 
                            'seen',
                            'tv',
                            'singleShow'
                        )">

                        <!-- button icon -->
                        <v-icon size="25px" color="primary"> 
                            {{styleIcon(
                                $route.params.id, 
                                user.shows.seen, 
                                'visibility', 
                                'visibility_off')
                            }} 
                        </v-icon>

                        <!-- button text -->
                        {{styleText(
                            $route.params.id, 
                            user.shows.seen, 
                            'Add to seen', 
                            'Remove from seen')
                        }}
                    </v-btn>
                </div>

                <!-- show detail info -->
                <section  class="info_wrapper">
                    <div class="info_rate_wrapper">
                        <p class="info_rate"> {{detail.data.vote_average}}% </p>

                        <!-- rate tv button -->
                        <v-btn 
                            outline 
                            round 
                            color="primary"  
                            @click.stop="showRateOnTop()" 
                        > 
                            {{this.styleRateText(user.shows.rate, user.shows.curRate)}}
                        </v-btn>
                    </div>

                    <!-- show name -->
                    <div class="info_name">
                        <h1 class="info_title">{{detail.data.name}}
                            <span v-if="detail.data.release_date" class="info_year">
                                ({{detail.data.release_date}})
                            </span>   
                        </h1>
                    </div>

                    <!-- show tags -->
                    <ul class="info_tags">
                        <li v-for="(tag, index) in detail.data.genres" :key="index" class="info_tag">{{tag.name}}</li>
                    </ul>

                    <!-- show episode time-->
                    <p class="info_time" v-if="is.episode">Average episode time:
                        <span> {{detail.data.episode_run_time_average}}min</span>           
                    </p>

                    <p v-if="directors.length" class="info_time">Director:
                        <span class="btn_director"  v-for="(director, index) in directors" :key="index">
                            
                            <router-link :to="{ name: 'singleActor', params: { id: director.id } }">
                                {{director.name}}
                            </router-link> 

                        </span>
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
                        <button 
                            v-if="is.long" 
                            @click.stop="showViewOnTop()" 
                            class="btn_overview" 
                            slot="activator" 
                            color="primary" 
                            dark
                        >all overview</button>                            
                    </div>

                    <!-- movie trailer button - open video dialog -->
                    <button 
                        v-if="is.video" 
                        @click.stop="showVideoOnTop()" 
                        class="btn_video"
                    >view trailer</button>                 
                </section><!-- END info wrapper -->
            </section><!-- END main container -->
        </main>

        <!-- CAST AND CREW section -->
        <section v-if="is.credits" class="cast animated">
            <div class="cast_wrapper" v-if="!loading">
                <v-expansion-panel :value="panel">
                    <!-- cast panel -->
                    <v-expansion-panel-content class="credits" v-if="is.cast">
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

        <!-- menu recommend, similar movies and seasons -->
         <v-toolbar flat >
            <v-spacer></v-spacer>
                <v-btn-toggle v-model="menuItem" mandatory>
                    <v-btn flat class="menu_item mr-2" @click="showSeasons">
                        Seasons
                    </v-btn>
                    <v-btn v-if="is.similar" class="menu_item mr-2" flat @click="showSimilar">
                        Similar TV Shows
                    </v-btn>
                    <v-btn v-if="is.recommend" class="menu_item" flat @click="showRecommend">
                        Recommendations
                    </v-btn>
                </v-btn-toggle>
            <v-spacer></v-spacer>
        </v-toolbar>

        <!-- shows recommendations -->
        <section class="animated" v-if="is.recommend && show.recommend ">
            <div class="item_container">
                <div class="item_wrapper">
                    <div class="item" v-for="(film, index) in detail.recommend" :key="index">
                        <!-- poster -->
                        <div class="poster_wrapper">
                            <router-link :to="{ name: 'singleShow', params: { id: film.id } }"> 

                                <figure class="item_content animated" >
                                    <!-- seen button -->
                                    <v-tooltip class="eye" v-if="isItem(film.id, user.shows.seen)" left color="primary">
                                        <v-icon slot="activator" size="25px" color="secondary">
                                            visibility
                                        </v-icon>
                                        <span>You've already seen this show</span>
                                    </v-tooltip>

                                    <img class="item_img" v-bind:src="film.poster_path" alt="">
                                    <figcaption class="item_hover">
                                        <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                                    </figcaption>           
                                </figure>

                            </router-link> 
                            <!-- shadow-->
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
                            <v-tooltip class="item_delete" left color="primary">
                                <v-btn v-model="mark" slot="activator" small fab depressed icon 
                                    @click="toggleBookmark(
                                        film.id, 
                                        film, 
                                        user.shows.mark, 
                                        'tv', 
                                        'singleShow'
                                    )"
                                > 
                                    <v-icon size="25px">
                                        {{styleIcon(
                                            film.id, 
                                            user.shows.mark, 
                                            'bookmark_border', 
                                            'bookmark')
                                        }}</v-icon>
                                </v-btn> 
                                <span>Bookmark</span>
                            </v-tooltip>                            
                        
                            <!-- title -->
                            <router-link class="item_title_box" :to="{ name: 'singleShow', params: { id: film.id } }">
                                <h1 class="item_name"> {{film.original_name}} </h1>
                                <span class="item_year">{{film.release_date}}</span>
                            </router-link> 
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- shows similar -->
        <section class="" v-if="is.similar && show.similar">
            <div class="item_container">
                <div class="item_wrapper">
                    <div class="item" v-for="(film, index) in detail.similar" :key="index">
                        <!-- poster -->
                        <div class="poster_wrapper">
                            <router-link :to="{ name: 'singleShow', params: { id: film.id } }"> 

                                <figure class="item_content animated" >
                                    <!-- seen button -->
                                    <v-tooltip class="eye" v-if="isItem(film.id, user.shows.seen)" left color="primary">
                                        <v-icon slot="activator" size="25px" color="secondary">
                                            visibility
                                        </v-icon>
                                        <span>You've already seen this show</span>
                                    </v-tooltip>

                                    <img class="item_img" v-bind:src="film.poster_path" alt="">
                                    <figcaption class="item_hover">
                                        <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                                    </figcaption>           
                                </figure>

                            </router-link> 
                            <!-- shadow -->
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
                            <v-tooltip class="item_delete" left color="primary">
                                <v-btn v-model="mark" slot="activator" small fab depressed icon 
                                    @click="toggleBookmark(
                                        film.id, 
                                        film, 
                                        user.shows.mark, 
                                        'tv', 
                                        'singleShow'
                                    )"
                                > 
                                    <v-icon size="25px">
                                        {{styleIcon(
                                            film.id, 
                                            user.shows.mark, 
                                            'bookmark_border', 
                                            'bookmark')
                                        }}</v-icon>
                                </v-btn> 
                                <span>Bookmark</span>
                            </v-tooltip>                            
                        
                            <!-- title -->
                            <router-link class="item_title_box" :to="{ name: 'singleShow', params: { id: film.id } }">
                                <h1 class="item_name"> {{film.original_name}} </h1>
                                <span class="item_year">{{film.release_date}}</span>
                            </router-link> 
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- EPISODE LIST -->
        <section id="allSeasons" v-if="!loading && show.seasons" class="animated">
            <div class="episode_wrapper">
                <!-- episode list -->
                <v-tabs v-model="currentTab" centered color="transparent" >
                    <v-tabs-slider color="black" ></v-tabs-slider>
                    <!-- list of seasons (tabs) -->
                    <v-tab  
                        v-for="(season, i) in detail.data.seasons" 
                        :key="i" 
                        class="tab_menu_item"  
                        :href="`#season_${season.season_number}`"
                    >
                            {{season.name}}
                    </v-tab>
        
                    <!-- list of episodes  -->
                    <v-tab-item 
                        v-for="(season, i) in detail.data.seasons" 
                        :key="i"  
                        class="tab_item" 
                        :value="`season_${season.season_number}`"
                    >
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
// firebase
import db from '@/firebase/init'
import firebase from 'firebase/app'
// vuex -- store
import { mapState } from 'vuex';
// mixins
import { global, initInSingle } from '../../mixins/global'
import { scroll }from '../../mixins/scroll'
import { icons, text }from '../../mixins/styles'
import { calculate, formating }from '../../mixins/formating'
import { recommend, seasons }from '../../mixins/showBoxes'
import { buttonsInList, buttonsInDetail }from '../../mixins/buttons'
import { moviesData  } from '../../mixins/apiData'


export default {
    mixins: [
        global, initInSingle, 
        scroll, 
        icons, text, 
        calculate, formating,
        recommend, seasons, 
        buttonsInList, buttonsInDetail,
        moviesData 
    ],
    components: {
        'app-footer': footer,
    },

    data () {
        return {
            loading: false,
            // cast and crew expansion panel
            panel: 0,
            currentTab: "season_1",
            // singular/plural of season and episode
            season: "season",
            episode: "episode",

            // bookmark shows in recommend
            rate: "",
            mark: "",

            menuItem: 0,
            trailers: [],
            directors: [],
        }
    },

    created(){
        // for start
        this.init()
        // render movie data
        this.getshowData()
        // render episodes
        this.getEpisode(1)
        // get data from firebase
        this.getFirebaseData()
        // back to top button
        window.addEventListener("scroll", this.backToTopBtn)

    },

    watch: {
        // set number of season in episode list
        currentTab(){
            this.getEpisode(this.currentTab.split("_").pop())
        },

        // currant rating
        rate(val) {
            this.user.shows.curRate = val * 10
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
        // ** FIREBASE DATA ** //
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
                        db.collection('rating').where('user', '==', this.user.id).where('iId', '==', this.$route.params.id).get()
                        .then(snapshot => {                           
                            
                            if (snapshot.docs[0]) {
                                this.user.shows.curRate = snapshot.docs[0].data().user_rate
                            } 
                        }) 

                        // read firebase database in real time
                        // watchlist database
                        db.collection('watchlist').where('user', '==', this.user.id)
                        .onSnapshot((snapshot) => {
                            snapshot.docChanges().forEach(change => {
                                // if favorite movie is add to the database then:
                                if (change.type == 'added') {
                                    // read record and save to array
                                    let record = change.doc.data()
                                    record.id = change.doc.id

                                    if(record.media_type == "tv") {
                                        this.user.shows.mark.push(record)
                                    }
                                   
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
                        
                        // seen database
                        db.collection('seen').where('user', '==', this.user.id)
                        .onSnapshot((snapshot) => {
                            snapshot.docChanges().forEach(change => {
                                // if marked movie is add to the database then:
                                if (change.type == 'added') {
                                    // read record and save to array
                                    let record = change.doc.data()
                                    record.id = change.doc.id

                                    if (record.media_type == "tv") {
                                        this.user.shows.seen.push(record)
                                    }                                  
                                }
                                // if marked movie is remove to the database then:
                                if (change.type == 'removed') {
                                    // remove movie from array
                                    this.user.shows.seen = this.user.shows.seen.filter(item =>{
                                        return item.id != change.doc.id
                                    }) 
                                }    
                            })
                        })

                        // rated database
                        db.collection('rating').where('user', '==', this.user.id).where('iId', '==', this.$route.params.id)
                        .onSnapshot((snapshot) => {
                            snapshot.docChanges().forEach(change => {
                                let userRate
                                // if marked movie is add to the database then:
                                if (change.type == 'added') {
                                    userRate = snapshot.docs[0].data().user_rate
                                    this.user.shows.curRate = userRate
                                    // read record and save to array
                                    let record = change.doc.data()
                                    record.id = change.doc.id

                                    if (record.media_type == "tv") {
                                        this.user.shows.rate.push(record)
                                    }
                                
                                }
                                // if marked movie is remove to the database then:
                                if (change.type == 'removed') {
                                    // remove movie from array
                                    this.user.shows.rate = this.user.shows.rate.filter(item =>{
                                        return item.id != change.doc.id
                                    }) 
                                } 
                            })  
                        })
                    })
                })
            }
        },


        // API DATABASE
        // get show data from database
        getshowData() {
            this.init()
            axios.get(`${this.URL.database}tv/${this.$route.params.id}${this.URL.apiKey}&append_to_response=videos,credits,recommendations,similar`)
            .then(res => {
               
                //** TV SHOW DETAIL **//
                //*****************//
                this.detail.data = res.data

                // rename item 
                this.detail.data.title = this.detail.data.name
                this.detail.data.release_date = this.detail.data.first_air_date
                
                // if is no poster image replace with holder
                this.poster()
            
                // slice overview -- show all overview button
                this.overview()
                
                // episode average run time
                this.detail.data.episode_run_time_average = this.average(this.detail.data.episode_run_time)
                
                // set backdrop url
                this.detail.data.backdrop_path = URL + this.detail.data.backdrop_path

                // get just year from first air date
                this.getYear()

                // show episode run time if exist
                this.detail.data.episode_run_time.length > 0 ? this.is.episode = true : this.is.episode = false  

                // plural season and epsisode when is more then one
                this.plural()

                // rate number formating to one decimal
                this.getRate()

           
                //** CREDITS **//
                //************//
                this.detail.credits.crew = res.data.credits.crew
                this.detail.credits.cast = res.data.credits.cast

                let crew = this.detail.credits.crew
                let cast = this.detail.credits.cast

                // get directors
                this.getDirectors(crew)

                // if is no profile image in cast replace with holder
                this.actors(cast)
                this.actors(crew)
                
                // show crew section only if crew exist
                !crew.length ? (this.is.crew = false) : this.is.crew = true

                // show cast section only if cast exist if not crew panel is expand
                this.castPanel(cast)

                // if crew and cast don't exist hide all credits
                this.noCredits()

                //** RECOMMENDATIONS **//
                //********************//
                this.detail.recommend = res.data.recommendations.results

                // rename item name to title 
                this.renameItems(this.detail.recommend)
                
                // if is no poster image replace with holder
                this.posters(this.detail.recommend )

                // get just year from release date
                this.getYears(this.detail.recommend)
 
                // rate number formating to one decimal
                this.getRates(this.detail.recommend)

                // show recomend item if exist
                this.detail.recommend.length > 0 ? this.is.recommend = true : this.is.recommend = false   


                //** SIMILAR **//
                //************//
                this.detail.similar = res.data.similar.results
                
                // rename item name to title 
                this.renameItems(this.detail.similar)

                // if is no poster image replace with holder
                this.posters(this.detail.similar)

                // get just year from release date
                this.getYears(this.detail.similar)

                // rate number formating to one decimal
                this.getRates(this.detail.similar)

                // show similar item if exist
                this.detail.similar.length > 0 ? this.is.similar = true : this.is.similar = false


                //** TRAILER **//
                //************//
                this.detail.video = res.data.videos.results      
                
                // set video url
                this.getVideo(this.detail.video)

                //show trailer button if video exist
                !this.trailers.length ? this.is.video = false : this.is.video = true  

               
        

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
    },
}
</script>


<style lang='scss' scoped>
    @import '../../assets/scss/_variables';
    @import '../../assets/scss/pages/_movies';
    @import '../../assets/scss/parts/_general';
    @import '../../assets/scss/parts/_cast';
    @import '../../assets/scss/parts/_seasons';
    @import '../../assets/scss/parts/_itemList';

</style>
