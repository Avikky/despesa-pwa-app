const routes = [{
    path: '/',
    redirect: '/login',
    component: () => import('layouts/NoLayout.vue'),
    children: [{
        path: '/login',
        component: () => import('pages/Login.vue')
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
    children: [{
      path: '/',
      component: () => import('pages/Index.vue')
    }, ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
