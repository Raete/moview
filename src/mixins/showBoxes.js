const recommend = {
    methods: {
       showSimilar(){
            this.show.similar = true,
            this.show.recommend = false,
            this.show.seasons = false
        },
        showRecommend(){
            this.show.similar = false,
            this.show.recommend = true,
            this.show.seasons = false
        },
        

    }
}

const seasons = {
    methods: {
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

