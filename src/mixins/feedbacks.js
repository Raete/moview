const profileFeedback = {
    methods: {
        // FEEDBACK
        // used in profile page
        // ------------------- 

        // get feedback when user don't have items in watchlist, seen or rated
        // ---------------------------------------------------------
        // arr = local array with items 
        // type = items in menu (all, movie, tv)
        // department = (same like database in firebase: watchlist, rating, seen)
        feedback(arr, type, department){
            // feedback for watchlist
            if(!arr.length && department == "watchlist"){
                if(type == "all") {
                    return `Your watchlist is empty.`
                }
                if(type == "movie") {
                    return `You don't have any movies in the watchlist.`
                }
                if(type == "tv") {
                    return `You don't have any TV shows in the watchlist.`
                }
            }
            // feedback for rating
            if(!arr.length && department == "rating"){
                if(type == "all") {
                    return `You have no rated movies or TV shows.`
                }
                if(type == "movie") {
                    return `You have no rated movies.`
                }
                if(type == "tv") {
                    return `You have no rated TV shows.`
                }
            }
            // feedback for seen 
            if(!arr.length && department == "seen"){
                if(type == "all") {
                    return `No movies or TV shows marked as seen.`
                }
                if(type == "movie") {
                    return `No movies marked as seen.`
                }
                if(type == "tv") {
                    return `No TV shows marked as seen.`
                }
            }
        },
    }
}

const actorFeedback = {
    methods: {
        // FEEDBACK
        // used in actor page
        // ------------------- 

        // get feedback when actor don't have items in movies or tv
        // --------------------------------------------------------
        // arr = local array with items
        // department = (eg. acting, sound, directing ect...)
        // type = tv or movie
        feedback(arr, department, type){
            if(!arr.length){
                if(type == "tv") {
                    return `No ${type} shows in ${department}.`

                } else {
                    return `No ${type}s in ${department}.`
                } 
            }
        },    
    }
}

export {
    actorFeedback,
    profileFeedback
}

