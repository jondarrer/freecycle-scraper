require('../types');
  
/**
 * @class Get cookie/cookies helper methods
 */
class CookieHelper {
    /**
     * Gets the cookies from a response
     * @param {import('./types').Response} response 
     * @returns {Array<import('./types').Cookie>}
     */
    static getCookies(response) {
        let cookies = [];

        cookies = response.headers['set-cookie'].map(str => {
            return CookieHelper.getCookie(str);
        });
        return cookies;
    }

    /**
     * Parses the str as a Cookie
     * @param {string} str 
     * @returns {import('./types').Cookie}
     */
    static getCookie(str) {
        let cookie = {};

        str.split(';').forEach(pair => {
            let keyAndValue = pair.split('=');
            keyAndValue[0] = keyAndValue[0].trim();
            if (['domain', 'path', 'expires'].indexOf(keyAndValue[0]) === -1) {
                cookie.name = keyAndValue[0];
                cookie.value = keyAndValue[1];
            } else {
                cookie[keyAndValue[0]] = keyAndValue[1];
            }
        });

        return cookie;
    }
}

export default CookieHelper;
const getCookies = CookieHelper.getCookies;
export { getCookies };
  