import api from './api';

export const TOKEN_KEY = "@agendamentos-Token";

export function isAuthenticated() {
  return new Promise((resolve, reject) => {
    api.get('/userLogged')
    .then(response => {
      if(response.data.user.id) {
        resolve()
      }
      else {
        reject()
      }
    })
    .catch(error => {
      reject()
    })
  })
}

//export const isAuthenticated = () => isLogged() !== false;


export async function isAdm () {
  return new Promise((resolve, reject) => {
    api.get('/userLogged')
    .then(response => {
      if(response.data.user.function === 'adm') {
        resolve()
      }
      else {
        reject()
      }
    })
    .catch(error => {
      reject()
    })
  })
} 

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const login = token => {
  localStorage.setItem(TOKEN_KEY, token);
};

export function logout() {
  return new Promise((resolve, reject) => {
    api.get('/logout')
    .then(() => {
      localStorage.removeItem('persist:root');
      resolve()
    })
    .catch(reject)
  })
}