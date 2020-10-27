/** @format */
/* eslint-disable */

import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Iot from "../views/Iot.vue";
import Dashboard from "../views/IoT/Dashboard";
import IndividualData from "../views/IoT/IndividualData";
import Graphs from "../views/IoT/Graphs";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Add from "../views/IoT/Add.vue";
import Delete from "../views/IoT/Delete.vue";
import Edit from "../views/IoT/Edit.vue";
import Period from "../views/IoT/Period.vue";

import { fb } from "../firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/iot",
    component: Iot,
    children: [
      {
        path: "",
        name: "dashboard",
        component: Dashboard
      },
      {
        path: "individualdata",
        name: "individualdata",
        component: IndividualData
      },
      {
        path: "graphs",
        name: "graphs",
        component: Graphs
      },
      {
        path: "period",
        name: "period",
        component: Period
      },
      {
        path: "login",
        name: "login",
        component: Login,
        meta: {
          requiresGuest: true
        }
      },
      {
        path: "register",
        name: "register",
        component: Register,
        meta: {
          requiresGuest: true
        }
      },
      {
        path: "add",
        name: "add",
        component: Add,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "delete",
        name: "delete",
        component: Delete,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "edit",
        name: "edit",
        component: Edit,
        meta: {
          requiresAuth: true
        }
      }
    ]
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!fb.auth().currentUser) {
      next({
        path: "iot/login",
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.requiresGuest)) {
    if (fb.auth().currentUser) {
      next({
        path: "/iot",
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
