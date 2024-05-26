import "./App.css";
import React, { useState, useMemo } from "react";
import {
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Header from "./components/Header/Header";
import LoggedHeader from "./components/Header/LoggedHeader";
import LoginForm from "./components/LoginForm/LoginForm";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import { isLogged } from "./_utils/auth/auth.functions";
import MessagesContainer from "./components/Messages/MessagesContainer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountContainer from "./components/Account/AccountContainer";
import CookieConsent from "react-cookie-consent";
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MessagesCommentsContainer from "./components/Messages/MessagesCommentsContainer";

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
      <ToastContainer position="top-center" />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CookieConsent
          location="bottom"
          buttonText="Accepter"
          cookieName="CookieConsent"
          style={{ background: "#fd2d01" }}
          buttonStyle={{ background: "black", color: "white", fontSize: "13px" }}
          expires={150}
        >
          Cette application utilise des cookies pour améliorer l'expérience utilisateur.
        </CookieConsent>
        {isLoggedIn ? <LoggedHeader onLogout={handleLogout} /> : <Header />}
        <main className="container-fluid">
          <Switch>
            <Route path="/" exact render={() => (
              isLoggedIn ? <MessagesContainer messageQuery="getMessages" postMessage={true} /> : <Redirect to="/login" />
            )} />
            <Route path="/login" render={() => (
              <LoginForm onLogin={handleLogin} />
            )} />
            <Route path="/signup" component={RegistrationForm} />
            <Route path="/account/:id" exact render={() => (
              isLoggedIn ? <AccountContainer onLogout={handleLogout} /> : <Redirect to="/login" />
            )} />
            <Route path="/account/:id/edit" exact render={() => (
              isLoggedIn ? <AccountContainer onLogout={handleLogout} editor={true} /> : <Redirect to="/login" />
            )} />
            <Route path="/messages/:id" exact render={() => (
              isLoggedIn ? (
                <React.Fragment>
                  <MessagesContainer messageQuery="getOneMessage" postComment={true} />
                  <MessagesCommentsContainer commentQuery="getMessageAllComments" />
                </React.Fragment>
              ) : <Redirect to="/login" />
            )} />
          </Switch>
        </main>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default App;
