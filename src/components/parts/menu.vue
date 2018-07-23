<template><div>
    <div class="menu">
        <div class="menu_wrapper">
            <router-link  :to="{ name: 'home' }" exact> 
                <img src="@/assets/img/svg/logo.svg" alt="moview" class="menu_logo"> 
            </router-link>
            <div class="menu_control">
                <router-link class="menu_control_item" 
                :to="{ name: 'movies' }" exact> Movies </router-link>

                <router-link class="menu_control_item"          
                :to="{ name: 'shows' }" exact> TV Shows </router-link>

                <router-link class="menu_control_item" 
                :to="{ name: 'celebrities' }" exact> Celebrities </router-link>
            </div>
        </div>
    </div>
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
@import '../../assets/scss/parts/_menu';






</style>
