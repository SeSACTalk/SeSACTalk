// https://inpa.tistory.com/entry/JS-%F0%9F%93%9A-%EC%BF%A0%ED%82%A4Cookie-%EB%8B%A4%EB%A3%A8%EA%B8%B0#%E2%91%A0_name_%EC%86%8D%EC%84%B1%EA%B3%BC_value_%EC%86%8D%EC%84%B1

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

export {setCookie, getCookie, deleteCookie}