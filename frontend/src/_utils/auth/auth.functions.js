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

function isLogged() {
  // Définir les cookies manuellement
document.cookie = "groupomania=true; path=/; secure; samesite=none";
document.cookie = "groupomaniaId=1; path=/; secure; samesite=none";
  const loggedIn = Cookies.get("groupomania");
  console.log("groupomania cookie value:", loggedIn); // Ajoutez ce log pour déboguer
  console.log(Cookies.get)
  console.log('Cookies via js-cookie:', Cookies.get());

// Vérification individuelle des cookies

// Lire les cookies via document.cookie
console.log('Document cookies:', document.cookie);

// Lire les cookies via js-cookie
console.log('Cookies via js-cookie:', Cookies.get());

// Lire les cookies individuellement via js-cookie
console.log('groupomania:', Cookies.get('groupomania'));
console.log('groupomaniaId:', Cookies.get('groupomaniaId'));
console.log('sessionId:', Cookies.get('sessionId'));
console.log('token:', Cookies.get('token'));

  return loggedIn === "true";
}

function getIdFromCookie() {
  const groupomaniaId = Cookies.get("groupomaniaId");
  console.log("groupomaniaId cookie value:", groupomaniaId); // Ajoutez ce log pour déboguer
  return groupomaniaId || false;
}

const logout = async (page) => {
  Cookies.remove("groupomania");
  Cookies.remove("groupomaniaId");

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

export {
  getEmailFromCrypto,
  REGEX,
  getAccount,
  deleteAccount,
  getIdFromCookie,
  isLogged,
  logout,
};
