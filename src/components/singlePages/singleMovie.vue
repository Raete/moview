<template><div>
    <v-app>
        <div class="loading" v-if="loading">
            <img src="@/assets/img/svg/loader.svg" alt="loading..." >
        </div>
        <!-- open video -->
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
        <!-- open full overview -->
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

        <main  v-if="!loading" class="main animated" v-bind:style="{ 
                backgroundImage: 'url(' + detail.data.backdrop_path + ')',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }"   >
        
            <img class="poster" :src="detail.data.poster_path" alt="">

            <div class="main_container" >
                <!-- header -->
                <header class="main_container_header">
                    <!-- back button -->
                    <v-btn flat round :to="{ name: 'movies' }" >
                        <v-icon color="primary"> keyboard_backspace </v-icon>
                        homepage
                    </v-btn>
                    <!-- favorite button -->
                    <v-btn flat round @click="likeButton()">
                        <v-icon color="primary"> {{like.icon}} </v-icon>
                        Add to favorite
                    </v-btn>
                </header>
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
                    <button slot="activator" v-if="is.video" @click.stop="showVideoOnTop()" class="btn_video">view trailer
                    </button>
                </section>
            </div>
        </main>
        <!-- cast and crew section -->
        <section v-if="is.credits" class="cast animated">
            <div class="cast_wrapper" v-if="!loading">
                <v-expansion-panel>
                    <!-- cast panel -->
                    <v-expansion-panel-content :value="panel" class="credits" v-if="is.cast">
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
                    <!-- crew panel -->
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
    </v-app>
    <app-footer></app-footer>

</div></template>

<script>
import footer from '@/components/parts/footer.vue';
import itemList from '@/components/templates/itemList.vue';
import axios from 'axios';
import { mapState, mapMutations } from 'vuex';


export default {
    components: {
        'app-footer': footer,
        'app-itemList': itemList,
    },

    data () {
        return {
            loading: false,
            // cast and crew expansion panel
            panel: true,   
        }
    },

    created(){
        // render movie data
        this.getItemData()
        // style favorite icon 
        this.styleFavIcon()


    },

    computed: {
        //get data from store
        ...mapState([
            'URL',
            'holder',
            'detail',
            'like',
            'box',
            'is',
        ]),
    },

    methods: {
        ...mapMutations([
            'readStorage',
        ]),
        
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
        // format budget and revenue currancy 
        formatNub(num){ 
            num = Math.abs(num);
            num = num.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
            return num
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
        // format run time
        timeConvert(data) {
            let minutes = data % 60
            let hours = (data - minutes) / 60
            return  `${hours}h ${minutes}m`
        },

        // FAVORITE BUTTON
        // add like
        addLike(id, title, poster, year, rate, genres) {
            const like = {id, title, poster, year, rate, genres}
            this.like.movieData.push(like)
            // add like to local storage
            localStorage.setItem('movieLikes',JSON.stringify(this.like.movieData) );
            return like
        },
        // remove like
        deleteLike(id){
            const index = this.like.movieData.findIndex(el => el.id == id)
            this.like.movieData.splice(index, 1)
            // remove like to local storage
            localStorage.setItem('movieLikes',JSON.stringify(this.like.movieData) );
        },
        // check if movie is liked
        isLiked(id){
            return this.like.movieData.findIndex(el => el.id == id) !== -1
        },
        // add or remove like
        likeButton(){
            // if movie is not liked then:
            if (!this.isLiked(this.$route.params.id)) {
                // create new like object with id, title and poster path
                this.addLike (
                    this.$route.params.id,
                    this.detail.data.title,
                    this.detail.data.poster_path,
                    this.detail.data.release_date,
                    this.detail.data.vote_average,
                    this.detail.data.genres
                )
                // set icon style
                this.like.icon = "favorite"
                // alert info message
                this.like.alertText = "movie was add to favorite"
            // if movie is liked then
            } else {
                // delete movie from likes array
                this.deleteLike(this.$route.params.id)
                // set icon style
                this.like.icon = "favorite_border"
                // alert info message
                this.like.alertText = "movie was remove from favorite"
            }
        },
        // stylize like button depending on whether the movie is liked
        styleFavIcon(){
            // read data from local storage
            this.readStorage()
            // if is current movie liked then: 
            if(this.isLiked(this.$route.params.id)){
                // set icon style
                this.like.icon = "favorite"
            } else this.like.icon = "favorite_border"
        },
        // get movie data from API database
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
                    this.panel.crew = true
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

</style>
