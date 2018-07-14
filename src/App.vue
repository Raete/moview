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

.tab_item {
    margin-top: 40px;
}
.tab_menu_item {
    font-weight: 700;
}

///*** BUTTONS ***///
.back_btn {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    text-align: right;
    margin-bottom: 30px;
    transition: .3s;
    cursor: pointer;
    &:hover {
        font-weight: 700;
    }
}

//--desktop--
@media screen and (min-width: 1000px) {
    .back_btn {
        margin-bottom: 90px;
    }
}

.info_btn {
    border: 2px solid $color_text;
    border-radius: 8px;
    padding: 10px 20px;
    text-align: center;
    font-weight: 700;
    transition: .3s;
    margin-top: 30px;
    &:hover {
        background: $color_text;
        color: $color_main
    }
}

.overview_btn {
    display: block;
    font-weight: 700;
    border-bottom: 2px dotted transparent;
    transition: .3s;
    &:hover {
        border-bottom: 2px dotted $color_text;
    }
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
