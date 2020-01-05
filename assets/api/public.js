import PREFIX from './prefix'
export const API_BASE = {
    // 公共基础相关接口
    uploadImg:{
        url: PREFIX + '/base/image/upload',
    },
    dict:{
        url: PREFIX + '/base/dict',
    },
    // 手机号前缀
    phonePREFIX:{
        url: PREFIX + '/regioncellphone/list',
    },
    // 玩乐等复合型搜索：地区、门票、餐厅灯
    complexSearch:{
        url: PREFIX + '/search/destination/listForType',
    },
    //获取城市列表（带区域，东欧、西欧）
    listAllCountryWithContinentPartition:{
        url: PREFIX + '/location/listAllCountryWithContinentPartition',
    },
    //word上传
    wordLoad:{
        url: PREFIX + '/base/doc/upload',
    },
};

export const API_LOCATION = {
    // 城市国家接口
    allCountry: {
        url: PREFIX + '/location/listAllCountry',
    },
    treeByCountry: {
        url: PREFIX + '/location/treeByCountry',
    },
    // 获取全部国籍列表
    nationList: {
        url: PREFIX + '/location/listAllNationality',
    },
    // 欧洲分区及国家
    zone: {
        url: PREFIX + '/location/listAllCountryWithContinentPartition',
    },
    //所有国家
    allCity: {
        url: PREFIX + '/location/listAllCity',
    }
};