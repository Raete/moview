<template><div class="login">
    <v-app>
        <main class="main_container">
            <div class="menu">
                <div class="menu_wrapper">
                    <!-- logo -->
                    <router-link  :to="{ name: 'movies' }" exact> 
                        <img src="@/assets/img/svg/logo.svg" alt="moview" class="menu_logo"> 
                    </router-link>
                </div>
            </div>
    
            <section class="container_wrapper">
                <transition name="scale" tag="div">    
                    <!-- login form-->
                    <div key="1" class="log_form" v-if="logIn">
                        <v-form class="log_form_wrap" @submit.prevent="login">
                            <h1 class="log_form_name">Login</h1>
                            <v-text-field
                                v-model="email"
                                label="Email"
                                solo
                                flat
                                required
                                background-color="back_3"
                                :type="'email'"
                            ></v-text-field>
                            <v-text-field
                                v-model="password"
                                :type="'password'"
                                label="Password"
                                solo
                                flat
                                required
                                background-color="back_3"
                            ></v-text-field>
                            <v-btn round large block class="claim_btn" color="primary" @click.prevent="login" exact> Login </v-btn>
                            <p class="info_text">New to Moview? <span v-on:click="showSignUp">Sign up now</span></p>
                            <p v-if="feedback" class="feedback">{{ feedback }}</p>
                        </v-form>
                        <!-- google login --> 
                        <section class="claim_wrapper">
                            <a class="google_btn" @click.prevent="googleLog" exact> 
                                <img class="google_btn_icon" src="@/assets/img/svg/google.svg" alt=""> 
                                <span class="google_btn_text"> log in with google</span>   
                            </a>
                        </section>                  
                    </div><!-- END login form -->
                    <!-- sing up form -->
                    <div key="2" class="log_form" v-if="singUp">
                        <v-form class="log_form_wrap" >
                            <h1 class="log_form_name">Sign up</h1>
                            <v-text-field
                                v-model="alias"
                                label="Username"
                                solo
                                flat
                                required
                                background-color="back_3"
                            :type="'text'"
                            ></v-text-field>
                            <v-text-field
                                v-model="email"
                                label="Email"
                                solo
                                flat
                                required
                                background-color="back_3"
                                :type="'email'"
                            ></v-text-field>
                            <v-text-field
                                v-model="password"
                                :type="'password'"
                                label="Password"
                                solo
                                flat
                                required
                                background-color="back_3"
                            ></v-text-field>
                            <v-btn  round large block class="claim_btn" color="primary" @click.prevent="signup" exact> Sign up </v-btn>
                            <p class="info_text" >Already have an account?<span v-on:click="showLogIn">Log In</span></p>
                            <p v-if="feedback" class="feedback">{{ feedback }}</p>
                        </v-form>
                        <!-- google login -->  
                        <section class="claim_wrapper">
                            <!-- <a class="google_btn" @click.prevent="googleLog" exact> 
                                <img class="google_btn_icon" src="@/assets/img/svg/google.svg" alt=""> 
                                <span class="google_btn_text"> log in with google</span>   
                            </a> -->
                            <a :href="routeData"  class="web">auth</a>
                            
                           
                        </section>    
                        
                    </div><!-- END sing up form-->  
                </transition>
                    
            </section>
            <footer class="app_footer">
                <div class="app_footer_wrapper">
                    <a href="http://www.janakoudelkova.cz" target="_blank" class="web">created by Jana Koudelková</a>
                    <a href="https://www.themoviedb.org" target="_blank" class="web">Film data provided by TMDb.</a>
                </div>
            </footer>
        </main>
    </v-app>
</div></template>

<script>
//components
import footer from '../components/parts/footer.vue'
//firebase
import db from '@/firebase/init'
import firebase from 'firebase/app'
// slug from username
import slugify from 'slugify'

// API database
import axios from 'axios';
// vuex -- store
import { mapState } from 'vuex';


export default {
    name: 'Login',
    components: {
        'app-footer': footer,
    },
    data () {
        return {
            // form
            singUp: false,
            logIn: true,
            feedback: null,
            // user
            user: null,
            alias: null,
            email: null,
            password: null,
            slug: null,
            routeData: ""

        }
    },

    computed: {
        //get data from store (vuex)
        ...mapState([
            'URL',
            'holder',
            'items',
            'page',
            'totalPages',
            'is',
            'alert',
            'btn',
            'user',
            'show',
        ]),
    },

    methods: {

        init(){
            this.alias = "",
            this.password = "",
            this.email = "",
            this.feedback = ""
        },

        showSignUp(){
            this.singUp = true,
            this.logIn = false,
            this.init()
        },

        showLogIn(){
            this.singUp = false,
            this.logIn = true,
            this.init()
        },

        signup(){
            // if all fields are filled
            if (this.alias && this.email && this.password) {
                this.feedback = null
                this.slug = slugify(this.alias, {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g,
                    lower: true
                })
           
                db.collection('users').doc(this.slug).get().then(doc => {
                    // if username exist then:
                    if (doc.exists) {
                        this.feedback = 'This alias already exists'
                    } else {
                        // this alias does not yet exists in the db
                        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                        .then(cred=> {
                            
                            // set data about user
                            db.collection('users').doc(this.slug).set({
                                alias: this.alias,
                                email: this.email,
                                password: this.password,
                                user_id: cred.user.uid,
                                date: Date.now()
                            })
                        }).then(() => {
                            // after sing up go to profile page
                            db.collection('users').doc(this.slug).get()
                            .then(doc => {
                                this.$router.push({ name: 'profile', params: { id: doc.id }})
                            })
                        })
                        .catch(err => {
                            this.feedback = err.message
                        })
                    }
                })
            } else {
            this.feedback = 'Please fill in all fields'
            }
        },

        login(){
            // if all fields are filled
            if (this.email && this.password) {
                this.feedback = null
                firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then(cred => {
                    // find user in database, login and go to profile page
                    db.collection('users').where('user_id', '==', firebase.auth().currentUser.uid).get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            this.$router.push({ name: 'profile', params: { id: doc.id }})
                        })
                    })
                })
                .catch(err => {
                    this.feedback = err.message
                })
            } else {
                this.feedback = 'Please fill in all fields'
            }
        },

        googleLog() {
            let provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider).then(result => {
                
           // set data about user
                db.collection('users').doc(result.user.email).set({
                    alias: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                    user_id: result.user.uid,
                    date: result.user.metadata.creationTime,
                })

                // after sing up go to profile page
                db.collection('users').doc(result.user.email).get()
                .then(doc => {
                  
                    this.$router.push({ name: 'profile'})
                })
            // ...
            })
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
        }
    }
}
 </script>


<style lang='scss' scoped>
    @import '../assets/scss/_variables';
    @import '../assets/scss/pages/_login';

    
    

</style>
