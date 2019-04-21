// firebase
import firebase from 'firebase/app'

export const icons = {
    methods: {
        // styling button 
        // --------------
        // id: film.id, 
        // arr: film array, 
        // before: icon name, 
        // after: icon name
        styleIcon(id, arr, before, after){
          
            // if user is login then:
            if(firebase.auth().currentUser){
                // if item is in array:    
                if (this.isItem(id, arr)) {
                    // slyle after icon
                    return after
                    // if not:
                } else if (!this.isItem(id, arr)) {
                    // style before icon
                    return before
                }
            // if user is not login style before icon
            } else return before
        },
    }
}

export const text = {
    methods: {
        // id = film.id, arr = film array, before = text, after = text
        styleText(id, arr, before, after){
            // if user is login then:
            if(firebase.auth().currentUser){
                // if movie is seen then:    
                if (this.isItem(id, arr)) {
                    // slyle text
                    return after
                    // if not:
                } else if (!this.isItem(id, arr)) {
                    // style text
                    return before
                }
            // if user is not login style text
            } else return before
            
        },

        // stylize rating button depending on whether the movie is rated
        // text button
        styleRateText(arr, rate){
            // if user is login then:
            if(firebase.auth().currentUser){

                if (this.isItem(this.$route.params.id, arr)) {
                    return `Your rate is: ${rate}%`
                } else if (!this.isItem(this.$route.params.id, arr)) {
                    return "Rate"
                }
            } else return "Rate"
        },

        rateLabel(val) {
            return this.rating[val]
        },
    }
}

