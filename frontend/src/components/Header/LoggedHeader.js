import logo from "../../images/icon.png";
import { logout } from "../../_utils/auth/auth.functions";
import { getIdFromCookie } from "../../_utils/auth/auth.functions";
import { useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatIcon from '@mui/icons-material/Chat';

const LoggedHeader = ({ onLogout }) => {
  const idFromCookie = getIdFromCookie();
  const navigate = useNavigate();

  const onClickLogout = (e) => {
    e.preventDefault();
    logout();
    onLogout();
    navigate("/");
  };

  return (
    <header className="container-fluid p-0">
      <nav className="d-flex align-items-center navbar-expand-lg justify-content-between px-5">
        <a className="navbar-brand" href="/">
          <img src={logo} width={80} height={80} alt="logo of the company Groupomania" />
        </a>

        <div>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              <MenuIcon /> Menu
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="/"> <ChatIcon /> Fil d'actualité</Dropdown.Item>
              <Dropdown.Item href={"/account/" + idFromCookie}> <PersonIcon /> Mon Compte</Dropdown.Item>
              <Dropdown.Item href={"/account/" + idFromCookie + "/edit/"}> <ManageAccountsIcon /> Modifier Profil </Dropdown.Item>
              <Dropdown.Item href="/login" onClick={onClickLogout}> <LogoutIcon />Se Deconnecter</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </nav>
    </header>
  );
};

export default LoggedHeader;
