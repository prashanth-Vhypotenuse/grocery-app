import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import GroceryEditPage from '../views/GroceryEditPage.vue'
import GroceryFormPage from '../views/GroceryFormPage.vue'
import GroceryListPage from '../views/GroceryListPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'grocery-list',
    component: GroceryListPage
  },
  {
    path: '/grocery-add',
    name: 'grocery-add',
    component: GroceryFormPage,
  },
  {
    path: '/grocery-edit/:id',
    name: 'grocery-edit',
    component: GroceryEditPage,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
