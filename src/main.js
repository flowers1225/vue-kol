import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'

import App from './App';
import Index from './components/Index';
import KolList from './components/KolList';

Vue.use(Resource);
Vue.use(Router);

const router = new Router({hashbang: false, history: true});

// router.map({
//   '/list/:classifyName': {
//     component: KolList
//   },
//
// });

router.map({
  '/': {
    'name': 'index',
    component: Index,
  },
  '/list/:classifyName': {
    'name': 'list',
    component: KolList
  },
})

// router.redirect({
//   '*': '/list/shoot'
// });

router.start(App, '#app');
