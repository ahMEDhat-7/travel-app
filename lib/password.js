"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
var crypto_1 = require("crypto");
var ALGORITHM = 'aes-256-gcm';
var IV_LENGTH = 16;
var SALT_LENGTH = 32;
var TAG_LENGTH = 16;
var ITERATIONS = 100000;
var ENCRYPTION_KEY = (_a = process.env.NEXTAUTH_SECRET) !== null && _a !== void 0 ? _a : (function () {
    throw new Error('NEXTAUTH_SECRET environment variable is required. Please set it in .env.local');
})();
function getKey(salt) {
    return crypto_1.default.pbkdf2Sync(ENCRYPTION_KEY, salt, ITERATIONS, 32, 'sha256');
}
function hashPassword(password) {
    var salt = crypto_1.default.randomBytes(SALT_LENGTH);
    var key = getKey(salt);
    var iv = crypto_1.default.randomBytes(IV_LENGTH);
    var cipher = crypto_1.default.createCipheriv(ALGORITHM, key, iv);
    var encrypted = Buffer.concat([cipher.update(password, 'utf8'), cipher.final()]);
    var tag = cipher.getAuthTag();
    return salt.toString('hex') + ':' + iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted.toString('hex');
}
function verifyPassword(password, hash) {
    try {
        var parts = hash.split(':');
        if (parts.length !== 4)
            return false;
        var salt = Buffer.from(parts[0], 'hex');
        var iv = Buffer.from(parts[1], 'hex');
        var tag = Buffer.from(parts[2], 'hex');
        var encrypted = Buffer.from(parts[3], 'hex');
        var key = getKey(salt);
        var decipher = crypto_1.default.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);
        var decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString('utf8') === password;
    }
    catch (_a) {
        return false;
    }
}
