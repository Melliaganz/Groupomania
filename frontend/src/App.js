import "./App.css";
import React, { useState, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import LoggedHeader from "./components/Header/LoggedHeader";
import LoginForm from "./components/LoginForm/LoginForm";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import { isLogged } from "./_utils/auth/auth.functions";
import MessagesContainer from "./components/Messages/MessagesContainer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountContainer from "./components/Account/AccountContainer";
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MessagesCommentsContainer from "./components/Messages/MessagesCommentsContainer";
import CookieConsentement from "./components/CookieConsent/CookieConsentement";

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  const [isLoggedIn, setIsLoggedIn] = useState(isLogged());

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <React.Fragment>
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={true}
        pauseOnHover={true}
      />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CookieConsentement
          location="bottom"
          buttonText="Accepter"
          cookieName="CookieConsent"
          style={{ background: "#fd2d01" }}
          buttonStyle={{ background: "black", color: "white", fontSize: "13px" }}
          expires={150}
        >
          Cette application utilise des cookies pour améliorer l'expérience utilisateur.
        </CookieConsentement>
        {isLoggedIn ? <LoggedHeader onLogout={handleLogout} /> : <Header />}
        <main className="container-fluid">
          <Routes>
            <Route path="/" element={isLoggedIn ? <MessagesContainer messageQuery="getMessages" postMessage={true} /> : <Navigate to="/login" />} />
            <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
            <Route path="/signup" element={<RegistrationForm />} />
            <Route path="/account/:id" element={isLoggedIn ? <AccountContainer onLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="/account/:id/edit" element={isLoggedIn ? <AccountContainer onLogout={handleLogout} editor={true} /> : <Navigate to="/login" />} />
            <Route path="/messages/:id" element={isLoggedIn ? (
              <React.Fragment>
                <MessagesContainer messageQuery="getOneMessage" postComment={true} />
                <MessagesCommentsContainer commentQuery="getMessageAllComments" />
              </React.Fragment>
            ) : <Navigate to="/login" />} />
          </Routes>
        </main>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default App;
