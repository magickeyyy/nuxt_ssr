/*
 * @Author: magckeyyy
 * @Date: 2019-10-28 19:28:51
 * @Description: 
 * @Attention: 
 */
export const formatNumber =  {
    filters: {
        mixin_f_formatNumber(v, format = 'x.', n = 2) {
            if(!v) return '';
            if(typeof v === 'string') v = v.trim() * 1;
            if(typeof v !== 'number') return '数据格式错误';
            v = (v * 1).toFixed(n);
            switch (format) {
                case 'x,xxx.xx':
                    return v.toString().replace(/(\d{1,3})(?=((\d{3}))+(\.\d*)?$)/g,'$&,')
                default:
                    return v;
            }
        }
    },
    methods: {
        mixin_m_formatNumber(v, format = 'x.', n = 2) {
            if(!v) return '';
            if(typeof v === 'string') v = v.trim() * 1;
            if(typeof v !== 'number') return '数据格式错误';
            v = v.toFixed(n);
            switch (format) {
                case 'x,xxx.xx':
                    return v.toString().replace(/(\d{1,3})(?=((\d{3}))+(\.\d*)?$)/g,'$&,')
                default:
                    return v;
            }
        }
    }
}