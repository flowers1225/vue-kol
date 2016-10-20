<template>
  <div class="loading">{{message}}</div>
</template>

<script lang="babel">

  export default {
    name: 'Index',

    ready (){
      setTimeout(() => {
        this.$route.router.go({ path: '/list/shoot'});
      },2000);
    },

    data () {
      return {
        message: 'index'
      }

    },

    router: {
      data (transition) {
        console.log(transition);
      }
    }
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
  .loading {
    position: absolute;
    top: 0;
    left:0;
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

  .logo {
    width: 100px;
    height: 100px
  }
  .fade-transition {
    transition: opacity .5s ease;
  }
  .fade-enter, .fade-leave {
    opacity: 0;
  }
</style>
