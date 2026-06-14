import React from 'react';
import { useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import SettingsIcon from '@mui/icons-material/Settings';
import functions from '../../_utils/_functions';
import {
  getEmailFromCrypto,
  deleteAccount,
  logout,
} from '../../_utils/auth/auth.functions';
import { userDeleted } from '../../_utils/toasts/users';
import { useI18n } from "../../_utils/i18n/I18nContext";

const Account = ({ ...account }) => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (window.confirm(t("account.confirmDelete"))) {
      try {
        await deleteAccount(account.id);
        userDeleted();
        if (account.isAdmin) {
          account.onDeletedAccount();
          navigate(`/account/${account.id}`);
        } else {
          await logout();
          account.onLogout();
          navigate('/');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <div className="post-author">
          <img src={account.imageUrl} alt={`${account.name} ${account.surname}`} className="profilePic" />
          <span className="post-author-meta">
            <span className="post-author-name">@{account.name}</span>
            <span className="post-author-sub">{account.name} {account.surname}</span>
          </span>
        </div>
      </div>
      <div className="card-body">
        <div className="post-time mb-3">
          {t("account.memberSince", { date: functions.convertDateForHuman(account.createdAt, lang) })}
        </div>

        <h2 className="h5 card-title">{t("account.info")}</h2>
        <p className="card-text">{t("account.name")} : {account.name}</p>
        <p className="card-text">{t("account.surname")} : {account.surname}</p>
        <p className="card-text">{t("account.email")} : {getEmailFromCrypto(account.email)}</p>
      </div>
      {account.canEdit && (
        <div className="card-footer">
          <a href={`/account/${account.id}/edit`} className="action-btn">
            <SettingsIcon fontSize="small" /> {t("account.edit")}
          </a>
          <a href="/" className="action-btn danger ms-auto" onClick={handleDeleteAccount}>
            <ClearIcon fontSize="small" /> {t("account.delete")}
          </a>
        </div>
      )}
    </div>
  );
};

export default Account;
