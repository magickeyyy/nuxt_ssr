/*
 * @Author: magckeyyy
 * @Date: 2019-10-29 20:02:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-18 18:40:46
 * @Description: filter和methords大部分相同
 * @Attention: 使用字符串生成时间有兼容性问题，只用YMD可以是/new Date("2019-11-08")/new Date("2019/11/08")等，
 *             但是如果要加时分秒且是字符串，间隔符必须用/，且必须精确到分钟级以上，时分秒以":"隔开即new Date("2019/11/08/12:")/
 *             new Date("2019/11/08 12:")。
 *             不同格式生成的Date.valueof()可能会有意外：new Date(2019,2,1)new Date(2019,2)得到的是2019-2-1 0:00:000,
 *             new Date('2019/2/1')或new Date('2019-2-1')或new Date('2019-02-1')得到的是2019-2-1 8:00:000，Firefox、Chrome
 */


export const formatDate = {
    filters: {
        mixin_f_formatDate(v, type = 'xxxx-xx-xx') {
            if(!v) return '';
            let time = new Date(v);
            let y = time.getFullYear();
            let m = time.getMonth() + 1 + '';
            m = m.length === 1 ? ('0' + m) : m;
            let d = time.getDate() + '';
            d = d.length === 1 ? ('0' + d) : d;
            switch (type) {
                case 'xxxx-xx-xx xx:xx':
                    let h1 = time.getHours();
                    if (h1 < 10) h1 = '0' + h1;
                    let mi1 = time.getMinutes();
                    if (mi1 < 10) mi1 = '0' + mi1;
                    return y + '-' + m + '-' + d + ' ' + h1 + ':' + mi1;
                case 'xxxx-xx-xx xx:xx:xx':
                    let h2 = time.getHours();
                    if (h2 < 10) h2 = '0' + h2;
                    let mi2 = time.getMinutes();
                    if (mi2 < 10) mi2 = '0' + mi2;
                    let ms2 = time.getSeconds();
                    if (ms2 < 10) ms2 = '0' + ms2;
                    return y + '-' + m + '-' + d + ' ' + h2 + ':' + mi2 + ':' + ms2;
                case 'xxxx-xx-xx()':
                    let w = time.getDay();
                    let arr = ['日', '一', '二', '三', '四', '五', '六'];
                    return y + '-' + m + '-' + d + '(周' + arr[w] + ')';
                case 'xxxx年xx月xx日':
                    return y + '年' + m + '月' + d + '日';
                case 'xxxx年xx月':
                    return y + '年' + m + '月';
                case 'xxxx-xx':
                    return y + '-' + m;
                case 'xx-xx':
                    return m + '-' + d;
                default:
                    return y + '-' + m + '-' + d;
            }
        },
    },
    methods: {
        mixin_m_formatDate(v, type = 'xxxx-xx-xx') {
            if (!v) return '';
            let time = new Date(v);
            let y = time.getFullYear();
            let m = time.getMonth() + 1 + '';
            m = m.length === 1 ? ('0' + m) : m;
            let d = time.getDate() + '';
            d = d.length === 1 ? ('0' + d) : d;
            switch (type) {
                case 'xxxx-xx-xx xx:xx':
                    let h1 = time.getHours();
                    if (h1 < 10) h1 = '0' + h1;
                    let mi1 = time.getMinutes();
                    if (mi1 < 10) mi1 = '0' + mi1;
                    return y + '-' + m + '-' + d + ' ' + h1 + ':' + mi1;
                case 'xxxx-xx-xx xx:xx:xx':
                    let h2 = time.getHours();
                    if (h2 < 10) h2 = '0' + h2;
                    let mi2 = time.getMinutes();
                    if (mi2 < 10) mi2 = '0' + mi2;
                    let ms2 = time.getSeconds();
                    if (ms2 < 10) ms2 = '0' + ms2;
                    return y + '-' + m + '-' + d + ' ' + h2 + ':' + mi2 + ':' + ms2;
                case 'xxxx年xx月xx日':
                    return y + '年' + m + '月' + d + '日';
                case 'xxxx年xx月':
                        return y + '年' + m + '月';
                case 'xxxx-xx-xx()':
                    let w = time.getDay();
                    let arr = ['日', '一', '二', '三', '四', '五', '六'];
                    return y + '-' + m + '-' + d + ' ( 周' + arr[w] + ' )';
                case 'xxxx-xx':
                    return y + '-' + m;
                case 'xx-xx':
                    return m + '-' + d;
                // 当月1号Date
                case 'date01':
                    return new Date(y, m);
                default:
                    return y + '-' + m + '-' + d;
            }
        },
    },
};
