<template><div>
    <div class="loading" v-if="loading">
            <img src="@/assets/img/svg/loader.svg" alt="loading..." >
            </div>


    <main  v-if="!loading" class="main animated" v-bind:style="{ 
            backgroundImage: 'url(' + topBackground() + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }"   >
        <img class="poster" :src="detail.data.poster_path" alt="">
        <div class="main_container">
            <!-- back button -->
            <router-link :to="{ name: 'movies' }"> 
                <div class="back_btn">
                    <i class="material-icons">
                        keyboard_backspace
                    </i>
                    homepage
                </div>
            </router-link>
            <!-- movie detail info -->
            <section  class="info_wrapper">
                <span class="info_rate">{{detail.data.vote_average}}
                    <img src="@/assets/img/svg/star_y.svg">
                </span>
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
                    <li v-for="tag in detail.data.genres" :key="tag.id" class="info_tag">{{tag.name}}</li>
                </ul>
                <!-- movie run time-->
                <p v-if="detail.data.runtime" class="info_time">Run time:
                    <span> {{detail.data.runtime}}</span>
                </p>
                <!-- movie crew-->
                <ul v-if="is.crew" class="info_crew">
                    <li class="info_crew_title">Crew</li>
                    <li v-for="person in detail.credits.crew_short" :key="person.id" class="info_crew_name">{{person.job}}: 
                        <span> {{person.name}} </span>
                    </li>
                </ul>
                <!-- movie budget and revenuw -->
                <p v-if="detail.data.budget" class="info_time">Budget:
                    <span> ${{formatNub(detail.data.budget)}} </span>
                </p>
                <p v-if="detail.data.revenue" class="info_time">Revenue:
                    <span> ${{formatNub(detail.data.revenue)}} </span>
                </p>
                <!-- movie overview -->
                <div v-if="detail.data.overview" class="info_overview_wrapper">
                    <h1 class="info_overview_title">Overview</h1>
                    <p class="info_overview_text">{{detail.data.short}}</p>
                    <v-dialog v-model="dialog" width="600px" >
                        <button v-if="is.long" class="overview_btn" slot="activator" color="primary" dark>all overview</button>
                       
                        <v-card class="overview_more">
                            
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn icon flat @click.native="dialog = false">
                                    <v-icon>close</v-icon>
                                </v-btn>
                            </v-card-actions>
                            <v-card-text >{{detail.data.overview}}</v-card-text>
                            
                        </v-card>

                    </v-dialog>
                </div>
                <!-- movie trailer button-->
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
    <section v-if="!loading" class="cast animated">
        <div class="cast_wrapper">
            <!-- cast and crew tabs -->
            <v-tabs v-model="currentTab" class="tab_menu" color="transparent" centered >
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
                                        <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
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
                                        <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
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
    <!-- movies recommendations -->
    <section class="item_container animated" v-if="is.recomend">
        <h1 class="recommend">Recommendations</h1> 
        <div class="item_wrapper">
            <div class="item" v-for="(film, index) in detail.recommend" :key="index">
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
            currentTab: "cast",
            video: false,
            loading: false,
            dialog: false,
        }
    },

    created(){
        this.init()
        // render movie data
        this.getMovieData()
        // render movie credits
        this.getMovieCredits()
        // render movie recommendations
        this.getRecommend()
        // render trailer video
        this.getTrailer()

   

    },

    computed: {
        //get data from store
        URL(){ return this.$store.state.URL },
        holder(){ return this.$store.state.holder },
        detail(){ return this.$store.state.detail },
        is(){ return this.$store.state.is },
        button(){ return this.$store.state.button },
    },

    watch: {
        // show less person on inactive tab
        currentTab() {

            if (this.currentTab = "cast") {
                this.button.showLessCrew = true
                this.button.titleCrew = "show more crew"
            } 
            if (this.currentTab = "crew") {
                this.button.showLessCast = true
                this.button.titleCast = "show more cast"
            }

        },
        
    },

    methods: {
        // for start
        init(){
            this.button.showLessCast = true
            this.detail.data.poster_path = ""
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
        // toggle cast more button
        showMoreCast() {
            this.$store.commit("showMoreCast")
        },
        // toggle crew more button
        showMoreCrew() {
            this.$store.commit("showMoreCrew")
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
        // format run time
        timeConvert(data) {
            let minutes = data % 60
            let hours = (data - minutes) / 60
            return  `${hours}h ${minutes}m`
        },
        // background
        topBackground(){
            if (window.innerWidth > 800) {
                return this.detail.data.backdrop_path
            } else return ""
    
        },
        // get movie data from database
        getMovieData() {
            this.loading = true
            this.detail.data = ""
            axios.get(`${this.URL.database}movie/${this.$route.params.id}${this.URL.apiKey}`)
            .then(res => {
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
                    this.detail.data.short = this.detail.data.overview.slice(0,350) + "..."
                } else { 
                    this.detail.data.short = this.detail.data.overview
                    this.is.long = false
                }
                // set backdrop url
                this.detail.data.backdrop_path = URL + this.detail.data.backdrop_path
                // get just year from release date
                if(this.detail.data.release_date ) {
                   this.detail.data.release_date = this.detail.data.release_date.slice(0,4)
                }
                // format run time 
                if (this.detail.data.runtime) {
                    this.detail.data.runtime = this.timeConvert(this.detail.data.runtime)
                }  
             
            }).then(()=> {
                this.loading = false
            }) 
        },
        // get movie credits from database
        getMovieCredits() {
            this.loading = true
            this.currentTab = "cast"
            this.detail.credits.cast = ""
            axios.get(`${this.URL.database}movie/${this.$route.params.id}/credits${this.URL.apiKey}`)
            .then(res => {
                const URL = "https://image.tmdb.org/t/p/w235_and_h235_face"
                this.detail.credits.crew = res.data.crew
                this.detail.credits.cast = res.data.cast


                let crew = this.detail.credits.crew
                let cast = this.detail.credits.cast
                // only 3 crew person in overview
                if (res.data.crew) {
                   this.detail.credits.crew_short = res.data.crew.slice(0,3)
                }
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
                // if crew and cast don't exist hide all credits
                if ( !this.is.crew && !this.is.cast ) {
                    this.is.credits = false
                }
            }).then(()=> {
                this.loading = false
            }) 
        },
        // get recommend movies from database
        getRecommend() {
            this.loading = true
          //  this.detail.recommend = ""
            axios.get(`${this.URL.database}movie/${this.$route.params.id}/recommendations${this.URL.apiKey}`)
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
                // get just year from release date
                this.detail.recommend.forEach((year)=>{
                    if(year.release_date) {
                        year.release_date = year.release_date.slice(0,4)
                    } else {
                         year.release_date = "????"
                    }
                })
                // sort movie by rate
                this.detail.recommend.sort(this.dynamicSort("-vote_average"))
                // render only 6 movies
                if (this.detail.recommend){
                    this.detail.recommend = this.detail.recommend.slice(0,6)
                }
                // show recomend item if exist
                this.detail.recommend.length > 0 ? this.is.recomend = true : this.is.recomend = false  

            }).then(()=> {
                this.loading = false

            })  
        },
        // get movie trailer video from database
        getTrailer() {
            axios.get(`${this.URL.database}movie/${this.$route.params.id}/videos${this.URL.apiKey}`)
            .then(res => {
                this.detail.video = res.data.results      
                const URL = "https://www.youtube.com/embed/"
                // set video url
                this.detail.video.forEach((video)=>{
                    
                    if (video.key) {
                        video.key = URL + video.key
                    } 
                    this.detail.video = video.key 
                   
                })
                this.detail.video
                //show trailer button if video exist
                !this.detail.video.length ? this.is.video = false : this.is.video = true 
                // show only 1 trailer
                return this.detail.video
                
            }) 
        },
        // video trailer - active only when dialog si active
        trailer(){
            if (this.video) {
                return this.detail.video
            } else if (!this.video) {
                return ' '   
            }
        },
    },
}
</script>


<style lang='scss' scoped>
@import '../../assets/scss/_variables';
@import '../../assets/scss/parts/_general';
@import '../../assets/scss/singlePage/_overview';
@import '../../assets/scss/singlePage/_cast';
@import '../../assets/scss/parts/_itemList';






</style>
