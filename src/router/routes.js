const routes = [
  {
    path: '/',
    redirect: '/login',
    component: () => import('layouts/NoLayout.vue'),
    meta: {
      requiresAuth: false
    },
    children: [{
        path: '/login',
        component: () => import('pages/Login.vue'),

      },
      {
        path: '/register',
        component: () => import('pages/Register.vue')
      },
      {
        path: '/password-recovery',
        component: () => import('pages/PasswordRecovery.vue')
      },
    ]
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [{
        path: '/',
        component: () => import('pages/Index.vue'),

      },
      {
        path: '/income',
        component: () => import('pages/Income.vue'),
      },
      {
        path: '/customer',
        component: () => import('pages/Customers.vue'),
      },
      {
        path: '/report',
        component: () => import('pages/Report.vue')
      },
      {
        path: '/add-expense',
        component: () => import('components/AddExpense.vue')
      },
      {
        path: '/settings',
        component: () => import('pages/Settings.vue')
      },
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{
      path: '/',
      component: () => import('pages/AdminDashboard.vue')
    }, ]
  },

  {
    path: '/error',
    component: () => import('pages/Unauthorised401.vue')
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
