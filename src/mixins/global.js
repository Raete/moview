const global = {
    methods: {
        // decide if item is in array
        // --------------------------
        // id: item id
        // arr: array witch items
        isItem(id, arr){
            return arr.findIndex(el => el.iId == id) !== -1
        },

        infoAlert(msg){
            this.alert.active = true
            this.alert.text = msg
            setTimeout(() => {
                this.alert.active = false
            }, 1500)
        },

    }
}

const initInList = {
    methods: {

        init(){
            this.page.cur = 1
            this.page.curSearch = 1
            !this.searchInput.select 
            this.items.discover = ""
            this.items.search = ""
            this.items.genres = []
        },
        
    }
}

const initInSingle = {
    methods: {

        init(){
            this.loading = true
            // movie details
            this.detail.data = ""
            this.detail.credits.cast = ""
            this.detail.recommend = ""  
            this.detail.similar = ""  
            this.detail.video = ""
            // dialog boxes
            this.box.video = false
            this.box.overview = false
            // show section
            this.show.recommend = false
            this.show.similar = false
            this.show.seasons = true
        },
        
    }
}

const unique = {
    methods: {
        getUnique(arr, key) {

            const unique = arr
                .map(e => e[key])
                // store the keys of the unique objects
                .map((e, i, final) => final.indexOf(e) === i && i)
                // eliminate the dead keys & store unique objects
                .filter(e => arr[e]).map(e => arr[e]);
        
            return unique;
        }
    }
}

const setHref = {
    methods: {
        // set correct path in list
        setHref(type) {
            return type == "movie" ? "singleMovie" : "singleShow"
        },
    }
}

export {
    global,
    initInList,
    initInSingle,
    unique,
    setHref
}

