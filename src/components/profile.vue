<template><div id="profile">
    <v-app>
        <app-menu></app-menu>
        <app-submenu></app-submenu>
        
        <main class="container">

            <header class="profile_header">
                <h1 class="user_name">{{user.name }}</h1>
                <v-btn v-if="user.login" class=" font-weight-bold" color="primary" flat round @click="logout" exact>Log out</v-btn>
            </header>

            <section class="item_container" >
                <h3 v-if="user.movies.mark.length" class="favorite_title">Bookmark Movies ({{user.movies.mark.length }})</h3>
                 
                <div class="item_wrapper">
                    <div class="item" v-for="(film, index) in user.movies.mark" :key="index">
                        
                        <router-link :to="{ name: 'singleMovie', params: { id: film.iId } }"> 

                            <figure class="item_content animated" >
                                <img class="item_img" v-bind:src="film.poster" alt="">
                                <figcaption class="item_hover">
                                    <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                                </figcaption>           
                            </figure>

                        </router-link>

                        <div class="item_info">
                            <div class="item_rate">{{film.rate}}%</div>
                            <v-btn icon ripple>
                                <v-icon @click.prevent="deleteMovie(film.id)">close</v-icon>
                            </v-btn>
                        </div>
                        <h1 class="item_name"> {{film.title}} </h1>
                        <span class="item_year">{{film.year}}</span>
                    </div>
                </div> 
            </section>

            <section class="item_container" >
                <h3 v-if="user.shows.mark.length" class="favorite_title">Bookmark TV Shows ({{user.shows.mark.length }})</h3>
                <div class="item_wrapper">
                    <div class="item" v-for="(film, index) in user.shows.mark" :key="index">
                        
                        <router-link :to="{ name: 'singleShow', params: { id: film.iId } }"> 

                            <figure class="item_content animated" >
                                <img class="item_img" v-bind:src="film.poster" alt="">
                                <figcaption class="item_hover">
                                    <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                                </figcaption>           
                            </figure>

                        </router-link>
                        <div class="item_info">
                            <div class="item_rate">{{film.rate}}%</div>
                            <v-btn icon ripple>
                                <v-icon @click.prevent="deleteShow(film.id)">close</v-icon>
                            </v-btn>
                        </div>
                        <h1 class="item_name"> {{film.title}} </h1>
                        <span class="item_year">{{film.year}}</span>
                    </div>
                </div> 
            </section>
        </main>
    </v-app>
    <app-footer></app-footer>
</div></template>

<script>
import menu from '../components/parts/menu.vue';
import subMenu from '../components/parts/subMenu.vue';
import footer from '../components/parts/footer.vue';
import axios from 'axios';
import db from '@/firebase/init'
import firebase from 'firebase'
import { mapState, mapMutations } from 'vuex';



export default {
    components: {
        'app-menu': menu,
        'app-submenu': subMenu,
        'app-footer': footer,
    },


    name: 'profile',
    data () {
        return {
            // wide layout
            isFull: true,
            // current user data
            user: {
                login: null,
                id: null,
                name: "",
                movies: {
                    mark: [],
                    rate: [],
                },
                shows: {
                    mark: [],
                    rate: [],
                },
            },
        }
    },
    created(){

        // get current user from firebase
        this.getCurrentUser()
        // get user data from firebase
        this.getUserData()

        
    },
    computed: {
        //get data from store
        ...mapState([
            'URL',
            'holder',
            'detail',
        ]),
    },

    methods: {
        ...mapMutations([
        
        ]),
        // get current user from firebase
        getCurrentUser(){
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    this.user.login = user
                } else {
                    this.user.login = null
                }
            })
        },
        // get user data from firebase
        getUserData(){
            db.collection('users').where('user_id', '==', firebase.auth().currentUser.uid).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    // id of current user
                    this.user.id = doc.id
                    // get username from database
                    db.collection('users').doc(this.user.id).get()
                        .then(user => {
                            this.user.name = user.data().alias  
                        }) 
                
                    //get marked movies of current user from database 
                    db.collection('movies_marked').where('user', '==', this.user.id).get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            let record = doc.data()
                            record.id = doc.id
                            this.user.movies.mark.push(record)
                        })
                    })  

                    //get marked shows of current user from database 
                    db.collection('shows_marked').where('user', '==', this.user.id).get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            let record = doc.data()
                            record.id = doc.id
                            this.user.shows.mark.push(record)
                        })
                    })  
                })
            })
        },
        // logout current user redirect to login page
        logout(){
            firebase.auth().signOut().then(() => {
                this.$router.push({ name: 'login'})
            })
        },
        
        // remove movie from watchlist
        deleteMovie(id){
            db.collection('movies_marked').doc(id).delete().then(()=> {
                    this.user.movies.mark = this.user.movies.mark.filter(item =>{
                    return item.id != id
                })
            })
        },
        // remove show from watchlist
        deleteShow(id){
            db.collection('shows_marked').doc(id).delete().then(()=> {
                    this.user.shows.mark = this.user.shows.mark.filter(item =>{
                    return item.id != id
                })
            })
        },
    }


}
</script>

<style lang='scss' scoped>
@import '../assets/scss/_variables';
@import '../assets/scss/parts/_general';
@import '../assets/scss/parts/_itemList';

.container {
    max-width: $width;
    display: flex;
    flex-direction: column;
}

.profile_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
}

.item {
    width: 160px; //160
    &_wrapper {
        display: flex;
        padding: 25px 0 ;
        max-width: $width; 
        margin: 0 auto;
        flex-wrap: nowrap;
        overflow-x: auto;
        justify-content: flex-start;  
        text-align: left

    }
    &_info {
        padding: 5px 0 5px 9px
    }
}


//--desktop--//
@media screen and (min-width: 1200px) {
    .item_wrapper {
       // justify-content: center;
        flex-wrap: wrap;
    }
}


</style>
