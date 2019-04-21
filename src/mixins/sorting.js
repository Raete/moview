

const renderItems = {
    computed: {

        render(){
            if(this.activeRender == "all") {
                return this.itemsByType

            // show only item with type movie
            } else if (this.activeRender == "movie") {
                let movie
                movie = this.filterItem("movie", this.itemsByType)
                return movie
                

            // show only item with type show
            } else if (this.activeRender == "tv") {
                let tv
                tv = this.filterItem("tv", this.itemsByType)
                return tv
                
            }
        },
       
    }
}

const filterItem = {
    methods: {
        filterItem(type, arr){
            let filteredItems = []
            
            filteredItems = arr.filter(item =>{
                return item.media_type == type
            })
            
            return filteredItems
        },

    }
}

const itemCounter = {
    methods: {
        // type = item in menu, arr = array of items, db = name of array
        // submenu (all, movies, shows)
        itemCounter(type, arr){
           

            if(type == "all") {
                return arr.length 
            }

            if(type == "movies") {
                let movies = this.filterItem("movie", arr)
                return movies.length
            }

            if(type == "shows") {
                let movies = this.filterItem("tv", arr)
                return movies.length
            }
      
    },

    }
}

const sortby = {
    methods: {
        sortBy(array, param, reverse) {
            let _this = this
			let filterA, filterB;
			return array.sort(function (a, b) {
				switch (param) {
					case 'title':
						filterA = b.title;
                        filterB = a.title;
                        _this.sorting.text = "title"
                        break;
                    case 'rate':
						filterA = b.vote_average;
                        filterB = a.vote_average;
                        _this.sorting.text = "rating"
                        break;
                    case 'year':
						filterA = b.release_date;
                        filterB = a.release_date;
                        _this.sorting.text = "year"
                        break;
                    case 'user_rate':
						filterA = b.user_rate;
                        filterB = a.user_rate;
                        _this.sorting.text = "your rate"
                        break;
                    case 'added':
						filterA = b.added;
                        filterB = a.added;
                        _this.sorting.text = "added"
						break;
				}
				if (reverse) {
                    return (filterA > filterB) ? 1 : -1;
				} else {
                    return (filterA < filterB) ? 1 : -1;
				}
            });

        },

    }
}

const dynamicSort = {
    methods: {
        // sort movies and tv shows by year
        dynamicSort(property) {
            let sortOrder = 1;
            if (property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a,b) {
                let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        },

    }
}

const createArrByType = {
    methods: {
        // render item by current tab 
        createArrByType(type){
            this.itemsByType = []

            this.actor.roles.forEach(item =>{
                if (item.department == type) {
                    this.itemsByType.push(item)
                    
                }
            })  
            // remove movies and tv shows with same id
            this.itemsByType = this.getUnique(this.itemsByType , "id")

            
        },

    }
}

export {
    renderItems,
    filterItem,
    itemCounter,
    sortby,
    dynamicSort,
    createArrByType 
}

