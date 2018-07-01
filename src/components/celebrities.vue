<template><div>
    <v-app class="index"> 
        <app-header></app-header>
        <section class="item_container">
            <div class="item_wrapper"><!-- film list -->    
                <div class="item" v-for="(film, index) in films" :key="index">
                    <router-link :to="{ name: 'singleActor' }"> 
                        <figure class="item_content">
                            <img class="item_img" v-bind:src="film.img" alt="">
                            <figcaption class="item_hover">
                                <img class="item_hover_ico" src="../assets/img/svg/plus.svg" alt="">
                            </figcaption>           
                        </figure>
                    </router-link>
                    <h1 class="item_name"> {{film.title}}  </h1>
                </div>
            </div> <!-- END film list wrapper -->
        </section>
    </v-app>
    <app-footer></app-footer>

</div></template>

<script>
import header from '../components/header.vue';
import footer from '../components/footer.vue';

export default {
    components: {
        'app-header': header,
        'app-footer': footer,
    },
    name: 'home',
    data () {
        return {
            genres: [
                { name: 'action' },
                { name: 'adventure'},
                { name: 'animation'},
                { name: 'comedy'},
                { name: 'crime'},
                { name: 'documentary'},
                { name: 'drama'},
                { name: 'family'},
                { name: 'fantasy'},
                { name: 'history'},
                { name: 'horror'},
            ],
            years: [
               '2018','2017','2016','2015','2014', 
            ],
            sort: [
               'Popular','Top Rated','Upcomming','Now Playing'
            ],
            films: [
                { 
                    img: require('../assets/img/people/a.jpg'),
                    title: 'Henry Cavill',
                },
                { 
                    img: require('../assets/img/people/b.jpg'), 
                    title: 'Natalie Portman',
                },
                { 
                    img: require('../assets/img/people/c.jpg'), 
                    title: 'Rose Byrne',
                },           
                { 
                    img: require('../assets/img/people/d.jpg'),  
                    title: 'Chris Hemsworth',
                },
                { 
                    img: require('../assets/img/people/e.jpg'),  
                    title: 'Chris Pratt',
                },
                { 
                    img: require('../assets/img/people/f.jpg'),  
                    title: 'Bryce Dallas Howard',
                },
                     
            ],
            
        }
    }
}
</script>


<style lang='scss'>
@import '../assets/scss/_variables';
@import '../assets/scss/_itemList';



</style>
