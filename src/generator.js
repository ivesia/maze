const BigNumber = require('bignumber.js');
const MD5 = require('md5.js');

/**
 * 替换密码算法
 * @param  {[type]} hash  [description]
 * @param  {[type]} index [description]
 * @param  {[type]} type  [description]
 * @return {[type]}       [description]
 */
const replacePasswordChar = function replacePasswordChar(hash, index, type) {
    const charList = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', '0123456789', '~!@#$%^&*'];

    const len = charList[type].length;
    const arrayNum = hash.toString(len);

    index %= arrayNum.length;
    return charList[type].charAt(parseInt(arrayNum.charAt(index), len));
};

/**
 * 打乱密码算法
 * @param  {[type]} list [description]
 * @return {[type]}     [description]
 */
const randArray = function randArray(list) {
    const len = list.length;

    for (let i = 0; i <= len; i++) {
        for (let j = 0; j <= len - 1; j++) {
            const hash = new MD5().update(list[j] + list[j + 1]).digest('hex');
            const key1 = parseInt(hash.substr(0, 4), 16) % len;
            const key2 = parseInt(hash.substr(4, 8), 16) % len;
            if (key1 !== key2) {
                const tmp = list[key1];
                list[key1] = list[key2];
                list[key2] = tmp;
            }
        }
    }

    return list;
};

/**
 * 生成随机密码
 * @param  {[type]} password  初始密码值
 * @param  {[type]} domain 密码使用的域名
 * @param  {[type]} salt   salt 值
 * @return {String} 返回加密后的密码
 */
const generator = function generator(password, domain, salt) {
    salt = salt || '';
    password = password.toString();
    domain = domain.toLowerCase();

    const hash = new BigNumber(new MD5().update(password + domain + salt).digest('hex'), 16);
    const passwordList = password.split('') || [];
    const length = passwordList.length;
    const mazeList = new Array(length);

    // 循环替换
    for (let i = 0; i < length; i++) {
        let single = '';

        if (passwordList[i].search(/[A-Z]/) === 0) {
            single = replacePasswordChar(hash, i, 0).toUpperCase();
        } else if (passwordList[i].search(/[a-z]/) === 0) {
            single = replacePasswordChar(hash, i, 0).toLowerCase();
        } else if (passwordList[i].search(/[0-9]/) === 0) {
            single = replacePasswordChar(hash, i, 1);
        } else {
            single = replacePasswordChar(hash, i, 2);
        }

        mazeList[i] = single;
    }

    // 打乱
    return randArray(mazeList).join('');
};

module.exports = generator;
