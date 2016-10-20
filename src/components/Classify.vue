<template>
  <ul class="nav nav-pills nav-stacked">
    <li v-for="item of items"  v-link="{path: '/list/'+item.name, activeClass: 'active'}">
      <a>
        <i class="fa {{iconClass[item.name].name}}" style="font-size: 18px;"></i>
        {{ item.cName}}
      </a>
    </li>
  </ul>
</template>

<script lang="babel">

export default {

  name: 'Classify',

  data () {
    return {
      items: [],
      path: '',
      iconClass: Object
    }
  },

  created () {
    this.iconClass = {
      'shoot': {
        name: 'fa-user'
      },
      'home':{
        name: 'fa-coffee'
      },
      'car': {
        name: 'fa-car'
      },
      'eat': {
        name: 'fa-home'
      },
      'digital': {
        name: 'fa-laptop'
      },
      'clothing': {
        name: 'fa-camera'
      }
    }

    this.fetchClassify();
  },

  methods: {

    fetchClassify () {

        this.$http.get('http://localhost:3030/ajax/classify').then(function (res){

          console.log(res);

          this.items = res.data.data;

        }, function (error){

          console.log(error);

        });
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
.nav li {
  cursor: pointer;
  text-align: center;
}
.list li a {
  display: block;
  text-decoration: none;
}
</style>
