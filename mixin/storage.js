/*
 * @Author: magckeyyy
 * @Date: 2019-11-05 19:03:27
 * @Description: 如果value是string或者number不能使用get、set方法，会报错或者改变值得类型
 * @Attention: 
 */
function LStorage(method, key, value) {
    if(!process.client) return;
    let local = window.localStorage;
    switch(method) {
        case 'get':
            if(!local[key]) return;
            return JSON.parse(local[key]);
        case 'set':
            local.setItem(key,JSON.stringify(value));
            break;
        case 'remove':
            local.removeItem(key);
            break;
        case 'clear':
            local.clear();
            break;
        case 'has':
            return local[key]?true:false;
    }
}

function SStorage(method, key, value) {
    if(!process.client) return;
    let local = window.sessionStorage;
    switch(method) {
        case 'get':
            if(!local[key]) return;
            return JSON.parse(local[key]);
        case 'set':
            local.setItem(key,JSON.stringify(value));
            break;
        case 'remove':
            local.removeItem(key);
            break;
        case 'clear':
            local.clear();
            break;
        case 'has':
            return local[key]?true:false;
    }
}

export const storage={
    methods: {
        mixin_m_LStorage: LStorage,
        mixin_m_SStorage: SStorage,
    }
}