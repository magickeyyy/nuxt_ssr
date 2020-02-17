export default function parse_cookie(cookie='') {
    let arr = cookie.split(';');
    let obj = {};
    arr.map(v => {
        let kv = v.split('=').map(v => {
            v = v.trim();
            return v;
        });
        obj[kv[0]] = kv[1];
    })
    return obj;
}