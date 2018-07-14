<template><div v-if="!loading">
    
    <main  class="main" v-bind:style="{ 
            backgroundImage: 'url(' + detail.data.backdrop_path + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }"   >
        <img class="poster" :src="detail.data.poster_path" alt="">
        <div class="main_container">
            <!-- back button -->
            <router-link :to="{ name: 'shows' }"> 
                <div class="back_btn">
                    <i class="material-icons">
                        keyboard_backspace
                    </i>
                    homepage
                </div>
            </router-link>
            <!-- show detail info -->
            <section  class="info_wrapper">
                <span class="info_rate">{{detail.data.vote_average}}
                    <img src="../assets/img/svg/star_y.svg">
                </span>
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
                <!-- show crew-->
                <ul v-if="is.crew" class="info_crew">
                    <li class="info_crew_title">Crew</li>
                    <li v-for="person in detail.credits.crew.slice(0,3)" :key="person.id" class="info_crew_name">{{person.job}}: 
                        <span> {{person.name}} </span>
                    </li>
                </ul>
                <!-- number of seasons and episodes -->
                <p v-if="detail.data.number_of_seasons" class="info_time">                  
                    <span> {{detail.data.number_of_seasons}} </span>{{season}}
                </p>
                <p v-if="detail.data.number_of_episodes" class="info_time">
                    <span> {{detail.data.number_of_episodes}} </span>{{episode}}
                </p>
                <!-- show overview -->
                <div v-if="detail.data.overview" class="info_overview_wrapper">
                    <h1 class="info_overview_title">Overview</h1>
                    <p class="info_overview_text">{{detail.data.short}}</p>
                    <v-dialog v-model="dialog" width="600px" >
                        <button v-if="is.long" class="overview_btn" slot="activator" color="primary" dark>all overview</button>
                       
                        <v-card class="overview">
                            
                            <v-btn icon dark @click.native="dialog = false">
                                <v-icon>close</v-icon>
                            </v-btn>
                            <v-card-text >{{detail.data.overview}}</v-card-text>
                            
                        </v-card>

                    </v-dialog>
                </div>
                <!-- show trailer button-->
                <button v-if="is.video" @click.stop="video = !video" class="info_btn">view trailer
                </button>
                <!-- open video -->
                <v-dialog v-model="video" width="700">
                    <v-card>
                        <v-card-text class="video_wrapper">
                            <iframe width="560" height="315" :src="trailer()" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </section>
        </div>
    </main>
    <!-- cast and crew section -->
    <section class="cast">
        <div class="cast_wrapper">
            <!-- cast and crew tabs -->
            <v-tabs v-model="currentTabCrew" class="tab_menu" color="transparent" centered >
                <v-tabs-slider color="black" ></v-tabs-slider>
                <v-tab v-if="is.cast" class="tab_menu_item" href="#cast">
                    Cast
                </v-tab>
                <v-tab v-if="is.crew" class="tab_menu_item" href="#crew">
                    crew
                </v-tab>
                <!-- cast tab -->
                <v-tab-item class="tab_item" id="cast">
                    <div class="cast_person_wrapper" v-bind:class="{'showLess' : button.showLessCast }">
                        <div v-for="(actor, index) in detail.credits.cast" :key="index" class="cast_person">
                            <router-link :to="{ name: 'singleActor', params: { id: actor.id } }"> 
                                <figure class="cast_content">
                                    <img class="cast_person_img" v-bind:src="actor.profile_path" alt="">
                                    <figcaption class="cast_content_hover">
                                        <img class="item_hover_ico" src="../assets/img/svg/plus.svg" alt="">
                                    </figcaption>           
                                </figure>
                            </router-link>
                            <h2 class="cast_person_name">{{ actor.name }}</h2>
                            <p class="cast_person_role">{{ actor.character}}</p>
                        </div>
                    </div>
                    <button v-if="button.isCast" class="more_btn" v-on:click=" showMoreCast() ">{{ button.titleCast }}</button>
                </v-tab-item>
                <!-- crew tab -->
                <v-tab-item class="tab_item" id="crew">
                    <div class="cast_person_wrapper" v-bind:class="{'showLess' : button.showLessCrew }">
                        <div v-for="(actor, index) in detail.credits.crew" :key="index" class="cast_person">
                            <router-link :to="{ name: 'singleActor', params: { id: actor.id } }"> 
                                <figure class="cast_content">
                                    <img class="cast_person_img" v-bind:src="actor.profile_path" alt="">
                                    <figcaption class="cast_content_hover">
                                        <img class="item_hover_ico" src="../assets/img/svg/plus.svg" alt="">
                                    </figcaption>           
                                </figure>
                            </router-link>
                            <h2 class="cast_person_name">{{ actor.name }}</h2>
                            <p class="cast_person_role">{{ actor.job}}</p>
                        </div>                    
                    </div>
                    <button v-if="button.isCrew" class="more_btn" v-on:click=" showMoreCrew() ">{{ button.titleCrew }}</button>
                </v-tab-item>
            </v-tabs><!-- end cast and crew tabs -->
        </div> 
    </section>
    <!-- episode list -->
    <section class="episode_wrapper">
        <!-- episode list -->
         <v-tabs  v-model="currentTab" centered color="transparent">
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
                        <p class="episode_content">{{episode.overview}}</p>
                    </div>
                </div>
                <div class="episode_feedback" v-if="!detail.episodes.length">
                    There are no episodes added to this season.
                </div>
            </v-tab-item>
        </v-tabs>
    </section>
    <!-- shows recommendations -->
    <section class="item_container" v-if="is.recomend">
        <h1 class="recommend">Recommendations</h1> 
        <div class="item_wrapper">
            <div class="item" v-for="(film, index) in detail.recommend" :key="index">
                <router-link :to="{ name: 'singleShow', params: { id: film.id } }"> 
                    <app-itemList>
                        <template slot="rate">{{film.vote_average}}</template>
                        <template slot="year">{{film.first_air_date.slice(0,4)}}</template>
                        <img slot="img" class="item_img" v-bind:src="film.poster_path" alt="">
                    </app-itemList>
                </router-link>
                <h1 class="item_name"> {{film.title}} </h1>
            </div>
        </div> 
    </section>
    <app-footer></app-footer>
   
