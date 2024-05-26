import fetchApi from "../api/api.service";
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
  const loggedIn = Cookies.get("groupomania");
  return loggedIn === "true";
}

function getIdFromCookie() {
  const groupomaniaId = Cookies.get("groupomaniaId");
  return groupomaniaId || false;
}

const logout = (page) => {
  Cookies.remove("groupomania");
  Cookies.remove("groupomaniaId");

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  return fetchApi("auth/logout", page, requestOptions)
    .then((response) => {
      if (response.ok) {
        userLogout();
      } else {
        return response.json().then((data) => {
          console.error("Logout failed:", data);
        });
      }
    })
    .catch((error) => console.error("Logout error:", error));
};


const getAccount = (accountId, page) => {
  const requestOptions = {
    method: "GET",
    credentials: "include",
  };
  return fetchApi(`auth/account/${accountId}`, page, requestOptions);
};

const deleteAccount = (accountId, page) => {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  return fetchApi(`auth/account/${accountId}`, page, requestOptions);
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
