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
                            background-color="background"
                            :type="'email'"
                            ></v-text-field>
                            <v-text-field
                            v-model="password"
                            :type="'password'"
                            label="Password"
                            solo
                            flat
                            required
                            background-color="background"
                            ></v-text-field>
                            <v-btn round large block class="claim_btn" color="primary" @click.prevent="login" exact> Login </v-btn>
                            <p class="info_text">New to Moview? <span v-on:click="showSignUp">Sign up now</span></p>
                            <p class="info_text info_text--pass">Lost your password?<br> Bad, I don't have it.</p>
                            <p v-if="feedback" class="feedback">{{ feedback }}</p>
                        </v-form>
                        <section class="claim_wrapper">
                            <h1 class="claim font-weight-black">discover <br>new stories</h1>
                            <v-btn  round class="claim_btn" color="primary" :to="{ name: 'movies' }" exact> start now </v-btn>
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
                            background-color="background"
                            :type="'text'"
                            ></v-text-field>
                            <v-text-field
                            v-model="email"
                            label="Email"
                            solo
                            flat
                            required
                            background-color="background"
                            :type="'email'"
                            ></v-text-field>
                            <v-text-field
                            v-model="password"
                            :type="'password'"
                            label="Password"
                            solo
                            flat
                            required
                            background-color="background"
                            ></v-text-field>
                            <v-btn  round large block class="claim_btn" color="primary" @click.prevent="signup" exact> Sign up </v-btn>
                            <p class="info_text" >Already have an account?<span v-on:click="showLogIn">Log In</span></p>
                            <p v-if="feedback" class="feedback">{{ feedback }}</p>
                        </v-form>
                        <section class="claim_wrapper">
                            <h1 class="claim font-weight-black"> collect your <br> favorite stories </h1>
                            <v-btn  round class="claim_btn" color="primary" :to="{ name: 'movies' }" exact> start now </v-btn>
                        </section>   
                    </div><!-- END sing up form-->  
                </transition>
                    
            </section>
            <footer class="app_footer">
                <div class="app_footer_wrapper">
                    <a href="http://www.janakoudelkova.cz" target="_blanck" class="web">created by Jana Koudelková</a>
                    <a href="https://www.themoviedb.org" target="_blanck" class="web">Film data provided by TMDb.</a>
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
        }
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
    }
}
 </script>


<style lang='scss' scoped>
    @import '../assets/scss/_variables';

    // transition forms animation   
    .scale-enter-active {
        transition: all .8s ease;
    }

    .scale-leave-active {
        transition: all .1s ease;
    }

    .scale-enter {
        transform:  scale(0.9);
        opacity: 0;
    }

    .scale-leave-to {
        opacity: 0;
    }

    .main_container {
        height: 100vh;
    }
    // menu
    .menu {
        max-width: $width;
            margin: 0 auto;
        &_wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 20px 0 20px;
        }
        &_logo {
            position: relative;
            margin: 0 auto;
            margin-bottom: 20px;
        }
    }

    // -- desktop --
    @media screen and (min-width: 500px) {
        .menu {
            &_wrapper {
                flex-direction: row;
                justify-content: space-between;
                align-items: center
            }
        }
    }

    .claim_wrapper {
        background: $color_main;
        border-radius: 0 0 $radius $radius;
        text-align: center;
        padding: 30px 0;
        width: 95%;
        margin: 0 auto;
        .claim {
            font-size: 200%;
            line-height: 100%;
            margin-bottom: 20px;
        }
    }

    .info_text {
        font-size: 120%;
        padding: 20px 5px 0 5px;
        &--pass {
            color: darken( $color-bg--light, 40% )
        }
        span {
            font-weight: 700;
            text-transform: uppercase;
            padding: 0 5px;
            cursor: pointer;
        }
    }
    // form
    .log_form {
        display: flex;
        flex-direction: column;
        &_wrap {
            background: $color-bg--light;
            padding: 40px 20px;
            border-radius: $radius ;
            box-shadow: 0 10px 28px 0 rgba($color_text, 0.1);
        }
        &_name {
            font-size: 150%;
            margin-bottom: 30px;
            text-align: center
        }
    }
    // -- desktop --
    @media screen and (min-width: 500px) {
        .container_wrapper {
        margin-top: 8%;
        }
        .log_form_wrap {
            margin: 0 auto;
            width: 350px
        }
        .claim_wrapper {
            width: 325px
        }
    }

    @media screen and (min-width: 600px) {
        .log_form {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            &_wrap {
                margin: 0;
                order: 2;
            } 
        }

        .claim_wrapper {
            order: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: $radius 0 0 $radius;
            text-align: center;
            padding: 30px 0;
            height: 450px;
            margin: 0;
        }
    }

    @media screen and (min-width: 650px) {

        .claim_wrapper {
            font-size: 180%;
        }

    }

    .feedback {
        padding: 5px;
        color: red;
        text-align: right
    }

    ///*** FOOTER ***///
    .app_footer {
        background: $color_bg--darken;
        position: relative;
        bottom: 0;
        width: 100%;
        &_wrapper {
            display: flex;
            justify-content: space-between;
            max-width: $width; 
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
    }
    // -- desktop --
    @media screen and (min-width: 650px) {

        .app_footer {
        position: absolute;
        }

    }

</style>
