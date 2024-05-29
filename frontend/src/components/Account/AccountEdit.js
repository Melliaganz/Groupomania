import React, { useState } from "react";
import { useParams } from "react-router-dom";
import api from '../../_utils/api/api'; // Import the Axios instance
import { getEmailFromCrypto, REGEX } from "../../_utils/auth/auth.functions";
import { userModified } from "../../_utils/toasts/users";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const EditAccount = ({ ...account }) => {
  const { id } = useParams();
  const [emailValue, setEmailValue] = useState(getEmailFromCrypto(account.email));
  const [firstnameValue, setFirstnameValue] = useState(account.name);
  const [surnameValue, setSurnameValue] = useState(account.surname);
  const [imageUrlValue, setImageUrlValue] = useState(account.imageUrl);
  const [files, setFiles] = useState(null);

  const handleChange = (e) => {
    setImageUrlValue(URL.createObjectURL(e.target.files[0]));
    setFiles(e.target.files[0]);
  };

  const SendData = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("image", files);
    data.append("name", firstnameValue);
    data.append("surname", surnameValue);

    try {
      const response = await api.put(`/auth/account/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        userModified();
        account.onPost();
      }
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  return (
    <div className="col-11 mb-3">
      <div className="card bg-transparent">
        <div className="card-header">
          <div className="justify-content-between align-items-center">
            <div className="justify-content-between align-items-center">
              <div className="ml-2">
                <img src={account.imageUrl} alt="" className="profilePic"/>
                <div className="h5 m-0">@{account.name}</div>
                <div className="h7 text-muted">{account.name} {account.surname}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <h2 className="h5 card-title text-center">Modifier le profil</h2>

          <form onSubmit={SendData} encType="multipart/form-data">
            <div className="form-group">
              <label htmlFor="nom">Nom</label>
              <input
                id="nom"
                name="nom"
                type="text"
                className="form-control"
                placeholder="Nom"
                pattern={REGEX.NAME_REGEX}
                value={firstnameValue}
                required
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
                placeholder="Prénom"
                pattern={REGEX.SURNAME_REGEX}
                value={surnameValue}
                required
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
                placeholder="Enter email"
                value={emailValue}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="inputButton"></label>
              <input
                accept="image/*"
                className="mt-4"
                id="select-image"
                name="image"
                type="file"
                onChange={handleChange}
                multiple={false}
              />
              <p>
                <img src={imageUrlValue} alt="" className="Preview" />
              </p>
            </div>
            <button type="submit" className="btn btn-primary">
              <ManageAccountsIcon /> Modifier 
            </button>
          </form>
        </div>
        <div className="card-footer"></div>
      </div>
    </div>
  );
};

export default EditAccount;
