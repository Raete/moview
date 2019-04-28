const formating = {
    methods: {
        // FORMATING NUMBERS
        // used in movie and tv detail
        // ---------------------------

        // format budget and revenue currancy 
        // ----------------------------------
        // num = formating number
        formatNub(num){ 
            num = Math.abs(num);
            // currancy settings
            num = num.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
            return num
        },

        // converting ms to hours and minutes
        // ----------------------------------
        // data = ms data
        timeConvert(data) {
            let minutes = data % 60
            let hours = (data - minutes) / 60
            return  `${hours}h ${minutes}m`
        },

        // plural season and epsisode when is more then one
        plural(){
            if (this.detail.data.number_of_seasons > 1) {
                this.season = "seasons"
            }
            if (this.detail.data.number_of_episodes > 1) {
                this.episode = "episodes"
            }  
        },
    }
}

const calculate = {
    methods: {
        // CALCULATONS
        // used in tv detail
        // ---------------------------

        // average item in array
        average(array){
            let total =  0;
            for (let i = 0; i < array.length; ++i)
                {
                    if ( isNaN(array[i]) ){
                        continue;
                    }
                    total += +(array[i]);
                }
            return Math.round(total/array.length);
        },
    }
}

export {
    formating,
    calculate
}

