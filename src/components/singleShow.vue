<template><div>

    <main class="main" v-bind:style="{ 
            backgroundImage: 'url(' + background + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }"   >
        <img class="poster" src="../assets/img/posters/breaking_bad.jpg" alt="">
        <div class="main_container">
            <router-link :to="{ name: 'home' }"> 
                <div class="back_btn">
                    <i class="material-icons">
                        keyboard_backspace
                    </i>
                    homepage
                </div>
            </router-link>
            <section class="info_wrapper">
                <span class="info_rate">83%</span>
                <div class="info_name">
                    <h1 class="info_title">Breaking Bad</h1>
                    <span class="info_year">(2008)</span>
                </div>
                <ul class="info_tags">
                    <li class="info_tag">Drama</li>
                    <li class="info_tag">Adventure</li>
                    <li class="info_tag">Sci-fi</li>
                </ul>
                <p class="info_time">Run time:<span> 2h 11m</span></p>
                <ul class="info_crew">
                    <li class="info_crew_name">Director: <span>Ridley Scott</span></li>
                    <li class="info_crew_name">Novel:<span> Andy Weir</span></li>
                    <li class="info_crew_name">Screenplay: <span>Drew Goddard</span></li>
                </ul>
                <div class="info_overview_wrapper">
                    <h1 class="info_overview_title">Overview</h1>
                    <p class="info_overview_text">During a manned mission to Mars, Astronaut Mark Watney is presumed dead after a fierce storm and left behind by his crew. But Watney has survived and finds himself stranded and alone on the hostile planet. With only meager supplies, he must draw upon his ingenuity, wit and spirit to subsist and find a way to signal to Earth that he is alive.</p>
                </div>
                <button class="info_btn">view trailer
                    <i class="material-icons">
                    trending_flat
                    </i>
                </button>
            </section>
        </div>
    </main>
    <section class="cast">
        <div class="cast_wrapper">
            <h1 class="cast_title">
                Cast
            </h1>
            <div class="cast_person_wrapper" v-bind:class="{'showLess' : showLess }">
                <div v-for="(actor, index) in actors" :key="index" class="cast_person">
                    <router-link :to="{ name: 'singleActor' }"> 
                        <figure class="cast_content">
                            <img class="cast_person_img" v-bind:src="actor.img" alt="">
                            <figcaption class="cast_content_hover">
                                <img class="item_hover_ico" src="../assets/img/svg/plus.svg" alt="">
                            </figcaption>           
                        </figure>
                    </router-link>
                    <h2 class="cast_person_name">{{ actor.name }}</h2>
                    <p class="cast_person_role">{{ actor.role }}</p>
                </div>
                
            </div>
            <button class="more_btn" v-on:click=" showMore() ">{{ buttonTitle }}</button>

        </div> 
    </section>
    <section class="episode_wrapper">
         <v-tabs centered color="transparent">
            <v-tabs-slider class="tab_menu"></v-tabs-slider>
            <v-tab v-for="(season, i) in seasons" :key="i" :href="season.id">
                {{season.name}}
            </v-tab>
           
            <!--    SEASONS TAB   -->
            <v-tab-item class="tab_item" id="season_1">
       
                <div class="episode" v-for="(ep, index) in episodes" :key="index">
                    <img class="episode_img" :src="ep.img" alt="episode img">
                    <div>
                        <h1 class="episode_name">{{ep.epNum}}. {{ep.name}} </h1>
                        <p class="episode_date">{{ep.date}}</p>
                        <p class="episode_content">{{ep.overview}}</p>
                    </div>
                </div>
            </v-tab-item>

            <v-tab-item class="tab_item" id="season_2">
                <v-card flat>
                    <v-card-text>
                      
                        2
                    </v-card-text>
                </v-card>    
            </v-tab-item>
            <v-tab-item class="tab_item" id="season_3">
                <v-card flat>
                    <v-card-text>
                      
                        3
                    </v-card-text>
                </v-card>    
            </v-tab-item>
            <v-tab-item class="tab_item" id="season_4">
                <v-card flat>
                    <v-card-text>
                      
                        4
                    </v-card-text>
                </v-card>    
            </v-tab-item>
            <v-tab-item class="tab_item" id="season_5">
                <v-card flat>
                    <v-card-text>
                      
                        5
                    </v-card-text>
                </v-card>    
            </v-tab-item>
           

        </v-tabs>



    </section>
   
    <section class="item_container">
        <h1 class="recommend">Recommendations</h1> 
        <app-tips></app-tips>
    </section>
    <app-footer></app-footer>
   
</div></template>

<script>
import footer from '../components/footer.vue';
import tips from '../components/tips.vue';

