<template><div>
    

        
            <figure class="item_content animated" >
                <span class="item_chip item_chip--rate"> 
                    <slot name="rate"></slot>
                     <img src="@/assets/img/svg/star.svg"></span>
                    <span class="item_chip item_chip--year"><slot name="year"></slot>
                     </span>
                    <slot name="img"></slot>
               
                <figcaption class="item_hover">
                    <img class="item_hover_ico" src="@/assets/img/svg/plus.svg" alt="">
                </figcaption>           
            </figure>
       

           
</div></template>

<script>
export default {
    data () {
        return {        
            
        }
    },
}
</script>


<style lang='scss' scoped>
    @import '../../assets/scss/_variables';
    @import '../../assets/scss/parts/_general';
    @import '../../assets/scss/parts/_itemList';



</style>
