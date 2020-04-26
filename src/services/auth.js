import api from './api';

export const TOKEN_KEY = "@agendamentos-Token";
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;


export async function isAdm () {
  const response = await api.get("/userLogged");
  if(response.data.user.function === 'adm') {
    return true;
  }

  return false;
} 

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const login = token => {
  localStorage.setItem(TOKEN_KEY, token);
};
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('persist:root')
};