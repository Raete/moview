import Vue from 'vue';
import Vuex from 'vuex';
// API database
import axios from 'axios';
// firebase
import db from '@/firebase/init'
import firebase from 'firebase/app'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // base url 
        URL: { 
            img: "https://image.tmdb.org/t/p/w500" ,
            database: "https://api.themoviedb.org/3/",
            apiKey: "",
            face: "https://image.tmdb.org/t/p/w235_and_h235_face",
            poster: "https://image.tmdb.org/t/p/original",
            video: "https://www.youtube.com/embed/"
        },
        // img holders
        holder: {
            photo: require('./assets/img/holders/photo.svg'),
            person: require('./assets/img/holders/person.svg'),
            episode: require('./assets/img/holders/episode.svg'),
            detail: require('./assets/img/holders/detail.svg'),
        },

        items: {
            discover: [],
            search: [],
            years: ["All"],
            genres: [],
        },

        //pages
        page:{
            curSearch: 1,
            cur: 1,
        },

        totalPages: {
            search: null,
            discover: null,
        },
        // single pages
        detail: {
            data: [],
            credits: {
                cast: [],
                crew: [],
            },
            recommend: [],
            similar: [],
            video: [],
            episodes: [],
            seriesNum: [],
        },

        // trailer and full overview
        box: {
            overview: false,
            video: false,
            rate: false,
        },
        // show elements
        show: {
            recommend: false,
            similar: false,
            seasons: true,
            backToTop: true,
        },
        // if item exist
        is: {
            recommend: false,
            similar: true,
            seasons: true,
            video: true,
            long: true,
            cast: true,
            crew: true,
            credits: true,
            tags: true,
            episode: true,
            shows: false,
            movies: true,
            acting: true,
            favorite: false,
            book: false
        },
        // actors data
        actor: {
            data: [],
            img: "",
            cast: [],
            crew: [],
            roles: [], 
        },
        // alert messages
        alert: {
            active: false,
            type: "error",
            text: ""
        },
        // current user data
        user: {
            login: null,
            id: null,
            name: "",
            date: "",
            photo: "",
            items: [],
            rated: {
                all: [],
                movies: [],
                shows: [],
            },
            watchlist: {
                all: [],
                movies: [],
                shows: [],
            },
            seen: {
                all: [],
                movies: [],
                shows: [],
            },
            movies: {
                mark: [],
                rate: [],
                seen: [],
                curRate: "",
            },
            shows: {
                mark: [],
                rate: [],
                seen: [],
                curRate: ""
            },
        },
        rating: [
            '0%',
            '10%',
            '20%',
            '30%',
            '40%',
            '50%',
            '60%',
            '70%',
            '80%',
            '90%',
            '100%',
        ]


    },
    mutations: {

    },

    actions: {

    }
})