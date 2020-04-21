import CryptoJS from 'crypto-js';

export default function isAdm(user) {    
    const bytesUserLogged = CryptoJS.AES.decrypt(user, '~insira a chave aqui~');
    const userLogged = JSON.parse(bytesUserLogged.toString(CryptoJS.enc.Utf8));
    
    if(userLogged.function === 'adm') {
        return true;
    }
    else{
        return false;
    }
}