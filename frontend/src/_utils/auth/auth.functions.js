import api from "../api/api";
import { userLogout } from "../toasts/users";
const CryptoJS = require("crypto-js");

const REGEX = {
  NAME_REGEX: "^([\\p{L}]+)([\\p{L}\\- ']*)$",
  SURNAME_REGEX: "^([\\p{L}]+)([\\p{L}\\- ']*)$",
  TITLE_REGEX: "^([\\p{L}]+)([\\p{L}\\- ',]*)$",
  PASSWORD_REGEX: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,}$",
};

// Function to decrypt email
function getEmailFromCrypto(email) {
  return CryptoJS.AES.decrypt(email, "Secret Passphrase").toString(CryptoJS.enc.Utf8);
}

// Utility functions for localStorage
const getLocalStorageValue = (key) => localStorage.getItem(key);
const removeLocalStorageItem = (key) => localStorage.removeItem(key);

// Function to check if user is logged in
function isLogged() {
  const loggedIn = getLocalStorageValue('groupomania') === 'true';
  const token = getLocalStorageValue('token');
  return loggedIn && !!token;
}

// Function to get user ID from localStorage
function getIdFromLocalStorage() {
  return getLocalStorageValue("groupomaniaId") || false;
}

// Logout function
const logout = async () => {
  removeLocalStorageItem("groupomania");
  removeLocalStorageItem("groupomaniaId");
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

// Function to get account information
const getAccount = (accountId) => {
  return api.get(`auth/account/${accountId}`);
};

// Function to delete user account
const deleteAccount = (accountId) => {
  return api.delete(`auth/account/${accountId}`);
};

// Debug logs to verify localStorage values
setTimeout(() => {
  console.log('LocalStorage values:');
  console.log('groupomania:', getLocalStorageValue('groupomania'));
  console.log('groupomaniaId:', getLocalStorageValue('groupomaniaId'));
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
