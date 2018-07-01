<template><div>

    <main class="main" v-bind:style="{ 
            backgroundImage: 'url(' + background + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }"   >
        <img class="poster" src="../assets/img/posters/martan.jpg" alt="">
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
                <span class="info_rate">76%</span>
                <div class="info_name">
                    <h1 class="info_title">The Martian</h1>
                    <span class="info_year">(2015)</span>
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
    <section></section>
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
@import '../assets/scss/_itemList';



</style>
