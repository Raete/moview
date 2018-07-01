<template><div>

    <main class="main"  >
        <img class="poster" src="../assets/img/people/e.jpg" alt="">
        <div class="main_container">
            <router-link :to="{ name: 'home' }"> 
                <div class="back_btn">
                    <i class="material-icons">
                        keyboard_backspace
                    </i>
                    homepage
                </div>
            </router-link>
            <img class="cast_img" src="../assets/img/people/e1.jpg" alt="">
            <section class="info_wrapper">
                <h1 class="info_name">Chris Pratt</h1>

                <div class="info_overview_wrapper">
                    <h1 class="info_overview_title">Biography</h1>
                    <p class="info_overview_text">Christopher Michael "Chris" Pratt (born June 21, 1979) is an American actor, best known for his roles as Harold Brighton "Bright" Abbott in the television series Everwood, the recurring character Winchester "Ché" Cook in season 4 of The OC, and Andy Dwyer in the television series Parks and Recreation.</p>
                </div>
            </section>
        </div>

    </main>
    <section class="item_container">
        <h1 class="recommend">Known for</h1> 
        <app-tips></app-tips>
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
                    <router-link :to="{ name: 'singleMovie' }"> 
                    <li class="acting_item" v-for="(role, index) in filmRoles" :key="index">
                        <div class="acting_info">
                            <p class="acting_year">{{role.year}}</p>
                            <div class="acting_film">
                                <h3 class="acting_name">{{role.name}}</h3>
                                <p class="acting_role">{{role.role}}</p>
                            </div>
                        </div>
                        <p class="acting_rate">{{role.rate}}</p>
                    </li>
                    </router-link>
                </ul>

            </v-tab-item>
            <v-tab-item class="tab_item" id="tvShows">
       
                <ul class="acting_list">
                    <router-link :to="{ name: 'singleShow' }"> 
                    <li class="acting_item" v-for="(role, index) in showRoles" :key="index">
                        <div class="acting_info">
                            <p class="acting_year">{{role.year}}</p>
                            <div class="acting_film">
                                <h3 class="acting_name">{{role.name}}  
                                    <small>- ({{role.ep}} episodes)</small>
                                </h3>
                                <p class="acting_role">{{role.role}}</p>
                            </div>
                        </div>
                        <p class="acting_rate">{{role.rate}}</p>
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


export default {
    components: {
        'app-footer': footer,
        'app-tips': tips,
    },

    data () {
        return {
            showLess: true,
            buttonTitle: "show more",
            background: require('../assets/img/homeBack.jpg'),
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
            filmRoles: [
                { 
                    year: 2021,
                    name: 'Jurassic World 3',
                    role: 'Owen Grady',
                    rate: '50%',
                },
                { 
                    year: 2019,
                    name: 'Cowboy Ninja Viking',
                    role: 'Duncan / Cowboy-Ninja-Viking',
                    rate: '--%',
                },
                { 
                    year: 2019,
                    name: 'Untitled Avengers Movie',
                    role: 'Peter Quill / Star-Lord',
                    rate: '89%',
                },           
                { 
                    year: 2019,
                    name: 'The Lego Movie 2: The Second Part',
                    role: 'Emmet Brickowski (voice)',
                    rate: '40%',
                },
                     
            ],
            showRoles: [
                { 
                    year: 2016,
                    name: 'Chelsea',
                    role: 'Himself',
                    ep: 2,
                    rate: '58%',
                },
                { 
                    year: 2016,
                    name: 'Chelsea',
                    role: 'Himself',
                    ep: 2,
                    rate: '58%',
                },
                { 
                    year: 2016,
                    name: 'Chelsea',
                    role: 'Himself',
                    ep: 2,
                    rate: '58%',
                },           
                { 
                    year: 2016,
                    name: 'Chelsea',
                    role: 'Himself',
                    ep: 2,
                    rate: '58%',
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
@import '../assets/scss/_itemList';

@import '../assets/scss/actors/_singleActor';



</style>
