import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { isAuthenticated } from '@/shared/lib/utils/isAutorise';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated.value) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});
