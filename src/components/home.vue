<template><div>
    <v-app class="index">
        <app-header></app-header>
        <!-- filters -->
 
        <section class="filters" >
            <div class="filters_wrapper">
                <div class="filters_search">
                    <!-- <v-text-field v-model="search" prepend-icon="search" label="search"></v-text-field> -->

                    <v-autocomplete
                        :loading="loading"
                        :items="items"
                        :search-input.sync="search"
                        v-model="select"
                        cache-items
                        flat
                        hide-no-data
                        hide-details
                        clearable
                        prepend-icon="search"
                        label="Search"

                   
                    ></v-autocomplete>
                </div>
            </div>
            
            
        </section>
         <!-- film list wrapper -->    
        <section class="item_container">
            <div class="item_wrapper">
                <div class="item" v-for="(film, index) in queryItems" :key="index">
                 <router-link :to="{ name: 'singleMovie' }"> 
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
        
        <div class="pages">
            <div class="pages_wrapper">
                <button class="pages_btn pages_btn--prev" v-show="this.curPage > 1" @click="prev">prev</button>
                <p class="pages_total"> Currently on page: {{this.curPage}} of {{this.totalPages}}</p>
                <button class="pages_btn pages_btn--next" v-show="this.curPage < this.totalPages" @click="next">next</button>
            </div>
        </div>
        
    </v-app>
    <app-footer></app-footer>

</div></template>

<script>
import header from '../components/header.vue';
import footer from '../components/footer.vue';
import axios from 'axios';

export default {
    components: {
        'app-header': header,
        'app-footer': footer,
    },
    name: 'home',
    data () {
        return {
           // search: "",
            queryItems: [],
            posters:[],

            loading: false,
            items: [],
            search: "",
            select: "",
            states: [],
           
            URL: { 
                holder: require('../assets/img/posters/empty.jpg'),
                img: "https://image.tmdb.org/t/p/w500" ,
                database: "https://api.themoviedb.org/3/",
                apiKey: "?api_key=0729eb044b5e37b6c0ff52a4c8617f94",
                query: ""
            },
            select: {
                items: [],
                year: null,
                sort: null,
            },
            topRated: [],
            totalPages: null,
            curPage: 1,

            films: [],
 
        }
    },

    mounted(){

     
    },
  watch: {

    search (val) {
        val && val !== this.select && this.querySelections(val)
      console.log(this.select)
 
      },

      queryItems() {
          this.test(this.select)
          if(this.select == null) {
              this.select = "a"
          }
          console.log(this.queryItems)
      }

    
  },


  

    methods: {
        prev(){
            // this.curPage--
            // axios.get(`${this.URL.database}search/movie${this.URL.apiKey}&page=${this.curPage}&query=${this.URL.query}`).then(res => {
            //     this.queryItems = res.data.results

            //     const URL = "https://image.tmdb.org/t/p/w500"
            //     this.queryItems = res.data.results

            //     this.queryItems.forEach((poster)=>{
            //         if (poster.poster_path) {
            //             poster.poster_path = URL + poster.poster_path
                       
            //         } else if (poster.poster_path == null) {
            //             poster.poster_path = this.URL.holder
            //         }
            //     })
            // }) 
   
        },

        next(){
            // this.curPage++
            // axios.get(`${this.URL.database}search/movie${this.URL.apiKey}&page=${this.curPage}&query=${this.URL.query}`).then(res => {
            //     this.queryItems = res.data.results

            //     const URL = "https://image.tmdb.org/t/p/w500"
            //     this.queryItems = res.data.results

            //     this.queryItems.forEach((poster)=>{
            //         if (poster.poster_path) {
            //             poster.poster_path = URL + poster.poster_path
                       
            //         } else if (poster.poster_path == null) {
            //             poster.poster_path = this.URL.holder
            //         }
            //     })
            // }) 
      
        },

        querySelections (searchTerm) {
            this.loading = true

            axios.get(`${this.URL.database}search/movie${this.URL.apiKey}&query=${searchTerm}`)
            .then(res => {
            const URL = "https://image.tmdb.org/t/p/w500"
                this.totalPages = res.data.total_pages
               this.queryItems = res.data.results



                this.queryItems.forEach((poster)=>{
                    this.states.push(poster.name)

                    if (poster.poster_path) {
                        poster.poster_path = URL + poster.poster_path
                       
                    } else if (poster.poster_path == null) {
                        poster.poster_path = this.URL.holder
                    }
                    
                })
    
       
                this.items = this.states.filter(e => {
                    return (e || '').toLowerCase().indexOf((searchTerm || '').toLowerCase()) > -1
                })
                this.loading = false
                
            }) 
          
        },

        test (searchTerm) {
            this.loading = true

            axios.get(`${this.URL.database}search/movie${this.URL.apiKey}&query=${searchTerm}`)
            .then(res => {
            const URL = "https://image.tmdb.org/t/p/w500"
                this.totalPages = res.data.total_pages
               this.queryItems = res.data.results



                this.queryItems.forEach((poster)=>{
                    this.states.push(poster.name)

                    if (poster.poster_path) {
                        poster.poster_path = URL + poster.poster_path
                       
                    } else if (poster.poster_path == null) {
                        poster.poster_path = this.URL.holder
                    }
                    
                })
                
            }) 
            this.loading = false
          
        },

        // searchMovie(searchTerm) {
        //     // render search
        //     axios.get(`${this.URL.database}search/multi${this.URL.apiKey}&query=${searchTerm}`)
        //     .then(res => {
        
        //         this.totalPages = res.data.total_pages
        //         this.queryItems = res.data.results
     
        //     }) 
        // },

        URLimg() {
            // render search
            axios.get(`${this.URL.database}search/movie${this.URL.apiKey}&query=${this.URL.query}`)
            .then(res => {
                const URL = "https://image.tmdb.org/t/p/w500"
                this.queryItems = res.data.results

                this.queryItems.forEach((poster)=>{
                    if (poster.poster_path) {
                        poster.poster_path = URL + poster.poster_path
                       
                    } else if (poster.poster_path == null) {
                        poster.poster_path = this.URL.holder
                    }
                })

            }) 
        },

    },
    
}
</script>


<style lang='scss' scoped>
@import '../assets/scss/_variables';
@import '../assets/scss/_filters';
@import '../assets/scss/_itemList';


.pages {
    background: $color-bg;
    padding: 20px;
    
    &_wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
    }
    &_btn {
        background: darken( $color-bg--light, 40% );
        padding: 10px;
        color: $color-bg;
        transition: .3s;
        &:hover {
            background: $color_text;
        }
        &--prev {
            border-radius:  $radius 0 $radius 0 ;
        }
        &--next {
            border-radius: 0 $radius 0 $radius;
        }

    }
}

.search {

    &_wrapper {
        max-width: $width;
        margin: 0 auto
    }
}





</style>
