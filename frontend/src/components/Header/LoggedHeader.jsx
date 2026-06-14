import logo from "../../images/icon-left-font.png";
import { logout, getIdFromCookie } from "../../_utils/auth/auth.functions";
import { useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatIcon from '@mui/icons-material/Chat';
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "../../_utils/i18n/I18nContext";

const LoggedHeader = ({ onLogout }) => {
  const { t } = useI18n();
  const idFromCookie = getIdFromCookie();
  const navigate = useNavigate();

  const onClickLogout = (e) => {
    e.preventDefault();
    logout();
    onLogout();
    navigate("/");
  };

  return (
    <header className="app-topbar">
      <a href="/" aria-label={t("common.appName")}>
        <img src={logo} className="brand-logo" alt="Groupomania" />
      </a>

      <div className="topbar-actions">
        <LanguageSwitcher />
        <Dropdown align="end">
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            <AccountCircleIcon /> {t("nav.menu")}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="/"><ChatIcon /> {t("nav.feed")}</Dropdown.Item>
            <Dropdown.Item href={"/account/" + idFromCookie}><PersonIcon /> {t("nav.account")}</Dropdown.Item>
            <Dropdown.Item href={"/account/" + idFromCookie + "/edit/"}><ManageAccountsIcon /> {t("nav.editProfile")}</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="/login" onClick={onClickLogout}><LogoutIcon /> {t("nav.logout")}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
};

export default LoggedHeader;
