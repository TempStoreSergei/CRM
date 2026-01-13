export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home'),
    meta: { requiresAuth: true }
  },
  {
    path: '/nears-events',
    component: () => import('@/pages/nearest-events'),
    name: 'nears-events',
    meta: { requiresAuth: true }
  },
  {
    path: '/calendar',
    component: () => import('@/pages/calendar'),
    name: 'calendar',
    meta: { requiresAuth: true }
  },
  {
    path: '/projects',
    component: () => import('@/pages/projects-page'),
    name: 'projects',
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/details',
    component: () => import('@/pages/project-details'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/task',
    component: () => import('@/pages/project-task'),
    meta: { requiresAuth: true }
  },
  {
    path: '/vacations',
    component: () => import('@/pages/vacations'),
    name: 'vacations',
    meta: { requiresAuth: true }
  },
  {
    path: '/employees',
    name: 'employees',
    component: () => import('@/pages/employees'),
    meta: { requiresAuth: true }
  },
  {
    path: '/messenger',
    name: 'messenger',
    component: () => import('@/pages/messenger'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/settings'),
    meta: { requiresAuth: true }
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: () => import('@/pages/analytics'),
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/pages/notifications'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: () => import('@/pages/login')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/pages/profile'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-profile',
    name: 'my-profile',
    component: () => import('@/pages/profile'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)',
    component: () => import('@/pages/not-found'),
    meta: { requiresAuth: true }
  }
];
