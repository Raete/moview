const renderItems = {
    computed: {
        // show list of item based on submemu (all, movies, tv shows)
        // used in profile, actor page
        render(){
            // show all item 
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
        // create array with items based on type (movie or tv)
        // used in actor page and profile
        // -------------------------------
        // type = movie or tv
        // arr = array with items
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
        // COUNTING ITEMS IN ARRAY
        // used in actor page an profile
        // ----------------------------- 
        // type = item in submenu (all, movies, shows) 
        // arr = array of items, 
        // db = name of array
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
        // SORTING ITEM IN ARRAY
        // used in actor page an profile
        // ----------------------------- 
        // array = array with items,
        // param = sorting parameter
        // reverse = reverse item
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
        // SORT ITEMS IN ARRAY BASED ON PROPERTY
        // sort movies and tv shows by year
        // used in actor page
        // property = set property for sorting (add "-" for reverse)
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

        // render item by department
        // used in actor page and profile
        // -------------------------------
        // department = set department for render
        // arr = array with items 
        createArrByType(department, arr){
            this.itemsByType = []

            arr.forEach(item =>{
                if (item.department == department) {
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