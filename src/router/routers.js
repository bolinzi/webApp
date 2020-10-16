export default [
    {
        path: '/',
        redirect: {
            name: 'mediaCompareIndex'
        }
    },
    {
        path: '/media-compare/index',
        name: 'mediaCompareIndex',
        component: () => import('@/views/media-compare/index'),
        meta: {
            title: '竞媒首页'
        }
    },
    {
        path: '/media-compare/select-city',
        name: 'mediaCompareSelectCity',
        component: () => import('@/views/media-compare/select-city'),
        meta: {
            title: '选择城市'
        }
    },
    {
        path: '/media-compare/search',
        name: 'mediaCompareSearch',
        component: () => import('@/views/media-compare/search'),
        meta: {
            title: '搜索'
        }
    },
    {
        path: '/media-compare/map',
        name: 'mediaCompareMap',
        component: () => import('@/views/media-compare/map'),
        meta: {
            title: '竞媒对比'
        }
    },
    {
        //  * id: projectId 必须，
        //  * type: 必须，xc = 新潮, fz = 分众
        path: '/media-compare/detail/:id/:type',
        name: 'mediaCompareDetail',
        component: () => import('@/views/media-compare/detail'),
        meta: {
            title: '详情'
        }
    }
];
