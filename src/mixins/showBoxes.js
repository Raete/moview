const recommend = {
    // SHOW BOXES
    // used in movie and tv show details

    methods: {
        // show similar items
        showSimilar(){
            this.show.similar = true,
            this.show.recommend = false,
            this.show.seasons = false
        },

        // show recommend items
        showRecommend(){
            this.show.similar = false,
            this.show.recommend = true,
            this.show.seasons = false
        },
    }
}

const seasons = {
    // SHOW BOXES
    // used in tv show details

    methods: {
        // show seasons and episodes
        showSeasons(){
            this.show.similar = false,
            this.show.recommend = false,
            this.show.seasons = true
        }, 
    }
}

export {
    recommend,
    seasons
}

