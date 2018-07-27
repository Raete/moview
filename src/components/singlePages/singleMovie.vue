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
    <section v-if="is.credits" class="cast animated">
        <div class="cast_wrapper" v-if="!loading">

            <v-expansion-panel>
                <v-expansion-panel-content v-model="panel" class="credits" v-if="is.cast">
                    <h1 slot="header" class="credits_title">Cast</h1>
                    <div class="cast_person_wrapper">
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
                </v-expansion-panel-content>

                <v-expansion-panel-content class="credits" v-if="is.crew">
                    <h1 slot="header" class="credits_title">Crew</h1>
       
                     <div class="cast_person_wrapper" >
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
                </v-expansion-panel-content>
            </v-expansion-panel>
            
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
            video: false,
            loading: false,
            dialog: false,
            // cast panel active
            panel: true
        }
    },

    created(){

        // render movie data
        this.getItemData()

       
    },

    computed: {
        //get data from store
        URL(){ return this.$store.state.URL },
        holder(){ return this.$store.state.holder },
        detail(){ return this.$store.state.detail },
        is(){ return this.$store.state.is },
    },

    methods: {
        //start setting - reset data
        init(){
            this.loading = true
            this.detail.data = ""
            this.detail.credits.cast = ""
            this.detail.recommend = ""
            this.detail.video = ""
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
        getItemData() {
            //start setting - reset data
            this.init()
            // API database
            axios.get(`${this.URL.database}movie/${this.$route.params.id}${this.URL.apiKey}&append_to_response=videos,credits,recommendations`)
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
                    this.detail.data.short = this.detail.data.overview.slice(0,350) + "..."
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
                
                //** CREDITS **//
                //************//
                const URLface = "https://image.tmdb.org/t/p/w235_and_h235_face"
                this.detail.credits.crew = res.data.credits.crew
                this.detail.credits.cast = res.data.credits.cast

                let crew = this.detail.credits.crew
                let cast = this.detail.credits.cast
                // only 3 crew person in overview
                if (res.data.credits.crew) {
                   this.detail.credits.crew_short = res.data.credits.crew.slice(0,3)
                }
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
                // show crew section
                !crew.length ? (this.is.crew = false) : this.is.crew = true
                // show cast section
                !cast.length ? (this.is.cast = false) : this.is.cast = true

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

                //** TRAILER **//
                //************//
                const URLvideo = "https://www.youtube.com/embed/"
                this.detail.video = res.data.videos.results   

                // set video url
                this.detail.video.forEach((video)=>{   
                    if (video.key) {
                        video.key = URLvideo + video.key
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
