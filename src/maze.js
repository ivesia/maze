const MD5 = require('md5.js');
const punycode = require('punycode');
const URL = require('url-parse');
const publicsuffix = require('@alphatr/publicsuffix');

const generator = require('./generator');

const getSuffixDomain = function getSuffixDomain(link) {
    const url = new URL(link);
    const hostname = punycode.toUnicode(punycode.toASCII(url.hostname || link));
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
