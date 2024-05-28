import api from "../api/api";
import Cookies from "js-cookie";
import { userLogout } from "../toasts/users";
const CryptoJS = require("crypto-js");

const REGEX = {
  NAME_REGEX: "^([\\p{L}]+)([\\p{L}\\- ']*)$",
  SURNAME_REGEX: "^([\\p{L}]+)([\\p{L}\\- ']*)$",
  TITLE_REGEX: "^([\\p{L}]+)([\\p{L}\\- ',]*)$",
  PASSWORD_REGEX: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,}$",
};

function getEmailFromCrypto(email) {
  let DecryptedEmail = CryptoJS.AES.decrypt(email, "Secret Passphrase").toString(CryptoJS.enc.Utf8);
  return DecryptedEmail;
}

// Utilitaires pour les cookies
const getCookieValue = (name) => Cookies.get(name);
const removeCookie = (name) => Cookies.remove(name, { path: '/' });

function isLogged() {
  const loggedIn = getCookieValue('groupomania') === 'true';
  const sessionId = getCookieValue('sessionId');
  const token = getCookieValue('token');
  console.log('groupomania cookie value:', loggedIn);
  console.log('sessionId cookie value:', sessionId);
  console.log('token cookie value:', token);
  return loggedIn && sessionId && token;
}

function getIdFromCookie() {
  const groupomaniaId = getCookieValue("groupomaniaId");
  console.log("groupomaniaId cookie value:", groupomaniaId);
  return groupomaniaId || false;
}

const logout = async (page) => {
  removeCookie("groupomania");
  removeCookie("groupomaniaId");
  removeCookie("sessionId");
  removeCookie("token");

  try {
    const response = await api.post("auth/logout");
    if (response.status === 200) {
      userLogout();
    } else {
      console.error("Logout failed:", response.data);
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};

const getAccount = (accountId, page) => {
  return api.get(`auth/account/${accountId}`);
};

const deleteAccount = (accountId, page) => {
  return api.delete(`auth/account/${accountId}`);
};

// Ajout de logs pour le débogage
setTimeout(() => {
  console.log('Document cookies:', document.cookie);
  console.log('Cookies via js-cookie:', Cookies.get());
  console.log('groupomania:', getCookieValue('groupomania'));
  console.log('groupomaniaId:', getCookieValue('groupomaniaId'));
  console.log('sessionId:', getCookieValue('sessionId'));
  console.log('token:', getCookieValue('token'));

  console.log('isLogged:', isLogged());
  console.log('getIdFromCookie:', getIdFromCookie());
}, 1000);

export {
  getEmailFromCrypto,
  REGEX,
  getAccount,
  deleteAccount,
  getIdFromCookie,
  isLogged,
  logout,
};
