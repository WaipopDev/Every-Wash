
export const setCookie = (name, value, expires = '', domain) => {
    const oneYearExpireDate = new Date();
    oneYearExpireDate.setFullYear(oneYearExpireDate.getFullYear() + 1);

    let expireDate = expires || oneYearExpireDate;

    if (expireDate) {
        if (expireDate instanceof Date) {
            // If it isn't a valid date
            if (Number.isNaN(expireDate.getTime())) {
                expireDate = new Date();
            }
        } else {
            expireDate = new Date((new Date().getTime()) + (parseInt(expireDate, 10) * 1000 * 60 * 60 * 24));
        }
    }

    let cookie = `${name}=${value};`;

    if (expireDate) {
        cookie += `expires=${expireDate.toGMTString()};`;
    }

    cookie += ' path=/;';

    if (domain) {
        cookie += ` domain=${domain}`;
    }

    document.cookie = cookie;
};
export const getCookie = (name) => {
    const nameEQ = `${name}=`;
    const documentCookies = document.cookie.split(';');
    const res = documentCookies.find((cookie) => {
        let cookieString = cookie;
        if (cookie.charAt(0) === ' ') {
            cookieString = cookie.substring(1, cookie.length);
        }
        return cookieString.indexOf(nameEQ) === 0;
    });

    if (res) {
        return res.split('=')[1];
    }

    return '';
};

export const deleteCookie = (name, domain = '') => {
    setCookie(name, '', new Date('1970-01-01'), domain);
};
export const setStorage = (key, data) => {
    try {
        window.localStorage.setItem(key, data);
    } catch (e) {
        setCookie(key, data);
    }
};
export const getStorage = (key) => {
    try {
        // get the data
        return window.localStorage.getItem(key);
    } catch (e) {
        return getCookie(key);
    }
};
export const deleteStorage = (key) => {
    try {
        window.localStorage.removeItem(key);
    } catch (e) {
        setCookie(key, '', -1);
    }
};
