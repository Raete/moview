<template><div>
   
    <footer class="app_footer">
        <div class="app_footer_wrapper">
            <a href="http://www.janakoudelkova.cz" target="_blanck" class="web">created by Jana Koudelková</a>
            <a href="https://www.themoviedb.org" target="_blanck" class="web">Film data provided by TMDb.</a>
        </div>
    </footer>

</div></template>

<script>
    export default {
        name: 'App'
    }
</script>

<style lang='scss'>
    @import '../../assets/scss/_variables';

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
