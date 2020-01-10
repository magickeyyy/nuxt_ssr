// 参照.nuxt/router.js中路由规则,添加后需要重启项目
// 目前只处理嵌套三层的路由，递归实现有难度
// login===2必须登录，login===1部分接口需要登录才能显示，0不需要登录。鉴权在middleware/auth.js
// 可以增加路由的私有导航守卫，但建议使用middleware
// 没有判断的重定向就在此完成 redirect: { name: 'personal_center-index-account' },
const routeList = [
    {
        name: 'index',
        redirect: { name: 'hotel' }
    },
    {
        name: 'play',
        meta: {
            login: 2,
            redirect: '/',
        },
    },
    {
        name: 'play-list',
        meta: {
            login: 2,
            redirect: '/play',
        },
    },
    {
        name: 'play-chooesCity',
        meta: {
            login: 2,
            redirect: '/play',
        },
    },
    {
        name: 'play-detail',
        meta: {
            login: 2,
            redirect: '/play',
        },
    },
    {
        name: 'play-resOrder',
        meta: {
            login: 2,
            redirect: '/play',
        },
    },
    {
        name: 'play-ticketOrder',
        meta: {
            login: 2,
            redirect: '/play',
        },
    },
    {
        name: 'play-expOrder',
        meta: {
            login: 2,
            redirect: '/play',
        },
    },
    {
        name: 'play-pay',
        meta: {
            login: 2,
            redirect: '/play',
            vuexModule: 'play',
        },
    },
    {
        name: 'play-orderDetail',
        meta: {
            login: 2,
            redirect: '/play',
        },
    },
    {
        name: 'hotel-search',
        meta: {
            login: 2,
            redirect: '/hotel',
            vuexModule: 'hotel',
        },
    },
    {
        name: 'hotel-team',
        meta: {
            login: 2,
            redirect: '/hotel',
            vuexModule: 'hotel',
        },
    },
    {
        name: 'hotel-scattered',
        meta: {
            login: 2,
            redirect: '/hotel',
            vuexModule: 'hotel',
        },
    },
    {
        name: 'hotel-pay',
        meta: {
            login: 2,
            redirect: '/hotel',
            vuexModule: 'hotel',
        },
    },
    {
        name: 'bus-detail',
        meta: {
            login: 2,
            redirect: '/',
        },
    },
    {
        name: 'bus',
        meta: {
            login: 2,
            redirect: '/',
        },
    },
    {
        name: 'bus-orderWaitConfirm',
        meta: {
            login: 2,
            redirect: '/',
        },
    },
    {
        name: 'bus-pay',
        meta: {
            login: 2,
            redirect: '/',
        },
    },
    {
        name: 'bus-preOrder',
        meta: {
            login: 2,
            redirect: '/',
        },
    },
    {
        name: 'bus-showOrder',
        meta: {
            login: 2,
            redirect: '/',
        },
    },
    {
        name: 'personal_center',
        meta: {
            login: 2,
            redirect: '/',
        },
        redirect: { name: 'personal_center-index-account' },
        children: [
            {
                name: 'personal_center-index-order',
                meta: {
                    login: 2,
                    redirect: '/',
                },
                redirect: { name: 'personal_center-index-order-hotel', query: { type: 0 } }
            },
            {
                name: 'personal_center-index-account',
                meta: {
                    login: 2,
                    redirect: '/',
                },
            },
        ],
    },
    {
        name: 'register',
        redirect: {name: 'register-step1'}
    },
];

function iterator(routes, extend) {
    for (let i = 0; i < extend.length; i++) {
        let n = routes.findIndex(v => v.name === extend[i].name);
        if (n > -1) {
            Object.keys(extend[i]).map(key => {
                if(key !== 'name' && key !== 'children') {
                    routes[n][key] = extend[i][key];
                }
                if(key === 'children') {
                    iterator(routes[n].children, extend[i].children);
                }
            });
        }
    }
}
module.exports = function(routes, resolve) {
    routes = iterator(routes, routeList);
};
