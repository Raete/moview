<template><div>

    <main  class="main" v-bind:style="{ 
            backgroundImage: 'url(' + movie.data.backdrop_path + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }"   >
        <img class="poster" :src="movie.data.poster_path" alt="">
        <div class="main_container">
            <router-link to="/#menu"> 
                <div class="back_btn">
                    <i class="material-icons">
                        keyboard_backspace
                    </i>
                    homepage
                </div>
            </router-link>
            <section class="info_wrapper">
                <span class="info_rate">{{movie.data.vote_average}}
                    <img src="../assets/img/svg/star_y.svg">
                </span>
                <div class="info_name">
                    
                    <h1 class="info_title">{{movie.data.title}} <span v-if="movie.data.release_date" class="info_year">({{movie.data.release_date}})</span>    </h1>
                    
                </div>
                <ul class="info_tags">
                    <li v-for="tag in movie.data.genres" :key="tag.id" class="info_tag">{{tag.name}}</li>
                </ul>
                <p class="info_time">Run time:<span> {{movie.data.runtime}}</span></p>
                
                <ul class="info_crew">
                    <li class="info_crew_title">Crew</li>
                    <li v-for="person in movie.credits.crew" :key="person.id" class="info_crew_name">{{person.job}}: <span>{{person.name}}</span></li>
                </ul>

                <p class="info_time">Budget:<span>  ${{formatNub(movie.data.budget)}}</span></p>
                <p class="info_time">Revenue:<span> ${{formatNub(movie.data.revenue)}}</span></p>

                <div v-if="movie.data.overview" class="info_overview_wrapper">
                    <h1 class="info_overview_title">Overview</h1>
                    <p class="info_overview_text">{{movie.data.overview}}</p>
                </div>
                <button v-if="is.video" @click.stop="getVideo" class="info_btn">view trailer
                    <i class="material-icons">
                    trending_flat
                    </i>
                </button>
                <v-dialog v-model="video" width="700">
                    <v-card>
                    
                        <v-card-text class="video_wrapper" v-for="(video, i) in movie.video" :key="i">
                            <iframe width="560" height="315" :src="video.key" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </section>
        </div>
    </main>
    <section class="cast">
        <div class="cast_wrapper">
            <h1 class="cast_title">
                Cast
            </h1>
            <div class="cast_person_wrapper" v-bind:class="{'showLess' : showLess }">
                <div v-for="(actor, index) in movie.credits.cast" :key="index" class="cast_person">
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
            <button v-if="is.cast" class="more_btn" v-on:click=" showMore() ">{{ buttonTitle }}</button>

        </div> 
    </section>
    <section></section>
    <section class="item_container" v-if="is.recomend">
        <h1 class="recommend">Recommendations</h1> 
        <div class="item_wrapper">
            <div class="item" v-for="(film, index) in movie.recommend" :key="index">
                <router-link :to="{ name: 'singleMovie', params: { id: film.id } }"> 
                    
                    <figure class="item_content">
                        <span class="item_rate">
                                        {{film.vote_average}} <img src="../assets/img/svg/star.svg"></span>
                        <img class="item_img" v-bind:src="film.poster_path" alt="">
                        <figcaption class="item_hover">
                            <img class="item_hover_ico" src="../assets/img/svg/plus.svg" alt="">
                        </figcaption>           
                    </figure>
                </router-link>
                <h1 class="item_name"> {{film.title}}  </h1>
            </div>
        </div>


    </section>
    <app-footer></app-footer>
   
</div></template>

<script>
import footer from '../components/footer.vue';
import axios from 'axios';


