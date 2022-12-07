import Vue from "vue"
import VueRouter from "vue-router"
import store from "./../store/index"
import Login from "../views/Login.vue"
import NotFound from "../views/NotFound.vue"
import GamesPage from "@/views/Games.vue"
import GameHandler from "@/views/GameHandler.vue"

Vue.use(VueRouter)

const authGuard = async (to, from, next) => {
  const isAuth = store.getters.isAuth
  if (!isAuth) return next({name: "Login"})

  const userRole = store.getters.role
  const routeRoles = to.meta?.roles
  if (!routeRoles || routeRoles.includes(userRole)) return next()

  return next({name: "NotFound"})
}

const beforeEnterLoginPage = async (to, from, next) => {
  const isAuth = store.getters.isAuth
  return isAuth ? next({name: "Games"}) : next()
}

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    beforeEnter: beforeEnterLoginPage,
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
