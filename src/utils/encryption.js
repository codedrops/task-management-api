import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.SESSION_SECRET;

export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decrypt = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};