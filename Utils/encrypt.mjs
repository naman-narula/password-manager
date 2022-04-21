import {createCipheriv,createDecipheriv,randomBytes} from 'crypto'
const IV_LENGTH = 16
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

/// Encrypt
const Crypto = {};

Crypto.encrypt = (text) => {
    let iv = randomBytes(IV_LENGTH);
    let cipher = createCipheriv('aes256',ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
Crypto.decrypt = (encryptedPassword)=> {
    let textParts = encryptedPassword.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = createDecipheriv('aes256',ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

export default Crypto;
