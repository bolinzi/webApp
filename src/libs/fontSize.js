/**
 * @file    动态设置fopnt-size
 * @authors 花夏 (huaxia@itoxs.com)
 * @version 1.0.0
 * @date    2017-04-24 16:52:43
 */

let fontSize = function(doc, win) {
    let docEl = doc.documentElement;
    let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    let recalc = function() {
        let clientWidth = docEl.clientWidth;
        clientWidth = Math.min(750, Math.min(window.innerWidth, document.documentElement.clientWidth));
        if (!clientWidth) {
            return;
        }
        docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
        docEl.getElementsByTagName('body')[0].style.fontSize = docEl.style.fontSize;
    };

    if (!doc.addEventListener) {
        return;
    }
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
};
export default fontSize;
