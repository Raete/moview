
const formating = {
    methods: {
        // format budget and revenue currancy 
        formatNub(num){ 
            num = Math.abs(num);
            num = num.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
            return num
        },

        timeConvert(data) {
            let minutes = data % 60
            let hours = (data - minutes) / 60
            return  `${hours}h ${minutes}m`
        },

    }
}

const calculate = {
    methods: {

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



export {
    formating,
    calculate
}

