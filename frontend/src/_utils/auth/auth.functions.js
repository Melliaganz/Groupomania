import api from "../api/api";
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

// Utilitaires pour localStorage
const getLocalStorageValue = (key) => localStorage.getItem(key);
const removeLocalStorageItem = (key) => localStorage.removeItem(key);

// Fonction pour vérifier si l'utilisateur est connecté
function isLogged() {
  const loggedIn = getLocalStorageValue('groupomania') === 'true';
  const sessionId = getLocalStorageValue('sessionId');
  const token = getLocalStorageValue('token');
  return loggedIn && sessionId && token;
}

// Fonction pour récupérer l'ID utilisateur à partir de localStorage
function getIdFromLocalStorage() {
  return getLocalStorageValue("groupomaniaId") || false;
}

// Fonction de déconnexion
const logout = async () => {
  removeLocalStorageItem("groupomania");
  removeLocalStorageItem("groupomaniaId");
  removeLocalStorageItem("sessionId");
  removeLocalStorageItem("token");

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

// Ajout de logs pour le débogage après un délai pour s'assurer que les valeurs sont bien chargées
setTimeout(() => {
  console.log('LocalStorage values:');
  console.log('groupomania:', getLocalStorageValue('groupomania'));
  console.log('groupomaniaId:', getLocalStorageValue('groupomaniaId'));
  console.log('sessionId:', getLocalStorageValue('sessionId'));
  console.log('token:', getLocalStorageValue('token'));

  console.log('isLogged:', isLogged());
  console.log('getIdFromLocalStorage:', getIdFromLocalStorage());
}, 1000);

export {
  getEmailFromCrypto,
  REGEX,
  getAccount,
  deleteAccount,
  getIdFromLocalStorage as getIdFromCookie,
  isLogged,
  logout,
};
