// https://inpa.tistory.com/entry/JS-%F0%9F%93%9A-%EC%BF%A0%ED%82%A4Cookie-%EB%8B%A4%EB%A3%A8%EA%B8%B0#%E2%91%A0_name_%EC%86%8D%EC%84%B1%EA%B3%BC_value_%EC%86%8D%EC%84%B1

const setCookie = function (name, value, exp) { // Cookie 설정
    let date = new Date();
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; path=/; expires=${date.toUTCString()}; httpOnly` // TODO : SSL 추가해야함
};

const getCookie = function (name) {
    var value = document.cookie.match(`(^|;) ?'${name}=([^;]*)(;|$)`);
    return value ? value[2] : null;
};

const deleteCookie = function (name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1999 00:00:10 GMT;`;
}

export {setCookie, getCookie, deleteCookie}