const MD5 = require('md5.js');
const punycode = require('punycode');
const URL = require('url-parse');
const publicsuffix = require('@alphatr/publicsuffix');

const generator = require('./generator');

const getSuffixDomain = function getSuffixDomain(hostname) {
    if (/^https?:\/\//i.test(hostname)) {
        const url = new URL(hostname);
        hostname = url.hostname;
    }

    hostname = punycode.toUnicode(punycode.toASCII(hostname));
    const [result] = publicsuffix.extract(hostname);
    const resultReg = new RegExp('([^.]+\\.)?' + result.replace(/\./g, '\\.') + '$', 'i');
    return punycode.toASCII(resultReg.exec(hostname)[0]);
};

const md5 = function md5(data) {
    return new MD5().update(data).digest('hex');
};

const maze = function maze(password, link, salt) {
    const domain = getSuffixDomain(link);
    return generator(password, domain, salt);
};

module.exports = maze;
maze.md5 = md5;
maze.suffix = getSuffixDomain;
maze.punycode = punycode;
