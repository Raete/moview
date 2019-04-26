const moviesData = {
    methods: {
        // if is no poster image replace with holder
        poster(){
            if (this.detail.data.poster_path) {
                this.detail.data.poster_path = this.URL.poster + this.detail.data.poster_path
            } else if (this.detail.data.poster_path == null) {
                this.detail.data.poster_path = this.holder.detail
            }
        },

        // if is no profile image in cast replace with holder in items list
        posters(arr){
            arr.forEach((poster)=> {
                if (poster.poster_path) {
                    poster.poster_path = this.URL.img + poster.poster_path
                } else if (poster.poster_path == null) {
                    poster.poster_path = this.holder.photo
                }
            })
        },

        // slice overview -- show all overview button
        overview(){
            if (this.detail.data.overview.length > 350) {
                this.is.long = true
                this.detail.data.short = this.detail.data.overview.slice(0,300) + "..."
            } else { 
                this.detail.data.short = this.detail.data.overview
                this.is.long = false
            }
        },

        // get directors
        getDirectors(arr){
            arr.forEach(crew=>{
                   
                if (crew.department == "Directing") {
                    this.directors.push(crew)
                }
      
            })
        },

        // get just year from release date
        getYear(){
            if(this.detail.data.release_date ) {
                this.detail.data.release_date = this.detail.data.release_date.slice(0,4)
            }
        },

        // get just year from release date in item list
        getYears(arr){
            arr.forEach((year)=>{
                if(year.release_date) {
                    year.release_date = year.release_date.slice(0,4)
                } else {
                        year.release_date = "????"
                }
            })
        },

        // rate number formating to one decimal
        getRate(){
            if (this.detail.data.vote_average < 10) {
                this.detail.data.vote_average = this.detail.data.vote_average.toFixed(1)
            } 

            if (this.detail.data.vote_average) {
                this.detail.data.vote_average = this.detail.data.vote_average * 10
            } 
        },

        // rate number formating to one decimal in item list
        getRates(arr){
            arr.forEach((rate)=>{
                if (rate.vote_average < 10) {
                    rate.vote_average =  rate.vote_average.toFixed(1)
                }

                if (rate.vote_average) {
                    rate.vote_average =  rate.vote_average * 10
                }
            })
        },

        // if is no profile image in cast replace with holder
        actors(arr){
            arr.forEach((profile)=> {
                if (profile.profile_path) {
                    profile.profile_path = this.URL.face + profile.profile_path
                } else if (profile.profile_path == null) {
                    profile.profile_path = this.holder.person
                }
            })
        },

        // expand panel with cast and crew
        castPanel(arr){
            // show cast section only if cast exist if not crew panel is expand
            if (!arr.length) {
                this.is.cast = false
            } else {
                this.is.cast = true
            }

            // if crew and cast don't exist hide all credits
            if ( !this.is.crew && !this.is.cast ) {
                this.is.credits = false
            }
        },

        // if crew and cast don't exist hide all credits        
        noCredits(){
            if ( !this.is.crew && !this.is.cast ) {
                this.is.credits = false
            }
        },
        // set video url 
        getVideo(arr){
            // get only video type "trailer" 
            arr.map((video)=>{
                if(video.type == "Trailer") {
                    this.trailers.push(video)
                }
            })

            // set video url
            this.trailers.forEach((video)=>{   
                if (video.key) {
                    video.key = this.URL.video + video.key + "?rel=0&amp;autoplay=1"
                } 
                return video.key 
            })

            if(this.trailers.length) {
                this.detail.video = this.trailers[0].key
            }
            
        
        },

        // video trailer - active only when dialog si active
        trailer(){        
            if (this.box.video) {
                
                return this.detail.video
            } else if (!this.box.video) {
                return ' '   
            }
        },
        
        // rename items because in tv shows api is diferent key then movies api 
        renameItems(arr){
            arr.forEach((item)=>{
                if(item.name) {
                    item.title = item.name
                }
                if(item.first_air_date) {
                    item.release_date = item.first_air_date
                }
            })
        },
    }
}

export {
    moviesData
}