export default {
    components: {
        'app-footer': footer,
    },

    data () {
        return {
            video: false,
            showLess: true,
            buttonTitle: "show more",
            background: require('../assets/img/homeBack.jpg'),
            URL: { 
                img: "https://image.tmdb.org/t/p/w500" ,
                database: "https://api.themoviedb.org/3/",
                apiKey: "?api_key=0729eb044b5e37b6c0ff52a4c8617f94",
                id: "",
            },
            holder: {
                person: require('../assets/img/holders/person.svg'),
                movie: require('../assets/img/posters/empty.jpg'),
            },
            movie: {
                data: [],
                credits: {
                    cast: [],
                    crew: [],
                },
                recomend: [],
                video: [],
            },
            is: {
                recomend: false,
                cast: false,
                video: true,
            }
     

        }
    },

    created(){

        this.getMovieData()
        this.getMovieCredits()
        this.getRecommend()
        this.getTrailer()
        console.log(this.movie.video)

    },

  

    methods: {

        formatNub(num){ 
            num = Math.abs(num);
            num = num.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
            return num
        },

        


        getVideo() {
            this.video = !this.video
            
        },

        showMore() {
            this.showLess = !this.showLess
            if (this.showLess) {
                this.buttonTitle = 'show more'
            } else {
                this.buttonTitle = 'show less'
            }
        },

        timeConvert(data) {
            let minutes = data % 60
            let hours = (data - minutes) / 60
            return  `${hours}h ${minutes}m`
        },

        getMovieData() {
            axios.get(`${this.URL.database}movie/${this.$route.params.id}${this.URL.apiKey}`)
            .then(res => {
                const URL = "https://image.tmdb.org/t/p/original"
                this.movie.data = res.data

                if (this.movie.data.poster_path) {
                    this.movie.data.poster_path = URL + this.movie.data.poster_path
                } else if (this.movie.data.poster_path == null) {
                    this.movie.data.poster_path = this.holder.movie
                }

                

                this.movie.data.backdrop_path = URL + this.movie.data.backdrop_path
                this.movie.data.release_date = this.movie.data.release_date.slice(0,4)
                this.movie.data.runtime = this.timeConvert(this.movie.data.runtime)
            }) 
        },

        getMovieCredits() {
            axios.get(`${this.URL.database}movie/${this.$route.params.id}/credits${this.URL.apiKey}`)
            .then(res => {
                const URL = "https://image.tmdb.org/t/p/w235_and_h235_face"
                this.movie.credits.crew = res.data.crew
                this.movie.credits.crew = this.movie.credits.crew.slice(0,3) 
                this.movie.credits.cast = res.data.cast

                this.movie.credits.cast.forEach((profile)=>{
                    if (profile.profile_path) {
                        profile.profile_path = URL + profile.profile_path
                    } else if (profile.profile_path == null) {
                        profile.profile_path = this.holder.person
                    }
                })

                if (this.movie.credits.cast.length > 4) {
                    this.is.cast = true
                } else  { this.is.cast = false }
                
            }) 
        },

        getRecommend() {
            axios.get(`${this.URL.database}movie/${this.$route.params.id}/recommendations${this.URL.apiKey}`)
            .then(res => {
               const URL = "https://image.tmdb.org/t/p/w500"
                this.movie.recommend = res.data.results
                this.movie.recommend = this.movie.recommend.slice(0, 4) 
                this.movie.recommend.forEach((poster)=>{
                    if (poster.poster_path) {
                        poster.poster_path = URL + poster.poster_path
                    } else if (poster.poster_path == null) {
                        poster.poster_path = this.URL.holder.movie
                    }
                })
                if (this.movie.recommend.length > 0) {
                    this.is.recomend = true
                } else { this.is.recomend = false }
                
            }) 
        },

        getTrailer() {
            axios.get(`${this.URL.database}movie/${this.$route.params.id}/videos${this.URL.apiKey}`)
            .then(res => {
                this.movie.video =  res.data.results
                console.log(this.movie.video)
                const URL = "https://www.youtube.com/embed/"
                this.movie.video.forEach((video)=>{
                    
                    if (video.key) {
                        video.key = URL + video.key
                    } 

                })

                if (!this.movie.video.length) {
                    this.is.video = false
                } else if (this.movie.video.length) {
                    this.is.video = true
                }

                this.movie.video = this.movie.video.slice(0,1)
                return this.movie.video

            }) 
        },


    },
}
</script>


<style lang='scss' scoped>
@import '../assets/scss/_variables';
@import '../assets/scss/singlePage/_overview';
@import '../assets/scss/singlePage/_cast';
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
