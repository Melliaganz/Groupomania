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

const Account = ({ ...account }) => {
  const navigate = useNavigate();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this account?')) {
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
        // Optionally show an error message to the user
      }
    }
  };

  return (
    <div className="col-11 mb-3">
      <div className="card bg-transparent">
        <div className="card-header">
          <div className="justify-content-between align-items-center">
            <div className="ml-2">
              <img src={account.imageUrl} alt="" className="profilePic" />
              <div className="h5 m-0">@{account.name}</div>
              <div className="h7 text-muted">
                {account.name} {account.surname}
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="text-muted h7 mb-2">
            <i className="fa fa-clock-o" />{' '}
            {'Membre depuis le ' + functions.convertDateForHuman(account.createdAt)}
          </div>

          <h2 className="h5 card-title">Informations:</h2>
          <p className="card-text">Nom : {account.name}</p>
          <p className="card-text">Prénom: {account.surname}</p>
          <p className="card-text">Email: {getEmailFromCrypto(account.email)}</p>
        </div>
        <div className="card-footer">
          {account.canEdit && (
            <>
              <a
                href={`/account/${account.id}/edit`}
                className="card-link text-danger"
              >
                <span className="supprimer">
                  <SettingsIcon /> Modifier
                </span>
              </a>
              <a
                href="/"
                className="card-link text-danger"
                onClick={handleDeleteAccount}
              >
                <span className="supprimer">
                  <ClearIcon /> Supprimer
                </span>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
