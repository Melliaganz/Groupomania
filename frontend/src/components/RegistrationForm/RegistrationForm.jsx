import React, { useState } from "react";
import logo from "../../images/icon-above-font-transparent.webp";
import { userRegistered } from "../../_utils/toasts/users";
import { REGEX } from "../../_utils/auth/auth.functions";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import api from "../../_utils/api/api";
import { useI18n } from "../../_utils/i18n/I18nContext";

const RegistrationForm = ({ onLogin, navigate }) => {
  const { t } = useI18n();
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [firstnameValue, setFirstnameValue] = useState("");
  const [surnameValue, setSurnameValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post('/auth/signup', {
        name: firstnameValue,
        surname: surnameValue,
        email: emailValue,
        password: passwordValue,
      });

      setLoading(false);
      if (response.status === 201) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('groupomania', 'true');
        localStorage.setItem('groupomaniaId', response.data.userId);

        userRegistered();
        onLogin();
        navigate("/");
      } else {
        setError(t("common.error"));
      }
    } catch (error) {
      setLoading(false);
      setError(t("common.error"));
      console.error(error);
    }
  };

  return (
    <div className="card auth-card mx-auto">
      <img className="card-img-top" src={logo} alt="Groupomania" />
      <div className="card-body">
        <h1 className="h5 card-title text-center mb-3">{t("register.title")}</h1>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <form onSubmit={sendData}>
          <div className="form-group mb-2">
            <label htmlFor="nom">{t("register.name")}</label>
            <input
              id="nom"
              name="nom"
              type="text"
              className="form-control"
              placeholder={t("register.namePlaceholder")}
              value={firstnameValue}
              required
              pattern={REGEX.NAME_REGEX}
              onChange={(event) => setFirstnameValue(event.target.value)}
            />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="prenom">{t("register.surname")}</label>
            <input
              id="prenom"
              name="prenom"
              type="text"
              className="form-control"
              placeholder={t("register.surnamePlaceholder")}
              value={surnameValue}
              required
              pattern={REGEX.SURNAME_REGEX}
              onChange={(event) => setSurnameValue(event.target.value)}
            />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="email">{t("register.email")}</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              aria-describedby="emailHelp"
              placeholder={t("register.emailPlaceholder")}
              value={emailValue}
              required
              onChange={(event) => setEmailValue(event.target.value)}
            />
            <small id="emailHelp" className="form-text text-muted">{t("register.emailHelp")}</small>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">{t("register.password")}</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              placeholder={t("register.passwordPlaceholder")}
              value={passwordValue}
              required
              pattern={REGEX.PASSWORD_REGEX}
              onChange={(event) => setPasswordValue(event.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? t("register.loading") : <><SaveAltIcon /> {t("register.submit")}</>}
          </button>
        </form>
        <p className="text-center text-muted mt-3 mb-0">
          {t("register.hasAccount")} <a href="/login">{t("register.loginLink")}</a>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
