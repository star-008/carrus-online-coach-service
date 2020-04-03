import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import Register from '@/views/Register'
import RegisterCoach from '@/views/RegisterCoach'
import Login from '@/views/Login'
import ForgotPassword from '@/views/ForgotPassword'

import SeekerSpace from '@/views/seeker/Seeker'
import CoachSpace from '@/views/coach/Coach'
import AdminSpace from '@/views/admin/Admin'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  scrollBehavior: function(to) {
    if (to.hash) {
      return { selector: to.hash }
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: 'HomePage',
      redirect: { name: 'Login' },
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/register-coach',
      name: 'RegisterCoach',
      component: RegisterCoach,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPassword,
    },
    {
      path: '/seeker',
      name: 'Seeker',
      component: SeekerSpace,
      meta: { requiresSeeker: true },
      children: [
        {
          path: 'dashboard',
          name: 'SeekerDashboard',
          alias: '/seeker',
          component: () => import('../views/seeker/SeekerDashboard'),
        },
        {
          path: 'requests',
          name: 'SeekerRequests',
          component: () => import('../views/seeker/SeekerRequests.vue'),
          meta: { requiresFeature: 'chat' },
        },
        {
          path: 'settings',
          name: 'SeekerSettings',
          component: () => import('../views/seeker/SeekerSettings.vue'),
        },
        {
          path: 'coach-list',
          name: 'SearchCoaches',
          component: () => import('../views/seeker/SearchCoaches.vue'),
        },
        {
          path: '/coach-profile/:coachId',
          name: 'CoachProfile',
          component: () => import('../views/seeker/SeekerCoachProfile.vue'),
        },
        {
          path: 'faq',
          name: 'SeekerFAQ',
          component: () => import('../views/common/FAQ.vue'),
        },
        {
          path: 'orders',
          name: 'SeekerTransactions',
          component: () => import('../views/seeker/SeekerTransactions.vue'),
          meta: { requiresFeature: 'payments' },
        },
      ],
    },
    // COACH
    {
      path: '/coach',
      name: 'Coach',
      component: CoachSpace,
      meta: { requiresCoach: true },
      children: [
        {
          path: 'dashboard',
          name: 'CoachDashboard',
          component: () => import('../views/coach/CoachDashboard'),
        },
        {
          path: 'profile',
          name: 'CoachMyProfile',
          component: () => import('../views/coach/CoachMyProfile.vue'),
        },
        {
          path: 'requests',
          name: 'CoachRequests',
          component: () => import('../views/coach/CoachRequests.vue'),
          meta: { requiresFeature: 'chat' },
        },
        {
          path: 'orders',
          name: 'CoachTransactions',
          component: () => import('../views/coach/CoachTransactions.vue'),
          meta: { requiresFeature: 'payments' },
        },
        {
          path: 'faq',
          name: 'CoachFAQ',
          component: () => import('../views/common/FAQ.vue'),
        },
        {
          path: 'settings',
          name: 'CoachSettings',
          component: () => import('../views/coach/CoachSettings.vue'),
        },
      ],
    },
    // Organization
    {
      path: '/organization/:organizationId',
      name: 'organization',
      component: () => import('../views/organization/Organization'),
      redirect: '/organization/:organizationId/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'organization-dashboard',
          component: () =>
            import('../views/organization/OrganizationDashboard'),
        },
        {
          path: 'staff',
          name: 'organization-staff',
          component: () => import('../views/organization/OrganizationStaff'),
        },
      ],
    },
    // ADMIN
    {
      path: '/admin',
      name: 'Admin',
      component: AdminSpace,
      meta: { requiresAdmin: true },
      children: [
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: () => import('../views/admin/AdminDashboard'),
        },
        {
          path: 'requests',
          name: 'AdminRequests',
          component: () => import('../views/admin/AdminRequests.vue'),
          meta: { requiresFeature: 'chat' },
        },
        {
          path: 'orders',
          name: 'AdminOrders',
          component: () => import('../views/admin/AdminOrders.vue'),
          meta: { requiresFeature: 'payments' },
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const requiresSeeker = to.matched.some(record => record.meta.requiresSeeker)
  const requiresCoach = to.matched.some(record => record.meta.requiresCoach)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const featuresRequired = to.matched
    .map(match => match.meta.requiresFeature)
    .filter(feature => feature)

  const requiresFeature = featuresRequired.length > 0

  let userRole = store.state.auth.user && store.state.auth.user.role

  // console.log('\nuser: ', userRole, '\ntoRoute: ', to.path, to)

  if (userRole) {
    loggedInRouting()
  } else if (store.state.auth.loggedIn === false) {
    if (requiresAdmin || requiresCoach || requiresSeeker) {
      next('/')
    } else {
      next()
    }
  } else {
    const watcher = store.watch(
      () => store.state.auth.user,
      () => {
        watcher()
        loggedInRouting()
      }
    )
  }

  function loggedInRouting() {
    userRole = store.state.auth.user && store.state.auth.user.role
    if (
      requiresFeature &&
      !hasFeatureInstalled(featuresRequired, store.getters.features)
    ) {
      next('/')
    } else if (requiresAdmin && userRole !== 'admin') {
      next('/')
    } else if (requiresCoach && userRole !== 'coach') {
      next('/')
    } else if (requiresSeeker && userRole !== 'seeker') {
      next('/')
    } else if (to.name === 'Login') {
      next(`/${userRole}/dashboard`)
    } else {
      next()
    }
  }

  function hasFeatureInstalled(featuresRequired, installedFeatures) {
    return featuresRequired.every(feature =>
      installedFeatures.includes(feature)
    )
  }
})

export default router
