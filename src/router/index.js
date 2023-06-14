// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore, useAlertStore } from '@/stores';

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: '/setting',
        name: 'Setting',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Setting.vue'),
      },
      {
        path: '/user-management',
        name: 'UserManage',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Users.vue'),
      },
      {
        path: '/user-management/:user_id',
        name: 'UserDetail',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/UserDetail.vue'),
      },
      {
        path: '/group-management',
        name: 'GroupManage',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Groups.vue'),
      },
      {
        path: '/group-management/:group_id',
        name: 'GroupDetail',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/GroupDetail.vue'),
      },
      {
        path: '/token-management',
        name: 'TokenManagement',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Tokens.vue'),
      },
    ],
  },
  {
    path: '/auth',
    redirect: '/auth/signin',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '/auth/signin',
        name: 'Login',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Login.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/not-found'
  },
  {
    path: '/not-found',
    name: 'NotFound',
    component: () => import('@/views/Notfound.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const alertStore = useAlertStore();
  alertStore.clear();

  // redirect to login page if not logged in and trying to access a restricted page 
  const publicPages = ['/auth/signin', '/not-found'];
  const authRequired = !publicPages.includes(to.path);
  const authStore = useAuthStore();

  if (authRequired && !authStore.user) {
    authStore.returnUrl = to.fullPath;
    next("/auth/signin");
  } else {
    next();
  }
});

export default router
