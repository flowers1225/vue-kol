<template>

  <div class="wrap">
    <div class="m-top">
      <div class="title">达人SO</div>
      <div class="txt">--快速发现领域达人</div>
    </div>
    <div class="m-main container">
      <!--分类列表-->
      <div class="main-classify">
        <classify></classify>
      </div>

      <!--内容列表输出-->
      <div class="main-content" v-show="transition" transition="fade">
        <!--<div v-if="$loadingRouteData">Loading ...</div>-->
        <div class="item" v-for="item of items"  >
          <div class="left-box" @mouseleave.stop="hideUps($index)" @mouseenter.stop="showUps($index)">
            <div v-if="!item.avatar"class="img-circle default"></div>
            <img v-if="item.avatar" :src=item.avatar alt="" class="img-circle">
            <div class="ups" @click="ups($index)">
              <!--<div class="icon glyphicon glyphicon-heart"></div>-->
              <i class="icon fa fa-heart-o"></i>
              <div class="txt">{{item.ups}}</div>
            </div>
          </div>
          <div class="center-box">
            <div class="title">{{ item.title}}</div>
            <div class="content">{{ item.content}}</div>
          </div>
          <div class="right-box">
            <div class="website-item" v-for="website of item.websites">
              <a href="{{website}}" target="_blank"></a>
            </div>
            <!--<div class="btn-addWebsite">-->
            <!--<span class="glyphicon glyphicon-plus"></span>-->
            <!--</div>-->
          </div>
        </div>

        <div class="btn-more" style="cursor: no-drop;" v-if="isLoading" v-show="items.length > 0">
          <span>正在加载</span>
        </div>
        <div v-if="!isLoading">
          <div class="btn-more"  style="cursor: no-drop;" v-if="items.length < limit * (page+1)">
            <span>没有更多</span>
          </div>
          <div class="btn-more" @click="loadMore" v-else >
            <span>加载更多</span>
          </div>
        </div>
      </div>
      <!--<div class="main-content" v-show="!items">-->
      <!--<p>服务器错误</p>-->
      <!--</div>-->
    </div>
    <!--添加达人-->
    <add-kol
      :backdrop-open.sync="backdropOpen"
      :transition-class.sync="transitionClass">
    </add-kol>

    <div class="modal-backdrop fade" v-show="backdropOpen" :class="{ in: transitionClass}"></div>
  </div>
</template>

<script lang="babel">

import Classify from './Classify';
import AddKol from './AddKol';

export default {

  //name: 'KolList',

  components : {
    Classify,
    AddKol
  },

  data () {
    return {
      page: 0,
      items: [],
      limit: 5,
      name: '',
      isLoading: false,
      transition: true,
      backdropOpen: false,
      transitionClass: false,
    }
  },

  route: {

    data (transition) {
      console.log(transition);
      const _that = this;
      this.name = transition.to.params.classifyName;
      this.page = 0;
      //this.items = [];
      this.transition = false;

      return Promise.all([

         this.fetchClassify( this.name, this.limit,  this.page),

       ]).then(function (res) {

        if(res[0].data.data) {
          _that.isLoading = false;

          _that.transition = true;
        }

        return {

          //items: undefined
          items: res[0].data.data  //此处res可能会有多个请求返回

        }
      }, function (error) {

         console.log(error);

       })
    },
    waitForData: true

  },

  methods: {

    fetchClassify (name,limit,page) {

      this.isLoading = true;

      var url ='http://localhost:3030/ajax/list/{0}/{1}/{2}';

      url = url.replace('{0}',name).replace('{1}',limit).replace('{2}',page);

      return this.$http.get(url);
    },

    loadMore () {

      this.page += 1;

      this.fetchClassify( this.name, this.limit,  this.page).then(function (res) {

        this.isLoading = false;

        this.items = this.items.concat(res.data.data)

      },function (error) {

        console.log(error);

      });
    },

    showUps (index) {
      document.querySelectorAll('.ups')[index].style.display = '-webkit-box';
    },

    hideUps (index) {
      document.querySelectorAll('.ups')[index].style.display = 'none';
    },

    ups (index) {
      console.log(index);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
.item {
  margin: 30px 0;
  padding: 10px;
  text-align: left;
  display: -webkit-box;
  background: #fff;
  overflow: hidden;
}
.item:first-child {
  margin-top: 0;
  text-align: left;
}
.item .title{
  color: #fc8c84;
  margin-bottom: 5px;
  font-size: 16px;
}
.item .left-box {
  position: relative;
}
.item .left-box .default{
  width: 66px;
  height:66px;
  background: #eee;
}
.item .left-box img{
  width: 66px;
  height:66px;
}
.item .left-box .ups {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  -webkit-box-align: center;
  -webkit-box-pack: center;
  -webkit-box-orient: vertical;
  cursor: pointer;
}
.item .left-box .ups .icon {
  width: 30px;
  height: 30px;
  color: #e51c23;
  font-size: 24px;
  line-height: 30px;
  text-align: center;
}
.item .left-box .ups .txt {
  font-size: 12px;
  color: #66CC44;
}
.item .center-box {
  margin: 0 15px;
  -webkit-box-flex: 1;
}
.item .right-box {
  width: 200px;
  display: -webkit-box;
  -webkit-box-align: center;
}
.item .right-box > div {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.item .right-box .website-item {
  margin-right: 10px;
  background: #7f7f7f;
}
.item .right-box .website-item a {
  width: 100%;
  height: 100%;
  display: block;
}
.item .right-box .btn-addWebsite {
  font-size: 16px;
  text-align: center;
  background: #7f7f7f;
  color: #fff;
  cursor: pointer;
}
.item .right-box .btn-addWebsite span {
  margin-top: 7px;
}
.btn-more {
  font-size: 13px;
  margin: 20px 0;
  padding: 5px 1px;
  color: #666;
  text-align: center;
  line-height: 1.7;
  white-space: nowrap;
  background: #f1f1f2;
  background: -webkit-linear-gradient(top,#f8f8f9,#e6e6e8);
  background: linear-gradient(to bottom,#f8f8f9,#e6e6e8);
  border: 1px solid #bbb;
  border-radius: 3px;
  box-shadow: 0 1px 0 #fff inset,0 1px 0 rgba(0,0,0,.1);
  cursor: pointer;
}

.fade-transition {
  transition: opacity .3s ease;
}
.fade-enter, .fade-leave {
  opacity: 0;
}
</style>
