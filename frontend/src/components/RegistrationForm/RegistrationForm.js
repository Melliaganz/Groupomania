import React, { useState } from "react";
import logo from "../../images/icon-above-font-transparent.webp";
import { userRegistered } from "../../_utils/toasts/users";
import { REGEX } from "../../_utils/auth/auth.functions";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import api from "../../_utils/api/api"; // Import the configured axios instance

const RegistrationForm = ({ navigate }) => {
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
        // Store token and user information in local storage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('groupomania', 'true');
        localStorage.setItem('groupomaniaId', response.data.userId);

        userRegistered();
        navigate("/"); // Use the debounced navigate function passed as a prop
      } else {
        setError(response.data.message || "Une erreur s'est produite. Veuillez réessayer.");
      }
    } catch (error) {
      setLoading(false);
      setError("Une erreur s'est produite. Veuillez réessayer.");
      console.error(error);
    }
  };

  return (
    <section className="row mx-auto justify-content-center">
      <div className="card col-11 bg-transparent">
        <img
          className="card-img-top mx-auto col-8"
          src={logo}
          alt="logo of the company Groupomania"
        />
        <div className="card-body">
          <h1 className="h5 card-title text-center">S'enregistrer</h1>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <form onSubmit={sendData}>
            <div className="form-group">
              <label htmlFor="nom">Nom</label>
              <input
                id="nom"
                name="nom"
                type="text"
                className="form-control"
                placeholder="Nom ex: Dupont"
                value={firstnameValue}
                required
                pattern={REGEX.NAME_REGEX}
                onChange={(event) => setFirstnameValue(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="prenom">Prénom</label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                className="form-control"
                placeholder="Prénom ex: Damien"
                value={surnameValue}
                required
                pattern={REGEX.SURNAME_REGEX}
                onChange={(event) => setSurnameValue(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Adresse email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                aria-describedby="emailHelp"
                placeholder="Email ex: sophie@groupomania.com"
                value={emailValue}
                required
                onChange={(event) => setEmailValue(event.target.value)}
              />
              <small id="emailHelp" className="form-text text-muted">
                L'email peut être vu par les autres utilisateurs
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                placeholder="Mot de passe ( doit contenir au moins 1 chiffre)"
                value={passwordValue}
                required
                pattern={REGEX.PASSWORD_REGEX}
                onChange={(event) => setPasswordValue(event.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Enregistrement..." : <><SaveAltIcon /> S'enregistrer</>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
