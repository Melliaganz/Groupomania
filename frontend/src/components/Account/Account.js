import functions from "../../_utils/_functions";
import ClearIcon from '@mui/icons-material/Clear';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  getEmailFromCrypto,
  deleteAccount,
  logout,
} from "../../_utils/auth/auth.functions";
import { userDeleted } from "../../_utils/toasts/users";
import { useNavigate } from "react-router-dom";

const Account = ({ ...account }) => {
  const navigate = useNavigate();

  const onClickDeleteAccount = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this account?")) {
      if (account.isAdmin) {
        deleteAccount(account.id);
        userDeleted();
        account.onDeletedAccount();
        navigate(`/account/${account.id}`);
      } else {
        deleteAccount(account.id);
        logout();
        userDeleted();
        account.onLogout();
        navigate("/");
      }
    }
  };

  return (
    <div className="col-11 mb-3">
      <div className="card bg-transparent">
        <div className="card-header">
          <div className="justify-content-between align-items-center">
            <div className="justify-content-between align-items-center">
              <div className="ml-2">
                <img src={account.imageUrl} alt="" className="profilePic"></img>
                <div className="h5 m-0">@{account.name}</div>
                <div className="h7 text-muted">
                  {account.name} {account.surname}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="text-muted h7 mb-2">
            {" "}
            <i className="fa fa-clock-o" />
            {" Membre depuis le " +
              functions.convertDateForHuman(account.createdAt)}
          </div>

          <h2 className="h5 card-title">Informations:</h2>
          <p className="card-text">Nom : {account.name}</p>
          <p className="card-text">Prénom: {account.surname}</p>
          <p className="card-text">
            Email: {getEmailFromCrypto(account.email)}
          </p>
        </div>
        <div className="card-footer">
          {account.canEdit === true && (
            <a
              href={"/account/" + account.id + "/edit"}
              className="card-link text-danger"
            >
              <span className="supprimer "><SettingsIcon/>Modifier</span> 
            </a>
          )}
          {account.canEdit === true && (
            <a
              href="/"
              className="card-link text-danger"
              onClick={onClickDeleteAccount}
            >
              <span className="supprimer "><ClearIcon/>Supprimer</span> 
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
