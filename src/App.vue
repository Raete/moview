<template>
  <div id="app">

    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang='scss'>
@import 'assets/scss/_variables';
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
    background: $color-bg
}

p, ul, body, h1, h2 {
    margin: 0;
    padding: 0;
}

li {
    list-style: none;
}

a {
    text-decoration: none;
    color: inherit;
}

button {
    border: 0;
}

//*** arrow animation ***
.arrow {
    position: absolute;
    left: 50%;
    bottom: 30px;
    width: 30px;
    height: 48px;
    transform: translateX(-50%) translateZ(0);
    i {
        position: absolute;        
        left: -24px;
        font-size: 50px;
        animation: scroll 1.25s infinite linear;

    }
}

@keyframes scroll {
    0% { opacity: 0; }
    10% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(15px); opacity: 0;}
}

///*** RECOMEND ITEMS ***///
.recommend {
    text-align: center;
    padding-top: 30px;
}



///*** FOOTER ***///
.app_footer {
    background: $color_bg--darken;
    &_wrapper {
        display: flex;
        justify-content: space-between;
        max-width: $width; 
        margin: 0 auto;
        padding: 20px;
        text-align: center;
    }
}
</style>
