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
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}
function isLogged() {
  const loggedIn = getCookie("groupomania");
  console.log("groupomania cookie value:", loggedIn); // Ajoutez ce log pour déboguer
  return loggedIn === "true";
}

function getIdFromCookie() {
  const groupomaniaId = getCookie("groupomaniaId");
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
