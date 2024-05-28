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

// Fonction pour décrypter l'email
function getEmailFromCrypto(email) {
  return CryptoJS.AES.decrypt(email, "Secret Passphrase").toString(CryptoJS.enc.Utf8);
}

// Utilitaires pour les cookies
const getCookieValue = (name) => Cookies.get(name);
const removeCookie = (name) => Cookies.remove(name, { path: '/' });

// Fonction pour vérifier si l'utilisateur est connecté
function isLogged() {
  const loggedIn = getCookieValue('groupomania') === 'true';
  const sessionId = getCookieValue('sessionId');
  const token = getCookieValue('token');
  return loggedIn && sessionId && token;
}

// Fonction pour récupérer l'ID utilisateur à partir des cookies
function getIdFromCookie() {
  return getCookieValue("groupomaniaId") || false;
}

// Fonction de déconnexion
const logout = async () => {
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

// Fonction pour obtenir les informations de compte
const getAccount = (accountId) => {
  return api.get(`auth/account/${accountId}`);
};

// Fonction pour supprimer le compte utilisateur
const deleteAccount = (accountId) => {
  return api.delete(`auth/account/${accountId}`);
};

// Ajout de logs pour le débogage après un délai pour s'assurer que les cookies sont bien chargés
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
