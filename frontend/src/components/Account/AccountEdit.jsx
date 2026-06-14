import React, { useState } from "react";
import { useParams } from "react-router-dom";
import api from '../../_utils/api/api';
import { getEmailFromCrypto, REGEX } from "../../_utils/auth/auth.functions";
import { userModified } from "../../_utils/toasts/users";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useI18n } from "../../_utils/i18n/I18nContext";

const EditAccount = ({ ...account }) => {
  const { t } = useI18n();
  const { id } = useParams();
  const [emailValue] = useState(getEmailFromCrypto(account.email));
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
        headers: { 'Content-Type': 'multipart/form-data' },
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
    <div className="card mb-3">
      <div className="card-header">
        <div className="post-author">
          <img src={imageUrlValue} alt={`${account.name} ${account.surname}`} className="profilePic" />
          <span className="post-author-meta">
            <span className="post-author-name">@{account.name}</span>
            <span className="post-author-sub">{account.name} {account.surname}</span>
          </span>
        </div>
      </div>
      <div className="card-body">
        <h2 className="h5 card-title text-center mb-3">{t("account.editTitle")}</h2>

        <form onSubmit={SendData} encType="multipart/form-data">
          <div className="form-group mb-2">
            <label htmlFor="nom">{t("account.name")}</label>
            <input
              id="nom"
              name="nom"
              type="text"
              className="form-control"
              pattern={REGEX.NAME_REGEX}
              value={firstnameValue}
              required
              onChange={(event) => setFirstnameValue(event.target.value)}
            />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="prenom">{t("account.surname")}</label>
            <input
              id="prenom"
              name="prenom"
              type="text"
              className="form-control"
              pattern={REGEX.SURNAME_REGEX}
              value={surnameValue}
              required
              onChange={(event) => setSurnameValue(event.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="email">{t("account.email")}</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              value={emailValue}
              readOnly
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="select-image" className="d-block mb-2">{t("account.changePhoto")}</label>
            <input
              accept="image/*"
              id="select-image"
              name="image"
              type="file"
              onChange={handleChange}
              multiple={false}
            />
            <div className="mt-3">
              <img src={imageUrlValue} alt="" className="Preview" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            <ManageAccountsIcon /> {t("account.save")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAccount;
