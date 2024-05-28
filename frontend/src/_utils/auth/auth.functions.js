import api from "../api/api.service";
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
  const allCookies = Cookies.get();
  console.log("All Cookies:", allCookies);
  const loggedIn = Cookies.get("groupomania");
  console.log("Logged in?", loggedIn);
  return loggedIn === "true";
}

function getIdFromCookie() {
  const groupomaniaId = Cookies.get("groupomaniaId");
  console.log("Groupomania ID:", groupomaniaId);
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
