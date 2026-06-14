import logo from "../../images/icon-left-font.png";
import Dropdown from 'react-bootstrap/Dropdown';
import LoginIcon from '@mui/icons-material/Login';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "../../_utils/i18n/I18nContext";

const Header = () => {
  const { t } = useI18n();

  return (
    <header className="app-topbar">
      <a href="/" aria-label={t("common.appName")}>
        <img src={logo} className="brand-logo" alt="Groupomania" />
      </a>

      <div className="topbar-actions">
        <LanguageSwitcher />
        <Dropdown align="end">
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            <MenuIcon /> {t("nav.connection")}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="/signup"><SaveAltIcon /> {t("nav.signup")}</Dropdown.Item>
            <Dropdown.Item href="/login"><LoginIcon /> {t("nav.login")}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
