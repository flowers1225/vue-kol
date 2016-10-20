<template>
  <div class="wrap">
    <router-view
        keep-alive
        transition="fade"
        transition-mod="out-in">
    </router-view>
  </div>
</template>
<script lang="babel">

//import

export default{
  name: 'APP',

  data(){
    return{
      message:'msg'
    }
  },

}
</script>
<style>
  *{
    margin: 0;
    padding:0
  }
  html {
    height: 100%;
  }

  body {
    height: 100%;
    background: #eee;
  }

  .wrap .m-top {
    width: 100%;
    height: 160px;
    background-color: #333;
    color: #fff;
    padding-top: 40px;
    margin-bottom: 40px;
  }
  .wrap .m-top .title {
    font-size: 26px;
    text-align: center;
    margin-bottom: 10px;
  }
  .wrap .m-top .txt {
    font-size: 16px;
    text-align: center;
    margin-left: 210px;
  }
  .m-main {
    display: -webkit-box;
    min-width: 768px;
    padding-bottom: 50px
  }
  .main-classify {
    width: 120px;
    margin-right: 30px;
  }
  .m-classify a {
    color: #42b983;
    text-decoration: none;
  }
  .main-content {
    -webkit-box-flex: 1;
  }

  .fade-transition {
    transition: opacity .3s ease;
  }
  .fade-enter, .fade-leave {
    opacity: 0;
  }
</style>