export default {
    components: {
        'app-footer': footer,
        'app-tips': tips,
    },

    data () {
        return {
            showLess: true,
            buttonTitle: "show more",
            background: require('../assets/img/homeBack6.jpg'),
            actors: [
                { 
                    img: require('../assets/img/people/e1.jpg'),
                    name: 'Matt Damon',
                    role: 'Mark Watney'
                },
                { 
                    img: require('../assets/img/people/e1.jpg'),
                    name: 'Matt Damon',
                    role: 'Mark Watney'
                },
                { 
                    img: require('../assets/img/people/e1.jpg'),
                    name: 'Matt Damon',
                    role: 'Mark Watney'
                },           
                { 
                    img: require('../assets/img/people/e1.jpg'),
                    name: 'Matt Damon',
                    role: 'Mark Watney'
                },
                { 
                    img: require('../assets/img/people/e1.jpg'),
                    name: 'Matt Damon',
                    role: 'Mark Watney'
                },
                { 
                    img: require('../assets/img/people/e1.jpg'),
                    name: 'Matt Damon',
                    role: 'Mark Watney'
                },
                
                     
            ],
            films: [
                { 
                    img: require('../assets/img/posters/arrival.jpg'),
                    title: 'Arrival',
                    rate: '70%'
                },
                { 
                    img: require('../assets/img/posters/beauty_and_beast.jpg'), 
                    title: 'Beauty and the Beast',
                    rate: '65%'
                },
                { 
                    img: require('../assets/img/posters/best_offer.jpg'), 
                    title: 'The Best Offer',
                    rate: '48%'
                },           
                { 
                    img: require('../assets/img/posters/guardians.jpg'),  
                    title: 'Guardians of the Galaxy Vol. 2',
                    rate: '75%'
                },
                     
            ],
            seasons: [
                { 
                    id: '#season_1',
                    name: 'Season 1',
                },
                { 
                    id: '#season_2',
                    name: 'Season 2',
                },
                { 
                    id: '#season_3',
                    name: 'Season 3',
                },           
                { 
                    id: '#season_4',
                    name: 'Season 4',
                },
                { 
                    id: '#season_5',
                    name: 'Season 5',
                },  
            ],
            episodes: [
                { 
                    img:  require('../assets/img/episode/1.jpg'),
                    epNum: '1',
                    name: 'Pilot',
                    date: 'January 19, 2008',
                    overview: 'When an unassuming high school chemistry teacher discovers he has a rare form of lung cancer, he decides to team up with a former student and create a top of the line crystal meth in a used RV, to provide for his family once he is gone.',
                },
                {   
                    img:  require('../assets/img/episode/2.jpg'),
                    epNum: '2',
                    name: "The Cat's in the Bag",
                    date: 'January 19, 2008',
                    overview: 'When an unassuming high school chemistry teacher discovers he has a rare form of lung cancer, he decides to team up with a former student and create a top of the line crystal meth in a used RV, to provide for his family once he is gone.',
                },
                { 
                    img:  require('../assets/img/episode/3.jpg'),
                    epNum: '3',
                    name: 'Pilot',
                    date: "...and the Bag's in the River",
                    overview: 'When an unassuming high school chemistry teacher discovers he has a rare form of lung cancer, he decides to team up with a former student and create a top of the line crystal meth in a used RV, to provide for his family once he is gone.',
                },           
                { 
                    img:  require('../assets/img/episode/1.jpg'),
                    epNum: '4',
                    name: 'Cancer Man',
                    date: 'January 19, 2008',
                    overview: 'When an unassuming high school chemistry teacher discovers he has a rare form of lung cancer, he decides to team up with a former student and create a top of the line crystal meth in a used RV, to provide for his family once he is gone.',
                },
                { 
                    img:  require('../assets/img/episode/1.jpg'),
                    epNum: '5',
                    name: 'Gray Matter',
                    date: 'January 19, 2008',
                    overview: 'When an unassuming high school chemistry teacher discovers he has a rare form of lung cancer, he decides to team up with a former student and create a top of the line crystal meth in a used RV, to provide for his family once he is gone.',
                },  
            ],
            
             
        }
    },
    methods: {
        showMore() {
            this.showLess = !this.showLess
            if (this.showLess) {
                this.buttonTitle = 'show more'
            } else {
                this.buttonTitle = 'show less'
            }
        }
    },
}
</script>


<style lang='scss' scoped>
@import '../assets/scss/_variables';
@import '../assets/scss/singlePage/_overview';
@import '../assets/scss/singlePage/_cast';
@import '../assets/scss/singlePage/_seasons';
@import '../assets/scss/_itemList';





</style>
