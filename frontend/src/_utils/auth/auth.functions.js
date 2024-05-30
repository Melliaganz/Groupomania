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
const getAccount = async (accountId) => {
  try {
    const response = await api.get(`auth/account/${accountId}`);
    return response;
  } catch (error) {
    console.error("Error fetching account information:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

// Function to delete user account
const deleteAccount = async (accountId) => {
  try {
    const response = await api.delete(`auth/account/${accountId}`);
    return response;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

// Debug logs to verify localStorage values
setTimeout(() => {}, 1000);

export {
  getEmailFromCrypto,
  REGEX,
  getAccount,
  deleteAccount,
  getIdFromLocalStorage as getIdFromCookie,
  isLogged,
  logout,
};
