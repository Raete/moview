import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        // base url 
        URL: { 
            img: "https://image.tmdb.org/t/p/w500" ,
            database: "https://api.themoviedb.org/3/",
            apiKey: "",
            face: "https://image.tmdb.org/t/p/w235_and_h235_face",
            actor: "https://image.tmdb.org/t/p/original"
        },
        // img holders
        holder: {
            photo: require('../assets/img/holders/photo.svg'),
            person: require('../assets/img/holders/person.svg'),
            episode: require('../assets/img/holders/episode.svg'),
            detail: require('../assets/img/holders/detail.svg'),
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
            recomend: [],
            video: [],
            episodes: [],
            seriesNum: [],

            random: [],
        },

        // trailer and full overview
        box: {
            overview: false,
            video: false,
            rate: false,
        },
        // if item exist
        is: {
            recomend: false,
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
            movieCredits: [],
            showCredits: [],
            movieKnown: [],
        },
        // alert messages
        alert: {
            active: false,
            type: "error",
            text: ""
        },
        // current user data
        user: {
            id: null,
            movies: {
                mark: [],
                rate: [],
                curRate: "",
                userRate: null
                
            },
            shows: {
                mark: [],
                rate: [],
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

        // create list of years 
        getYearsList(state) {
            // set year 1900
            let first = "1900"
            // set current year
            let current = new Date().getFullYear() + 2
            // push list of year to movies.years
            for (var i = first; i <= current; i++) state.items.years.push(i);
            // sorting years array first is "none" then current year - 1900
            if (state.items.years) {
                state.items.years = state.items.years.slice(0, 1)
                .concat(state.items.years = state.items.years.slice(1, state.items.years.length).reverse())
            }
        },

        scrollToTop(state, scrollDuration) {
            let scrollStep = -window.scrollY / (scrollDuration / 15),
                scrollInterval = setInterval(function(){
                if ( window.scrollY != 0 ) {
                    window.scrollBy( 0, scrollStep );
                }
                else clearInterval(scrollInterval); 
            },15)
        },

        topBackground(state){
            if (window.innerWidth > 800) {
                return state.detail.data.backdrop_path
            } else return ""
        },

        infoAlert(state, payload){
            state.alert.active = true
            state.alert.text = payload
            setTimeout(() => {
                state.alert.active = false
            }, 1500)
        },
    },
})