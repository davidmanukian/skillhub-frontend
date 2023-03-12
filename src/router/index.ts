// Composables
import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'App',
    component: () => import('@/components/NavBar.vue'),
    children: [
      {
        path: '/',
        name: 'Employee',
        component: () => import('@/views/employee/Employee.vue')
      },
      {
        path: 'assessment',
        name: 'Assessment',
        component: () => import('@/views/assessment/Assessment.vue')
      },
      {
        path: 'project',
        name: 'Project',
        component: () => import('@/views/project/Project.vue')
      }
    ]
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import('@/views/SignIn.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('@/views/SignUp.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const publicPages: string[] = ['/signin', '/signup'];
  const authRequired = !publicPages.includes(to.path);
  const signedIn = localStorage.getItem("user");

  if (authRequired && !signedIn) {
    next('/signin');
  } else {
    next();
  }
})

export default router
