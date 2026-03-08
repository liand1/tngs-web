import type { AppRouteModule, AppRouteRecordRaw } from '@/router/types'

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '@/router/routes/basic'

import { PageEnum } from '@/enums/pageEnum'
import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'

// import.meta.glob() 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.glob('./modules/**/*.ts', { eager: true })
const routeModuleList: AppRouteModule[] = []

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = (modules as Recordable)[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList]

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
}

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/base/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
}

const NavigationRoute: AppRouteRecordRaw = {
  path: '/navigation',
  name: 'navigation',
  component: () => import('@/views/navigation/index.vue'),

  meta: {
    orderNo: 10,
    icon: 'ant-design:home-outlined',
    title: t('routes.dashboard.dashboard'),
  },

}

export const SSORoute: AppRouteRecordRaw = {
  path: '/sso',
  name: 'SSO',
  component: () => import('@/views/base/login/sso.vue'),
  meta: {
    title: t('routes.basic.sso'),
  },
}

export const AnalysisTaskDetailRoute: AppRouteRecordRaw = {
  path: '/lims/analysis-task/detail',
  component: LAYOUT,
  name: 'AnalysisTaskDetail',
  // redirect:'/analysistask/index',
  meta: {
    title: '分析任务详情',
    hidden: true,
  },

  children: [
    {
      path: ':id',
      component: () => import('@/views/lims/analysistaskdetail/index.vue'),
      name: 'AnalysisTaskDetailToId',
      meta: {
        canTo: true,
        hidden: true,
        noTagsView: false,
        icon: 'ant-design:user-outlined',
        title: "分析任务详情",
        currentActiveMenu: "/lims/analysis-task"
      }

    }
  ]
}

export const SocPageTosocIdRoute: AppRouteRecordRaw = {
  path: '/lims/analysis-task/:sampleId?/:socId?/:taskId?',
  component: LAYOUT,
  name: 'SocPageTo',
  meta: {
    title: '分析任务管理',
    hidden: true,
  },

  children: [
    {
      path: '',
      component: () => import('@/views/lims/analysistask/index.vue'),
      name: 'SocPageTosocId',
      meta: {
        canTo: true,
        hidden: true,
        noTagsView: false,
        icon: 'ant-design:user-outlined',
        title: "分析任务管理",
        currentActiveMenu: "/lims/analysis-task"
      }

    }
  ]
}


export const UserManualSettingsRoute: AppRouteRecordRaw = {
  path: '/system/usermanual/:id?',
  component: LAYOUT,
  name: 'UserManual',
  meta: {
    title: '用户手册设置',
    hidden: true,
  },

  children: [
    {
      path: '',
      component: () => import('@/views/system/usermanual/index.vue'),
      name: 'UserManualSettings',
      meta: {
        canTo: true,
        hidden: true,
        noTagsView: false,
        icon: 'ant-design:user-outlined',
        title: "用户手册设置",
        currentActiveMenu: "/system/usermanual"
      }

    }
  ]
}

export const AnalysisReportDetailRoute: AppRouteRecordRaw = {
  path: '/analysis-report/detail',
  component: LAYOUT,
  name: 'AnalysisReportDetail',
  // redirect:'/analysistask/index',
  meta: {
    title: '报告管理详情',
    hidden: true,
  },

  children: [
    {
      path: ':id',
      component: () => import('@/views/lims/analysisreportdetail/index.vue'),
      name: 'AnalysisReportDetailToId',
      meta: {
        canTo: true,
        hidden: true,
        noTagsView: false,
        icon: 'ant-design:user-outlined',
        title: "报告管理详情",
        currentActiveMenu: "/analysis-report"
      }

    }
  ]
}

export const SampleDetailRoute: AppRouteRecordRaw = {
  path: '/sample/detail',
  component: LAYOUT,
  name: 'SampleDetail',
  // redirect:'/analysistask/index',
  meta: {
    title: '样本管理详情',
    hidden: true,
  },

  children: [
    {
      path: ':id/:sampleId',
      component: () => import('@/views/lims/sampledetail2/index.vue'),
      name: 'SampleDetailToid',
      meta: {
        canTo: true,
        hidden: true,
        noTagsView: false,
        icon: 'ant-design:user-outlined',
        title: "样本管理详情",
        currentActiveMenu: "/sample/index"
      }

    }
  ]
}

export const SettingTemplateDetailRoute: AppRouteRecordRaw = {
  path: '/system/template/detail/:id',
  component: LAYOUT,
  name: 'SystemTemplate',
  // redirect:'/analysistask/index',
  meta: {
    title: '配置报告模板详情',
    hidden: true,
  },

  children: [
    {
      path: '',
      component: () => import('@/views/system/settingstemplatedetail/index.vue'),
      name: 'SystemTemplateToId',
      meta: {
        canTo: true,
        hidden: true,
        noTagsView: false,
        icon: 'ant-design:user-outlined',
        title: "配置报告模板详情",
        currentActiveMenu: "/system/template"
      }

    }
  ]
}




//SampleDetailToid


export const ProfileRoute: AppRouteRecordRaw = {
  path: '/profile',
  component: LAYOUT,
  name: 'Profile',
  meta: {
    title: t('routes.basic.profile'),
    hidden: true,
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/base/profile/index.vue'),
      name: 'UserProfile',
      meta: {
        canTo: true,
        hidden: true,
        noTagsView: false,
        icon: 'ant-design:user-outlined',
        title: t('routes.basic.profile'),
      },
    },
    {
      path: 'notify-message',
      component: () => import('@/views/system/notify/my/index.vue'),
      name: 'MyNotifyMessage',
      meta: {
        canTo: true,
        hidden: true,
        noTagsView: false,
        icon: 'ant-design:bell-outlined',
        title: t('routes.basic.notifyMessage'),
      },
    },
  ],
}

export const CodegenRoute: AppRouteRecordRaw = {
  path: '/codegen',
  component: LAYOUT,
  name: 'CodegenEdit',
  meta: {
    title: '修改生成配置',
    hidden: true,
  },
  children: [
    {
      path: 'editTable',
      component: () => import('@/views/infra/codegen/EditTable.vue'),
      name: 'EditTable',
      meta: {
        canTo: true,
        hidden: true,
        noTagsView: false,
        icon: 'ant-design:edit-outlined',
        title: '修改生成配置',
        activeMenu: 'infra/codegen/index',
      },
    },
  ],
}

export const JobLogRoute: AppRouteRecordRaw = {
  path: '/job',
  component: LAYOUT,
  name: 'JobL',
  meta: {
    title: '调度日志',
    hidden: true,
  },
  children: [
    {
      path: 'job-log',
      component: () => import('@/views/infra/job/logger/index.vue'),
      name: 'InfraJobLog',
      meta: {
        canTo: true,
        hidden: true,
        noTagsView: false,
        icon: 'ant-design:bar-chart-outlined',
        title: '调度日志',
        activeMenu: 'infra/job/index',
      },
    },
  ],
}




// Basic routing without permission
// 未经许可的基本路由
export const basicRoutes = [
  LoginRoute,
  NavigationRoute,
  SSORoute,
  RootRoute,
  ProfileRoute,
  CodegenRoute,
  JobLogRoute,
  AnalysisTaskDetailRoute,
  AnalysisReportDetailRoute,
  SampleDetailRoute,
  SettingTemplateDetailRoute,
  SocPageTosocIdRoute,
  UserManualSettingsRoute,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
]
