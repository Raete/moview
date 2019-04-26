import firebase from 'firebase/app'

export const scroll = {
    methods: {
        // scroll to top
        // used in every single page and profile
        scrollToTop(scrollDuration) {
            let scrollStep = -window.scrollY / (scrollDuration / 15),
                scrollInterval = setInterval(function(){
                if ( window.scrollY != 0 ) {
                    window.scrollBy( 0, scrollStep );
                }
                else clearInterval(scrollInterval); 
            },15)
        },

        // show back to top button
        // used in every single page and profile
        backToTopBtn() {
            if (window.scrollY >= 1000) {
                this.show.backToTop = false
            } else {
                this.show.backToTop = true
            }
        },

        // scroll up and show video trailer
        // used in movie and tv detail
        showVideoOnTop(){
            this.scrollToTop(200)
            this.box.video = !this.box.video
        },

        // scroll up and show overview
        // used in movie, tv detail and actor
        showViewOnTop(){
            this.scrollToTop(200)
            this.box.overview = !this.box.overview
        },

        // scroll up and show rating modal
        // used in movie, tv detail 
        showRateOnTop(){
            if(firebase.auth().currentUser){
                this.scrollToTop(200)
                this.box.rate = !this.box.rate
            } else {
                // show alert 
                this.alert.type = "error"
                this.infoAlert("You must log in.")
            }
        },
    }
}