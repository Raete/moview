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
            movie: require('../assets/img/holders/image.svg'),
        },

        movies: {
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
            tags: true,
            episode: true,
        },
        button: {
            showLessCast: true,
            showLessCrew: true,
            titleCast: "show more cast",
            titleCrew: "show more crew",
            isCrew: false,
            isCast: false,
        },
        actor: {
            data: [],
            img: "",
            movieCredits: [],
            showCredits: [],
            movieKnown: [],
        },

    }
})