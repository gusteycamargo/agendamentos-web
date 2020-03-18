import api from './api';

export const TOKEN_KEY = "@agendamentos-Token";
export const isAuthenticated = () => sessionStorage.getItem(TOKEN_KEY) !== null;


export async function isAdm () {
  const response = await api.get("/userLogged");
  if(response.data.user.function === 'adm') {
    return true;
  }

  return false;
} 

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const login = token => {
  sessionStorage.setItem(TOKEN_KEY, token);
};
export const logout = () => {
  sessionStorage.removeItem(TOKEN_KEY);
};