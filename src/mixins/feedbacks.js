const profileFeedback = {
    methods: {
        

    }
}

const actorFeedback = {
    methods: {

        feedback(arr, department, type){
            if(!arr.length){
                if(type == "tv") {
                    return `no ${type} shows in ${department}`
                } else {
                    return `no ${type}s in ${department}`
                }
                
            }
        },
        
    }
}



export {
    actorFeedback
}

