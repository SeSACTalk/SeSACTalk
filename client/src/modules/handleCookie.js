const setCookie = function (name, value, exp) { // Cookie 설정
    let date = new Date();
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; path=/; expires=${date.toUTCString()};` // TODO : SSL 추가해야함
};

const getCookie = function (name) {
    var value = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
    return value ? value[2] : null;
};

const deleteCookie = function (name) {
    let date = new Date();
    date.setTime(date.getTime() - 1); // 과거 시간으로 설정하여 쿠키 삭제
    document.cookie = `${name}=; path=/; expires=${date.toUTCString()}`;
};

export { setCookie, getCookie, deleteCookie }