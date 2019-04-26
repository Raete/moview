export const pagination = {
    methods: {
        // PAGINATION
        // used in movie and tv show list
        // ------------------------------

        // prev button
        prev(){
            // if is something in search input use search items array
            if (this.searchInput.select) {
                this.page.curSearch--
                this.searchItems()
            // else use discover items array
            } else {
                this.page.cur--
                this.discoverItems()
            }
            // scroll to top
            this.scrollToTop(300)
        },

        // next button
        next(){
            // if is something in search input use search items array
            if (this.searchInput.select) {
                this.page.curSearch++
                this.searchItems()
            // else use discover items array
            } else {
                this.page.cur++
                this.discoverItems()
            }
            // scroll to top
            this.scrollToTop(300)
        },
    }
}
