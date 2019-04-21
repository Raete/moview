export const pagination = {
    methods: {
        //paginations prev button
        prev(){
            if (this.searchInput.select) {
                this.page.curSearch--
                this.searchItems()
            } else {
                this.page.cur--
                this.discoverItems()
            }
            this.scrollToTop(300)
        },

        //paginations next button
        next(){
            if (this.searchInput.select) {
                this.page.curSearch++
                this.searchItems()
            } else {
                this.page.cur++
                this.discoverItems()
            }
            this.scrollToTop(300)
        },
    }
}
