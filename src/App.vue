<template>
  <div id="app">
      
    <router-view :key="$route.name + ($route.params.id || '')"></router-view>

  </div>
</template>

<script>
export default {
    name: 'App',
    data () {
        return {
    

        }
    },


}
</script>

<style lang='scss'>
@import 'assets/scss/_variables';
@import 'assets/scss/parts/_general';


///*** GENERAL SETTINGS ***///

html {
    box-sizing: border-box;

}

*, *:before, *:after {
    box-sizing: inherit;
}

*:focus {
    outline: none;
}

html,
body {
    font-family: $main_font;
    height: 100vh;
    background: $color_back_2
}



</style>
