import React, { useEffect, useState } from "react";
import logo from "../../images/icon-above-font-transparent.webp";
import { isLogged } from "../../_utils/auth/auth.functions";
import { userConnected } from "../../_utils/toasts/users";
import LoginIcon from '@mui/icons-material/Login';
import api from '../../_utils/api/api'; // Import the configured axios instance

const LoginForm = ({ onLogin, navigate }) => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLogged()) {
      navigate("/");
    }
  }, [navigate]);

  const sendData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post('/auth/login', {
        email: emailValue,
        password: passwordValue,
      });
      setLoading(false);
      if (response.status === 200) {
        // Store token and user information in local storage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('groupomania', 'true');
        localStorage.setItem('groupomaniaId', response.data.userId);

        navigate("/");
        onLogin();
        userConnected();
      } else {
        setError(response.data.message || "Une erreur s'est produite");
      }
    } catch (error) {
      setLoading(false);
      setError("Une erreur s'est produite. Veuillez réessayer.");
      console.log(error);
    }
  };

  return (
    <section className="row mx-auto justify-content-center">
      <div className="card bg-transparent col-11">
        <img className="card-img-top mx-auto col-8" src={logo} alt="logo and name of the company Groupomania" />
        <div className="card-body">
          <h2 className="h5 card-title text-center">Se connecter</h2>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <form onSubmit={sendData}>
            <div className="form-group">
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
