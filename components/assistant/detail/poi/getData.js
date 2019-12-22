import { api_location, api_base, api_assistant, api_hotel, api_play } from '~/service/api';

export const getallCity = _this => {
    return _this.$axios.get(api_location.allCity, { params: { pageNo: 1, pageSize: 9999 } });
};
export const getHotelFac = _this => {
    return _this.$axios.get(api_hotel.facilities).then(res => {
        if (res.success) {
            const f = res.data.map(it => {
                return { value: it.id, label: it.name, check: false };
            });
            const data = [
                {
                    name: '每晚价格',
                    mode: 'single',
                    value: [
                        { value: '1', label: '<300' },
                        { value: '2', label: '300-500' },
                        { value: '3', label: '500-800' },
                    ],
                },
                {
                    name: '酒店等级',
                    mode: 'single',
                    value: [
                        { value: '1', label: '经济型' },
                        { value: '2', label: '三星/舒适型' },
                        { value: '3', label: '四星/高档型' },
                        { value: '4', label: '五星/豪华型' },
                    ],
                },
                {
                    name: '设施',
                    mode: 'multiple',
                    value: f,
                },
            ];
            return data;
        }
    });
};
export const getTags = (_this, type) => {
    return _this.$axios.get(api_play.tags, { params: { resourceType: type } }).then(res => {
        if (res.success) {
            return res.data.map(it => {
                let t = '';
                if (it.selectType !== 'SINGLE_SELECT') {
                    t = it.labelItems.map(ij => {
                        return { value: ij.id, label: ij.name, check: false };
                    });
                } else {
                    t = it.labelItems.map(ij => {
                        return { value: ij.id, label: ij.name };
                    });
                }
                return {
                    name: it.labelName,
                    mode: it.selectType === 'SINGLE_SELECT' ? 'single' : 'multiple',
                    value: t,
                };
            });
        }
    });
};

export const getHotelData = (_this, data) => {
    const temp = Object.keys(data);
    for (let i = 0; i++; i <= temp.length) {
        if (temp[i] === '' || temp[i] == null) {
            return false;
        }
    }
    return _this.$axios.post(api_hotel.searchHotel, data, { custom: { token: true } }).then(res => {
        if (res.success) {
            return res.data || [];
        } else {
            return undefined;
        }
    });
};

export const getPOIData = (_this, data) => {
    const temp = Object.keys(data);
    for (let i = 0; i++; i <= temp.length) {
        if (temp[i] === '' || temp[i] == null) {
            return false;
        }
    }
    return _this.$axios.get(api_assistant.search, { params: data }).then(res => {
        if (res.success) {
            return res.data || [];
        } else {
            return undefined;
        }
    });
};
export const getPlayData = (_this, data) => {
    const temp = Object.keys(data);
    for (let i = 0; i++; i <= temp.length) {
        if (temp[i] === '' || temp[i] == null) {
            return false;
        }
    }
    return _this.$axios.get(api_play.searchAll, { params: data }).then(res => {
        if (res.success) {
            return res.data || [];
        } else {
            return undefined;
        }
    });
};
