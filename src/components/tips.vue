<template><div>

    
        <div class="item_wrapper">
            <div class="item" v-for="(film, index) in films" :key="index">
                <router-link :to="{ name: 'singleMovie' }"> 
                    <figure class="item_content">
                        <span class="item_rate">{{film.rate}}</span>
                        <img class="item_img" v-bind:src="film.img" alt="">
                        <figcaption class="item_hover">
                            <img class="item_hover_ico" src="../assets/img/svg/plus.svg" alt="">
                        </figcaption>           
                    </figure>
                </router-link>
                <h1 class="item_name"> {{film.title}}  </h1>
            </div>
        </div> 


</div></template>

<script>


export default {

    data () {
        return {
            films: [
                { 
                    img: require('../assets/img/posters/arrival.jpg'),
                    title: 'Arrival',
                    rate: '70%'
                },
                { 
                    img: require('../assets/img/posters/beauty_and_beast.jpg'), 
                    title: 'Beauty and the Beast',
                    rate: '65%'
                },
                { 
                    img: require('../assets/img/posters/best_offer.jpg'), 
                    title: 'The Best Offer',
                    rate: '48%'
                },           
                { 
                    img: require('../assets/img/posters/guardians.jpg'),  
                    title: 'Guardians of the Galaxy Vol. 2',
                    rate: '75%'
                },
                     
            ],    
        }
    },
    
}
</script>


<style lang='scss' scoped>
@import '../assets/scss/_variables';
@import '../assets/scss/_itemList';





</style>
