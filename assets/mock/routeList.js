export default {
    "title": "欧洲秘境 亚得里亚海与巴尔干山脉8日", // 行程标题
    "coverImage": "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2492876497,1625400592&fm=26&gp=0.jpg", // 行程封面图片
    "customerId": 0, // 用户id
    "id": 0, // 行程id
    // "costPriceTotal": 0, //成本总价
    // "offerPriceTotal": 0, // 对外总报价
    "wholeItinerary":{ // 全部行程
        "image": "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2492876497,1625400592&fm=26&gp=0.jpg",
        "routes": ["重庆", "巴黎", "重庆"],
    },
    "itineraryList": [ // 行程列表，按时间先后顺序排
        {
            "overview": { //当天概览
                "date": new Date(), // 日期
                "routesImage": "", // 路线图
                "destinations": [ // 路线列表
                    {
                        "cityName": "重庆", // 城市名
                        "latitude": "", //城市纬度
                        "longitude": "", //城市经度
                        "destinationName": "江北国际机场", // 目的地名称，城市、机场、玩乐、酒店的名称
                    },
                    {
                        "cityName": "巴黎", // 城市名
                        "latitude": "", //城市纬度
                        "longitude": "", //城市经度
                        "destinationName": "戴高乐国际机场", // 目的地名称，城市、机场、玩乐、酒店的名称
                    },
                    {
                        "cityName": "重庆", // 城市名
                        "latitude": "", //城市纬度
                        "longitude": "", //城市经度
                        "destinationName": "江北国际机场", // 目的地名称，城市、机场、玩乐、酒店的名称
                    },
                    {
                        "cityName": "巴黎", // 城市名
                        "latitude": "", //城市纬度
                        "longitude": "", //城市经度
                        "destinationName": "戴高乐国际机场", // 目的地名称，城市、机场、玩乐、酒店的名称
                    },
                    {
                        "cityName": "卡沙", // 城市名
                        "latitude": "", //城市纬度
                        "longitude": "", //城市经度
                        "destinationName": "巴黎中心 Domenico's 法式餐厅", // 目的地名称，城市、机场、玩乐、酒店的名称
                    },
                    {
                        "cityName": "巴黎", // 城市名
                        "latitude": "", //城市纬度
                        "longitude": "", //城市经度
                        "destinationName": "巴黎中心埃菲尔铁塔诺富特酒店", // 目的地名称，城市、机场、玩乐、酒店的名称
                    },
                ],
                "image": "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2492876497,1625400592&fm=26&gp=0.jpg",
                "stay": ["巴黎中心埃菲尔铁塔诺富特酒店", "巴黎中心埃菲尔铁塔诺富特酒店"], // 住宿
                // 行程亮点
                "bright": "这里曾是奥匈帝国的势力前沿，曾是周边塞尔维亚人民的宗教、文化政治中心。如今，当历史的光环逐渐褪去，留下精美古典建筑，和一份久违的祥和清静。斯雷姆斯基卡尔洛夫奇Sremski Karlovci，作为塞尔维亚著名的产酒地，又被亲切地称为“红酒小镇”。午后我们来到这里，在小镇中兜兜转转，去探访喜欢的建筑，或是找一家中意的咖啡馆坐着放空...这个下午，在这里慢慢逛慢慢走。"
            },
            "list": [
                {   // 当天行程某个节点
                    "arriveMethod": "",// 上个地点到此的交通方式,wallk/car。是否有需要用多种方式
                    "distance": "222", // 上个地点据此距离，单位km
                    "transportType": "aircraft", // 交通方式,步行wallk、包车charteredBus、飞机aircraft、欧铁train
                    "transfer": 1, // 始发站是否是中转站(0否，1是)
                    "charteredType": "4", // 包车方式,1司导包车，2包大车, 4不包车
                    "startCityName": "重庆", // 起点城市名
                    "startStationName": "江北国际机场",// 起飞机场名
                    "startStationBuilding": "T2", // 出发站航站楼
                    "startTime": new Date(), //起点出发时间，精确到分
                    "startLat": "123", //终点纬度
                    "startLng": "11", //终点经度
                    "endCityName": "巴黎", //终点城市名
                    "endTime": "", //终点到达时间，精确到分
                    "endLat": "", //终点纬度
                    "endLng": "", //终点经度
                    "arriveStationName": "戴高乐国际机场",// 终点机场名
                    "arriveStationBuilding": "T3", // 到达站航站楼
                    "miles": "502.88", // 路程数，单位千米
                    "flightInfo": "四川航空 3u8633",// 航班信息
                    "costPricePer": "", // 成本价
                    "offerPricePer": "", // 对外报价
                    "tripPlanId": "", // 行程计划ID
                    "id": "", // 行程计划大交通ID
                    "routes": [ "江北国际机场", "戴高乐国际机场" ], // 行程
                },
                {
                    "arriveMethod": "wallk",// 上个地点到此的交通方式,wallk/car。是否有需要用多种方式
                    "distance": 0, // 上个地点据此距离，单位km
                    "transportType": "charteredBus",
                    "transfer": 1, // 始发站是否是中转站(0否，1是)
                    "charteredType": "1", // 包车方式,1司导包车，2包大车, 4不包车
                    "startCityName": "重庆", // 起点城市名
                    "startStationName": "江北国际机场",// 起飞机场名
                    "startTime": "", //起点出发时间，精确到分
                    "startLat": "", //终点纬度
                    "startLng": "", //终点经度
                    "endCityName": "巴黎", //终点城市名
                    "endTime": "", //终点到达时间，精确到分
                    "endLat": "", //终点纬度
                    "endLng": "", //终点经度
                    "endAirport": "江北国际机场",// 终点机场名
                    "miles": "502.88", // 路程数，单位千米
                    "busSeatings": 30, // 包车座位数
                    "id": "", // 行程计划包车ID
                    "locationId": "", // 包车区域id
                    "routes": ["巴黎戴高乐国际机场ｔ2e", "尼斯安吉丽娜甜品店", "馨乐庭戛纳克罗阿塞特酒店"], // 行驶路线
                },
                {
                    "costPricePer": "", // 成本价
                    "offerPricePer": "", // 对外报价 
                    "id": "", // 行程计划资源ID
                    "resourceId": "", // 资源ID
                    "resourceType": "FOOD", // 餐厅FOOD，门票ATTRACTIONS，特色体验CHARACTERISTIC_EXPERIENCE, 酒店HOTEL,购物SHOPPING,交通枢纽TRAFFIC
                    "poiId": "", // POI ID
                    "productId": "", // 产品ID
                    "latitude": "", //资源地址纬度
                    "longitude": "", //资源地址经度
                    "resourceName": "巴黎中心 Domenico's 法式餐厅",//资源名称
                    "img":"https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2492876497,1625400592&fm=26&gp=0.jpg",
                    "extraInfo": { //每种资源的扩展信息(json)
                        "describle":"位于东京品川，周边交通十分便捷，步行至品川站只需2分钟，搭乘京急线到羽田空港(东京国际机场）最快只需13分钟。入住于此，您的东京之行便可轻松开始。 东京品川王子酒店由主楼、东楼、Annex楼和北楼四栋主要建筑组成，主楼和Annex楼下拥有众多小店可供您购物与观光，而位于主楼37层的景观餐厅可以欣赏到海天一线的东京湾，是您不可错过的景致。同时，酒店还提供一个两层楼规模的保龄球中心、室内游泳池、网球场、高尔夫场等休闲设施，满足您多元化的需求。值得一提的是，东京品川王子大饭店还设有电影院和水族馆的酒店，包括10家电影院、1家巨型电影院、1家剧场以及1家水族馆。丰富多彩的娱乐项目非常适合家庭出行。 同时酒店新设中文专用礼宾服务台--你好DESK，为中国旅客提供贴心服务。 东京品川王子大饭店舒适的3000余间客房，加上尽善尽美的设施与服务，定能给予每一位下榻于此的宾客舒适的住宿体验和一段温馨而美好的回忆。"
                    },
                    "cityName": "卡沙",
                    "address" : "Sonnemannstdasse 20 60314 Frankfurt am Main",
                },
                {
                    "costPricePer": "", // 成本价
                    "offerPricePer": "", // 对外报价 
                    "id": "", // 行程计划资源ID
                    "resourceId": "", // 资源ID
                    "resourceType": "HOTEL", // 餐厅FOOD，门票ATTRACTIONS，特色体验CHARACTERISTIC_EXPERIENCE, 酒店HOTEL,购物SHOPPING,交通枢纽TRAFFIC
                    "poiId": "", // POI ID
                    "productId": "", // 产品ID
                    "latitude": "", //资源地址纬度
                    "longitude": "", //资源地址经度
                    "resourceName": "巴黎中心埃菲尔铁塔诺富特酒店",//资源名称
                    "extraInfo": {
                        "address" : "Sonnemannstdasse 20 60314 Frankfurt am Main",
                        "describle":"位于东京品川，周边交通十分便捷，步行至品川站只需2分钟，搭乘京急线到羽田空港(东京国际机场）最快只需13分钟。入住于此，您的东京之行便可轻松开始。 东京品川王子酒店由主楼、东楼、Annex楼和北楼四栋主要建筑组成，主楼和Annex楼下拥有众多小店可供您购物与观光，而位于主楼37层的景观餐厅可以欣赏到海天一线的东京湾，是您不可错过的景致。同时，酒店还提供一个两层楼规模的保龄球中心、室内游泳池、网球场、高尔夫场等休闲设施，满足您多元化的需求。值得一提的是，东京品川王子大饭店还设有电影院和水族馆的酒店，包括10家电影院、1家巨型电影院、1家剧场以及1家水族馆。丰富多彩的娱乐项目非常适合家庭出行。 同时酒店新设中文专用礼宾服务台--你好DESK，为中国旅客提供贴心服务。 东京品川王子大饭店舒适的3000余间客房，加上尽善尽美的设施与服务，定能给予每一位下榻于此的宾客舒适的住宿体验和一段温馨而美好的回忆。"
                    }, //每种资源的扩展信息(json)
                    "img":"https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2492876497,1625400592&fm=26&gp=0.jpg",
                    "cityName": "卡沙",
                    "address" : "Sonnemannstdasse 20 60314 Frankfurt am Main",
                }
            ],
        },
        {
            "overview": { //当天概览
                "date": new Date(), // 日期
                "routesImage": "", // 路线图
                "destinations": [ // 路线列表
                    {
                        "cityName": "重庆", // 城市名
                        "latitude": "", //城市纬度
                        "longitude": "", //城市经度
                        "destinationName": "江北国际机场", // 目的地名称，城市、机场、玩乐、酒店的名称
                    },
                    {
                        "cityName": "巴黎", // 城市名
                        "latitude": "", //城市纬度
                        "longitude": "", //城市经度
                        "destinationName": "戴高乐国际机场", // 目的地名称，城市、机场、玩乐、酒店的名称
                    },
                    {
                        "cityName": "重庆", // 城市名
                        "latitude": "", //城市纬度
                        "longitude": "", //城市经度
                        "destinationName": "江北国际机场", // 目的地名称，城市、机场、玩乐、酒店的名称
                    },
                    {
                        "cityName": "巴黎", // 城市名
                        "latitude": "", //城市纬度
                        "longitude": "", //城市经度
                        "destinationName": "戴高乐国际机场", // 目的地名称，城市、机场、玩乐、酒店的名称
                    },
                    {
                        "cityName": "卡沙", // 城市名
                        "latitude": "", //城市纬度
                        "longitude": "", //城市经度
                        "destinationName": "巴黎中心 Domenico's 法式餐厅", // 目的地名称，城市、机场、玩乐、酒店的名称
                    },
                    {
                        "cityName": "巴黎", // 城市名
                        "latitude": "", //城市纬度
                        "longitude": "", //城市经度
                        "destinationName": "巴黎中心埃菲尔铁塔诺富特酒店", // 目的地名称，城市、机场、玩乐、酒店的名称
                    },
                ],
            },
            "list": [
                {   // 当天行程某个节点
                    "arriveMethod": "",// 上个地点到此的交通方式,wallk/car。是否有需要用多种方式
                    "distance": "", // 上个地点据此距离，单位km
                    "transportType": "aircraft", // 交通方式,步行wallk、包车charteredBus、飞机aircraft、欧铁train
                    // charteredType: "", // 包车方式
                    "transfer": 1, // 始发站是否是中转站(0否，1是)
                    "startCityName": "重庆", // 起点城市名
                    "startStationName": "江北国际机场",// 起飞机场名
                    "startStationBuilding": "T2", // 出发站航站楼
                    "startTime": new Date(), //起点出发时间，精确到分
                    "startLat": "123", //终点纬度
                    "startLng": "11", //终点经度
                    "endCityName": "巴黎", //终点城市名
                    "endTime": "", //终点到达时间，精确到分
                    "endLat": "", //终点纬度
                    "endLng": "", //终点经度
                    "arriveStationName": "戴高乐国际机场",// 终点机场名
                    "arriveStationBuilding": "T3", // 到达站航站楼
                    "miles": "502.88", // 路程数，单位千米
                    "flightInfo": "四川航空 3u8633",// 航班信息
                    "costPricePer": "", // 成本价
                    "offerPricePer": "", // 对外报价
                    "tripPlanId": "", // 行程计划ID
                    "id": "", // 行程计划大交通ID
                    "routes": [ "江北国际机场", "戴高乐国际机场" ], // 行程
                },
                {
                    "arriveMethod": "wallk",// 上个地点到此的交通方式,wallk/car。是否有需要用多种方式
                    "distance": 0, // 上个地点据此距离，单位km
                    "transportType": "charteredBus",
                    "charteredType": "1", // 包车方式,1司导包车，2包大车, 4不包车
                    "startCityName": "重庆", // 起点城市名
                    "startAirport": "江北国际机场",// 起飞机场名
                    "startTime": "", //起点出发时间，精确到分
                    "startLat": "", //终点纬度
                    "startLng": "", //终点经度
                    "endCityName": "巴黎", //终点城市名
                    "endTime": "", //终点到达时间，精确到分
                    "endLat": "", //终点纬度
                    "endLng": "", //终点经度
                    "endAirport": "江北国际机场",// 终点机场名
                    "miles": "502.88", // 路程数，单位千米
                    "busSeatings": 30, // 包车座位数
                    "id": "", // 行程计划包车ID
                    "locationId": "", // 包车区域id
                    "routes": [["巴黎戴高乐国际机场ｔ2e", "尼斯安吉丽娜甜品店", "馨乐庭戛纳克罗阿塞特酒店"]], // 行驶路线，城市名
                },
                {
                    "costPricePer": "", // 成本价
                    "offerPricePer": "", // 对外报价 
                    "id": "", // 行程计划资源ID
                    "resourceId": "", // 资源ID
                    "resourceType": "FOOD", // 餐厅FOOD，门票ATTRACTIONS，特色体验CHARACTERISTIC_EXPERIENCE, 酒店HOTEL,购物SHOPPING,交通枢纽TRAFFIC
                    "poiId": "", // POI ID
                    "productId": "", // 产品ID
                    "latitude": "", //资源地址纬度
                    "longitude": "", //资源地址经度
                    "resourceName": "巴黎中心 Domenico's 法式餐厅",//资源名称
                    "extraInfo": "", //每种资源的扩展信息(json)
                    "cityName": "卡沙",
                    "address" : "Sonnemannstdasse 20 60314 Frankfurt am Main",
                },
                {
                    "costPricePer": "", // 成本价
                    "offerPricePer": "", // 对外报价 
                    "id": "", // 行程计划资源ID
                    "resourceId": "", // 资源ID
                    "resourceType": "HOTEL", // 餐厅FOOD，门票ATTRACTIONS，特色体验CHARACTERISTIC_EXPERIENCE, 酒店HOTEL,购物SHOPPING,交通枢纽TRAFFIC
                    "poiId": "", // POI ID
                    "productId": "", // 产品ID
                    "latitude": "", //资源地址纬度
                    "longitude": "", //资源地址经度
                    "resourceName": "巴黎中心埃菲尔铁塔诺富特酒店",//资源名称
                    "extraInfo": "", //每种资源的扩展信息(json)
                    "cityName": "卡沙",
                    "address" : "Sonnemannstdasse 20 60314 Frankfurt am Main",
                }
            ],
        },
    ]
}