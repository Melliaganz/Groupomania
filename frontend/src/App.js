import "./App.css";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
import MessagesCommentsContainer from "./components/Messages/MessagesCommentsContainer"; // Corrected import
import _ from 'lodash';

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
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(isLogged());
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const debouncedNavigate = useCallback(
    _.debounce((path) => {
      navigate(path);
    }, 300), // Adjust the delay as needed
    [navigate]
  );

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
        {isLoggedIn ? <LoggedHeader onLogout={handleLogout} /> : <Header />}
        <main className="container-fluid">
          <Routes>
            <Route path="/" element={isLoggedIn ? <MessagesContainer messageQuery="getMessages" postMessage={true} /> : <Navigate to="/login" />} />
            <Route path="/login" element={<LoginForm onLogin={handleLogin} navigate={debouncedNavigate} />} />
            <Route path="/signup" element={<RegistrationForm navigate={debouncedNavigate} />} />
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
