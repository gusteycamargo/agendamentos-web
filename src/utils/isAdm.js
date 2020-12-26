import CryptoJS from 'crypto-js';

export default function isAdm(user) {    
    const bytesUserLogged = CryptoJS.AES.decrypt(user, process.env.REACT_APP_KEY_USER);
    const userLogged = JSON.parse(bytesUserLogged.toString(CryptoJS.enc.Utf8));
    
    if(userLogged.function === 'adm') {
        return true;
    }
    else{
        return false;
    }
}