</div></template>

<script>
import footer from '../components/footer.vue';
import itemList from '../components/templates/itemList.vue';
import axios from 'axios';


export default {
    components: {
        'app-itemList': itemList,
        'app-footer': footer,
    },

    data () {
        return {
            loading: false,
            currentTabCrew: "cast",
            currentTab: "season_1",
            video: false,
            dialog: false,
            season: "season",
            episode: "episode"
        }
    },

    created(){
        // render movie data
        this.getMovieData()
        // render movie credits
        this.getMovieCredits()
        // render movie recommendations
        this.getRecommend()
        // render trailer video
        this.getTrailer()
        // render episodes
        this.getEpisode(1)
    },

    watch: {
        // show less person on inactive tab
        currentTabCrew() {

            if (this.currentTab = "cast") {
                this.button.showLessCrew = true
                this.button.titleCrew = "show more crew"
            } 
            if (this.currentTab = "crew") {
                this.button.showLessCast = true
                this.button.titleCast = "show more cast"
            }
        },

        currentTab(){
            // set number of season in episode list
            this.getEpisode(this.currentTab.split("_").pop())
        },
    },

    computed: {
        //get data from store
        URL(){ return this.$store.state.URL },
        holder(){ return this.$store.state.holder },
        detail(){ return this.$store.state.detail },
        is(){ return this.$store.state.is },
        button(){ return this.$store.state.button },
    },


    methods: {
        // toggle cast more button
        showMoreCast() {
            this.button.showLessCast = !this.button.showLessCast
            if (this.button.showLessCast) {
                this.button.titleCast = 'show more cast'
            } else {
                this.button.titleCast = 'show less cast'
            }
        },
        // toggle crew more button
        showMoreCrew() {
            this.button.showLessCrew = !this.button.showLessCrew
            if (this.button.showLessCrew) {
                this.button.titleCrew = 'show more crew'
            } else {
                this.button.titleCrew = 'show less crew'
            }
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
        // get show data from database
        getMovieData() {
            this.loading = true
            axios.get(`${this.URL.database}tv/${this.$route.params.id}${this.URL.apiKey}`)
            .then(res => {
                const URL = "https://image.tmdb.org/t/p/original"
                this.detail.data = res.data
                // if is no poster image replace with holder
                if (this.detail.data.poster_path) {
                    this.detail.data.poster_path = URL + this.detail.data.poster_path
                } else if (this.detail.data.poster_path == null) {
                    this.detail.data.poster_path = this.holder.photo
                }
                // slice overview -- show all overview button
                if (this.detail.data.overview.length > 350) {
                    this.is.long = true
                    this.detail.data.short = this.detail.data.overview.slice(0,350) + "..."
                } else { 
                    this.detail.data.short = this.detail.data.overview
                    this.is.long = false
                }
                // episode average run time
                this.detail.data.episode_run_time_average = this.average(this.detail.data.episode_run_time)
                // get number of seasons
                res.data.seasons.forEach((season)=>{
                    this.detail.seriesNum.push(season.season_number)  
                })
                // set backdrop url
                this.detail.data.backdrop_path = URL + this.detail.data.backdrop_path
                // get just year from first air date
                this.detail.data.first_air_date = this.detail.data.first_air_date.slice(0,4)
                // show episode run time if exist
                this.detail.data.episode_run_time.length > 0 ? this.is.episode = true : this.is.episode = false  
                // plural season and epsisode when is more then one
                this.plural()
            }).then(()=> {
                this.loading = false
            })  
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
                        screen.still_path = this.holder.movie
                    }
                })
               this.detail.episodes = ep
            })
        },
        // get show credits from database
        getMovieCredits() {
            this.loading = true
            this.currentTabCrew = "cast"
            axios.get(`${this.URL.database}tv/${this.$route.params.id}/credits${this.URL.apiKey}`)
            .then(res => {
                const URL = "https://image.tmdb.org/t/p/w235_and_h235_face"
                this.detail.credits.crew = res.data.crew
                this.detail.credits.cast = res.data.cast

                let crew = this.detail.credits.crew
                let cast = this.detail.credits.cast
                // if is no profile image in cast replace with holder
                cast.forEach((profile)=> {
                    if (profile.profile_path) {
                        profile.profile_path = URL + profile.profile_path
                    } else if (profile.profile_path == null) {
                        profile.profile_path = this.holder.person
                    }
                })
                // if is no profile image in crew replace with holder
                crew.forEach((profile)=> {
                    if (profile.profile_path) {
                        profile.profile_path = URL + profile.profile_path
                    } else if (profile.profile_path == null) {
                        profile.profile_path = this.holder.person
                    }
                })
                // show crew section
                !crew.length ? (this.is.crew = false, this.currentTabCrew = "cast") : this.is.crew = true
                // show cast section
                !cast.length ? (this.is.cast = false, this.currentTabCrew = "crew") : this.is.cast = true
                // show more/less button in cast tab if exist more then 6 person
                cast.length > 6 ? this.button.isCast = true : this.button.isCast = false 
                // show more/less button in crew tab if exist more then 6 person
                crew.length > 6 ? this.button.isCrew = true : this.button.isCrew = false 
            }).then(()=> {
                this.loading = false
            })  
        },
         // get recommend shows from database
        getRecommend() {
            this.loading = true
            axios.get(`${this.URL.database}tv/${this.$route.params.id}/recommendations${this.URL.apiKey}`)
            .then(res => {
               const URL = "https://image.tmdb.org/t/p/w500"
                this.detail.recommend = res.data.results
                // if is no poster image replace with holder
                this.detail.recommend.forEach((poster)=>{
                    if (poster.poster_path) {
                        poster.poster_path = URL + poster.poster_path
                    } else if (poster.poster_path == null) {
                        poster.poster_path = this.URL.holder.detail
                    }
                })
                // sort movie by rate
                this.detail.recommend.sort(this.dynamicSort("-vote_average"))
                // render only 6 movies
                this.detail.recommend = this.detail.recommend.slice(0,6)
                // show recomend item if exist
                this.detail.recommend.length > 0 ? this.is.recomend = true : this.is.recomend = false    
            }).then(()=> {
                this.loading = false
            })  
        },

        // get show trailer video from database
        getTrailer() {
            this.loading = true
            axios.get(`${this.URL.database}tv/${this.$route.params.id}/videos${this.URL.apiKey}`)
            .then(res => {
                this.detail.video = res.data.results      
                const URL = "https://www.youtube.com/embed/"
                // set video url
                this.detail.video.forEach((video)=>{
                    
                    if (video.key) {
                        video.key = URL + video.key
                    } 
                    this.detail.video_trailer = video.key
                })
                //show trailer button if video exist
                !this.detail.video.length ? this.is.video = false : this.is.video = true 
                // show only 1 trailer
                return this.detail.video_trailer
            }).then(()=> {
                this.loading = false
            })  
        },
        // video trailer - active only when dialog si active
        trailer(){
            if (this.video) {
                return this.detail.video_trailer 
            } else if (!this.video) {
                return ' '   
            }
        },
    },
}
</script>


<style lang='scss' scoped>
@import '../assets/scss/_variables';
@import '../assets/scss/singlePage/_overview';
@import '../assets/scss/singlePage/_cast';
@import '../assets/scss/singlePage/_seasons';
@import '../assets/scss/_tips';

.video_wrapper {
	position: relative;
	padding-bottom: 56.25%; /* 16:9 */
	padding-top: 25px;
    height: 0;
    iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}

.hideVideo {
    display: none;
}



</style>
