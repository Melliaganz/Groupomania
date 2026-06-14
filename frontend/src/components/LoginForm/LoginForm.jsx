import React, { useEffect, useState } from "react";
import logo from "../../images/icon-above-font-transparent.webp";
import { isLogged } from "../../_utils/auth/auth.functions";
import { userConnected } from "../../_utils/toasts/users";
import LoginIcon from '@mui/icons-material/Login';
import api from '../../_utils/api/api';
import { useI18n } from "../../_utils/i18n/I18nContext";

const LoginForm = ({ onLogin, navigate }) => {
  const { t } = useI18n();
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
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('groupomania', 'true');
        localStorage.setItem('groupomaniaId', response.data.userId);

        onLogin();
        navigate("/");
        userConnected();
      } else {
        setError(t("common.error"));
      }
    } catch (error) {
      setLoading(false);
      setError(t("common.error"));
      console.log(error);
    }
  };

  return (
    <div className="card auth-card mx-auto">
      <img className="card-img-top" src={logo} alt="Groupomania" />
      <div className="card-body">
        <h1 className="h5 card-title text-center mb-3">{t("login.title")}</h1>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <form onSubmit={sendData}>
          <div className="form-group mb-2">
            <label htmlFor="email">{t("login.email")}</label>
            <input
              name="email"
              type="email"
              className="form-control"
              id="email"
              placeholder={t("login.emailPlaceholder")}
              required
              value={emailValue}
              onChange={(event) => setEmailValue(event.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">{t("login.password")}</label>
            <input
              name="password"
              type="password"
              className="form-control"
              id="password"
              placeholder={t("login.passwordPlaceholder")}
              required
              value={passwordValue}
              onChange={(event) => setPasswordValue(event.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? t("login.loading") : <><LoginIcon /> {t("login.submit")}</>}
          </button>
        </form>
        <p className="text-center text-muted mt-3 mb-0">
          {t("login.noAccount")} <a href="/signup">{t("login.signupLink")}</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
