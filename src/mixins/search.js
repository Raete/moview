// API database
import axios from 'axios';

export const search = {
    methods: {

        // creating list of item titles in autocomplete input 
        // --------------------------------------------------
        // searchTerm: searching term
        // type: movie or tv
        // used in movies and shows component
        titleList(searchTerm, type) {
            this.searchInput.loading = true
            axios.get(`${this.URL.database}search/${type}${this.URL.apiKey}&query=${searchTerm}`)
            .then(res => {
                let titles = res.data.results
                titles.forEach((movie)=> {
                
                    if(movie.name) {
                        this.searchInput.names.push(movie.name)
                    } else this.searchInput.names.push(movie.title)
                    
                })
                this.searchInput.items = this.searchInput.names.filter(e => {
                    return (e || '').toLowerCase().indexOf((searchTerm || '').toLowerCase()) > -1
                })
                this.searchInput.loading = false
            }) 
        },
        // create list of years 
        getYearsList() {
            // set year 1900
            let first = "1900"
            // set current year
            let current = new Date().getFullYear() + 2
            // push list of year to movies.years
            for (var i = first; i <= current; i++) this.items.years.push(i);
            // sorting years array first is "none" then current year - 1900
            if (this.items.years) {
                this.items.years = this.items.years.slice(0, 1)
                .concat(this.items.years = this.items.years.slice(1, this.items.years.length).reverse())
            }
        },

        getGenresList(type) {
            axios.get(`${this.URL.database}genre/${type}/list${this.URL.apiKey}`)
            .then(res => {
                // genres data
                let genres = res.data.genres
                // push data to array
                genres.forEach((genre)=> {
                    this.items.genres.push(genre) 
                })
            }) 
        },
    }
}

