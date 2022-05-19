import "./App.css";
import React from "react";
import {
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header/Header";
import LoggedHeader from "./components/Header/LoggedHeader";
import LoginForm from "./components/LoginForm/LoginForm";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import {isLogged} from "./_utils/auth/auth.functions";
import MessagesContainer from "./components/Messages/MessagesContainer";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountContainer from "./components/Account/AccountContainer";
import CookieConsent from "react-cookie-consent";
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MessagesCommentsContainer from "./components/Messages/MessagesCommentsContainer";

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  const [isLoggedIn, setIsLoggedIn] = useState(isLogged())
  

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  return (
    
    <React.Fragment>

      {/* Toaster componant */}
      <ToastContainer position="top-center"/>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <CookieConsent
      location="bottom"
      buttonText="Accepter"
      cookieName="myAwesomeCookieName2"
      style={{ background: "#fd2d01" }}
      buttonStyle={{ background:"black", color: "white", fontSize: "13px" }}
      expires={150}
  
      >
       Cette application utilise des cookies pour améliorer l'experience utilisateur{" "}
  
      </CookieConsent>
      {/* Header componant */}
      {isLoggedIn ? <LoggedHeader onLogout={handleLogout} /> : <Header />}
      <main className="container-fluid">
      <Switch>


        {/* Show the messagesContainer on / route */}
        <Route path="/" exact>
        {isLoggedIn ? <MessagesContainer messageQuery="getMessages" postMessage={true} />  : <Redirect to="/login" />}
        </Route>

        {/* Show rhe loginForm on /login route */}
        <Route path="/login">
          <LoginForm onLogin={handleLogin} />
        </Route>

        {/* Show the registrationForm on /signup route */}
        <Route path="/signup" component={RegistrationForm} />

        {/* Show the accountContainer on /account/:id route */}
        <Route path="/account/:id" exact>
        {isLoggedIn ? <AccountContainer onLogout={handleLogout} />: <Redirect to="/login" />}
        </Route>

        {/* Show the accountContainer with editor : true on  /account/:id/edit route */}
        <Route path="/account/:id/edit" exact>
        {isLoggedIn ? <AccountContainer onLogout={handleLogout} editor={true} />: <Redirect to="/login" />}
        </Route>

        {/* Show the messagesContainer with on messageQuery="getOneMessage" on /messages/:id route*/}
        <Route path="/messages/:id" exact>
        {isLoggedIn ? <MessagesContainer messageQuery="getOneMessage" postComment={true}/>  : <Redirect to="/login" />}
        <MessagesCommentsContainer commentQuery="getMessageAllComments"/>
        
        </Route>
      </Switch>
      </main>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default App;
