/** @format */
/* eslint-disable */

import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from '../views/IoT/Dashboard';
import IndividualData from '../views/IoT/IndividualData';
import Graphs from '../views/IoT/Graphs';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Add from '../views/IoT/Add.vue';
import Delete from '../views/IoT/Delete.vue';
import Edit from '../views/IoT/Edit.vue';
import Period from '../views/IoT/Period.vue';

import { fb } from '../firebase';

Vue.use(VueRouter);

const routes = [
  {
    name: 'Dashboard',
    path: '/',
    component: Dashboard,
  },
  {
    name: 'IndividualData',
    path: '/individual-data',
    component: IndividualData,
  },
  {
    name: 'Graphs',
    path: '/graphs',
    component: Graphs,
  },
  {
    name: 'PeriodGraphs',
    path: '/period-graphs',
    component: Period,
  },
  {
    name: 'Add',
    path: '/add',
    component: Add,
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: 'Edit',
    path: '/edit',
    component: Edit,
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: 'Delete',
    path: '/delete',
    component: Delete,
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
      requiresGuest: true,
    },
  },
  {
    name: 'register',
    path: '/register',
    component: Register,
    meta: {
      requiresGuest: true,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!fb.auth().currentUser) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.requiresGuest)) {
    if (fb.auth().currentUser) {
      next({
        path: '/',
        query: {
          redirect: to.fullPath,
        },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
