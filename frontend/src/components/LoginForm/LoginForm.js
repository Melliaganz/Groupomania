import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import logo from "../../images/icon-above-font-transparent.webp";
import { isLogged } from "../../_utils/auth/auth.functions";
import { userConnected } from "../../_utils/toasts/users";
import LoginIcon from '@mui/icons-material/Login';

const LoginForm = ({ onLogin }) => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (history && isLogged()) {
      history.push("/");
    }
  }, [history]);

  const sendData = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: emailValue,
        password: passwordValue,
      }),
    };

    fetchApi('auth/login', null, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        Cookies.set('token', data.token, { sameSite: 'None', secure: true });
        // Set other cookies if necessary
      }
    })
    .catch(error => console.error('Login error:', error));

  return (
    <section className="row mx-auto justify-content-center">
      <div className="card bg-transparent col-11">
        <img className="card-img-top  mx-auto col-8" src={logo} alt="logo and name of the company Groupomania" />
        <div className="card-body ">
          <h2 className="h5 card-title  text-center">Se connecter</h2>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <form onSubmit={sendData}>
            <div className="form-group ">
              <label htmlFor="email">Adresse E-mail</label>
              <input
                name="email"
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                required
                value={emailValue}
                onChange={(event) => setEmailValue(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                name="password"
                type="password"
                className="form-control"
                id="password"
                placeholder="Mot de passe"
                required
                value={passwordValue}
                onChange={(event) => setPasswordValue(event.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Connexion..." : <><LoginIcon /> Se connecter</>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
