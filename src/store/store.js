import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        URL: { 
            img: "https://image.tmdb.org/t/p/w500" ,
            database: "https://api.themoviedb.org/3/",
            apiKey: "?api_key=0729eb044b5e37b6c0ff52a4c8617f94",
        },
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
        },
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
            movies: true
        },
        actor: {
            data: [],
            img: "",
            movieCredits: [],
            showCredits: [],
            movieKnown: [],
        },

    },
    mutations: {

        // create list of years 
        getYearsList(state) {
            // set year 1900
            let first = "1900"
            // set current year
            let current = new Date().getFullYear()
            // push list of year to movies.years
            for (var i = first; i <= current; i++) state.items.years.push(i);
            // sorting years array first is "none" then current year - 1900
            if (state.items.years) {
                state.items.years = state.items.years.slice(0, 1)
                .concat(state.items.years = state.items.years.slice(1, state.items.years.length).reverse())
            }
        },

    },
})