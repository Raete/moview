<template><div>

    <main class="main"  >
        <img class="poster" :src="actorImg.profile_path" alt="">
        <div class="main_container">
            <router-link :to="{ name: 'movies' }"> 
                <div class="back_btn">
                    <i class="material-icons">
                        keyboard_backspace
                    </i>
                    homepage
                </div>
            </router-link>
            <img class="cast_img" :src="actorData.profile_path" alt="">
            <section class="info_wrapper">
                <h1 v-if="actorData.name" class="info_name">{{actorData.name}}</h1>

                <div class="info_overview_wrapper">
                    <h1 v-if="actorData.biography" class="info_overview_title">Biography</h1>
                    <p class="info_overview_text">{{actorData.short}}</p>
                    <v-dialog v-model="dialog" width="600px" >
                        <button v-if="isLong" class="more_btn" slot="activator" color="primary" dark>All biography</button>
                       
                        <v-card class="biography">
                            
                            <v-btn icon dark @click.native="dialog = false">
                                <v-icon>close</v-icon>
                            </v-btn>
                            <v-card-text >{{actorData.biography}}</v-card-text>
                            
                        </v-card>

                    </v-dialog>
                </div>
            </section>
        </div>

    </main>
    <section class="item_container">
        <h1 class="recommend">Known for</h1> 
        <div class="item_wrapper">
            <div class="item" v-for="(film, index) in  movieKnown" :key="index">
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
    <section class="acting">
        <h1 class="acting_title">Acting</h1> 
        <v-tabs class="tab_menu" color="transparent" >
            <v-tabs-slider color="black" ></v-tabs-slider>

            <v-tab class="tab_menu_item" href="#movies">
                Movies
            </v-tab>
            <v-tab class="tab_menu_item" href="#tvShows">
                TV Shows
            </v-tab>
           
            <v-tab-item class="tab_item" id="movies">
       
                <ul class="acting_list">
                    
                    <li  v-for="(film, index) in  movieCredits" :key="index">
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
                            <img src="../assets/img/svg/star_g.svg">
                        </span>
                        </router-link>
                    </li>
                    
                </ul>

            </v-tab-item>
            <v-tab-item class="tab_item" id="tvShows">
       
                <ul class="acting_list">
                    <router-link :to="{ name: 'singleMovie' }"> 
                    <li class="acting_item" v-for="(film, index) in  showCredits" :key="index">
                        <div class="acting_info">
                            <p class="acting_year">{{film.first_air_date}}</p>
                            <div class="acting_film">
                                <h3 class="acting_name">{{film.name}}</h3>
                                <p class="acting_role">{{film.character}}</p>
                            </div>
                        </div>
                        <span class="acting_rate">
                            {{film.vote_average}} 
                            <img src="../assets/img/svg/star_g.svg">
                        </span>
                    </li>
                    </router-link>
                </ul>
            </v-tab-item>
        </v-tabs>
    </section>
    <app-footer></app-footer>
   
</div></template>

<script>
import footer from '../components/footer.vue';
import tips from '../components/tips.vue';
import axios from 'axios';


export default {
    components: {
        'app-footer': footer,
        'app-tips': tips,
    },

    data () {
        return {
            dialog: false,
            isLong: true,
            showLess: true,
            buttonTitle: "show more",
            background: require('../assets/img/homeBack.jpg'),
            URL: { 
                database: "https://api.themoviedb.org/3/",
                apiKey: "?api_key=0729eb044b5e37b6c0ff52a4c8617f94",
                id: "73457",
            },
            holder: {
                person: require('../assets/img/holders/person.svg'),
                movie: require('../assets/img/posters/empty.jpg'),
            },
            actorData: [],
            actorImg: "",
            movieCredits: [],
            showCredits: [],
            movieKnown: [],

            
             
        }
    },

    created(){
        this.getActorData()
        this.getMovieCredits()
        this.getShowCredits()
        this.getMovieKnow()
        this.getActorImg()

    },

    methods: {
        showMore() {
            this.showLess = !this.showLess
            if (this.showLess) {
                this.buttonTitle = 'show more'
            } else {
                this.buttonTitle = 'show less'
            }
        },

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

        getActorData() {
            axios.get(`${this.URL.database}person/${this.$route.params.id}${this.URL.apiKey}`)
            .then(res => {
                const URLFace = "https://image.tmdb.org/t/p/w235_and_h235_face"
                this.actorData = res.data

                if (this.actorData.biography.length > 350) {
                    this.isLong = true
                    this.actorData.short = this.actorData.biography.slice(0,350) + "..."
                } else { 
                    this.actorData.short = this.actorData.biography 
                    this.isLong = false
                }
             
               

                if (this.actorData.profile_path) {
                    this.actorData.profile_path = URLFace + this.actorData.profile_path
                } else if (this.actorData.profile_path == null) {
                    this.actorData.profile_path = this.holder.person
                }
            }) 
        },

        getActorImg() {
            axios.get(`${this.URL.database}person/${this.$route.params.id}${this.URL.apiKey}`)
            .then(res => {
                this.actorImg = res.data
                const URL = "https://image.tmdb.org/t/p/original"
                if (this.actorImg.profile_path) {
                    this.actorImg.profile_path = URL + this.actorImg.profile_path
                } else if (this.actorImg.profile_path == null) {
                    this.actorImg.profile_path = this.holder.movie
                }
            }) 
        },

        getMovieCredits() {
            axios.get(`${this.URL.database}person/${this.$route.params.id}/movie_credits${this.URL.apiKey}`)
            .then(res => {
                this.movieCredits = res.data.cast
  

                this.movieCredits = this.movieCredits.sort(this.dynamicSort("-release_date"))
                this.movieCredits.forEach((date)=>{
                
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
           
            }) 
        },

        getShowCredits() {
            axios.get(`${this.URL.database}person/${this.$route.params.id}/tv_credits${this.URL.apiKey}`)
            .then(res => {
                this.showCredits = res.data.cast


                this.showCredits = this.showCredits.sort(this.dynamicSort("-first_air_date"))
                this.showCredits.forEach((date)=>{
                    date.first_air_date = date.first_air_date.slice(0,4)
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
           
            }) 
        },

        getMovieKnow() {
            axios.get(`${this.URL.database}person/${this.$route.params.id}/movie_credits${this.URL.apiKey}`)
            .then(res => {
                const URL = "https://image.tmdb.org/t/p/w500"
                const URLFace = "https://image.tmdb.org/t/p/w235_and_h235_face"
                this.movieKnown = res.data.cast
                this.movieKnown = _.shuffle(this.movieKnown).slice(0,4) 
                this.movieKnown.forEach((poster)=>{
                    if (poster.poster_path) {
                        poster.poster_path = URL + poster.poster_path
                    } else if (poster.poster_path == null) {
                        poster.poster_path = this.holder.movie
                    }
                })
            }) 
        },
    },
}
</script>


<style lang='scss' scoped>
@import '../assets/scss/_variables';
@import '../assets/scss/_tips';

@import '../assets/scss/actors/_singleActor';

.biography {
    background: $color-bg--light;

}

.more_btn {
        display: flex;
        justify-content: center;
        text-align: center;
        padding: 10px 15px;
        margin: 30px auto 10px auto;
        border: 2px solid $color_text;
        border-radius: 8px;
        font-weight: 700;
        font-size: 100%;
        transition: .3s;
        &:hover {
            background: $color_text;
            color: $color-bg--light
        }
    }


</style>
