const callAndroidIOS = function() {
    let u = navigator.userAgent;
    let app = navigator.appVersion; 
    let data = null; 
    // android终端或者uc浏览器
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    // ios终端 
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    let args = Array.prototype.slice.call(arguments);
    let fnName = args[0];
    let parameter = args[1];
    let callback = args[2];
    if (typeof parameter === 'function') {
        callback = args[1];
        parameter = null;
    }
    if(isAndroid) {
        if (window.android) {
            callback && callback(window.android[fnName](parameter));
        } else {
            alert('找不到：window.android');
        }
    } else if(isiOS) {
        if(window.webkit) {
            window.webkit.messageHandlers[fnName].postMessage(parameter);
            console.log(callback);
            if (callback) {
                // ios返回结果给移动端，response2js为约定的函数名不可更改
                window.response2js = callback;
            }
        } 
    }
};
/**
 * registerHandler 注册函数原生调用移动端
 */
const registerHandler = function() {
    let args = Array.prototype.slice.call(arguments);
    let fnName = args[0];
    let callback = args[1];
    if (typeof callback !== 'function') {
        alert('registerHandler 注册方法失败');
    }
    // 原生app返回结果给我
    window[fnName] = callback;
}

export default {
    registerHandler,
    callAndroidIOS
};
