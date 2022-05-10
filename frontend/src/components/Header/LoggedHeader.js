import logo from "../../images/icon.png";
import {logout} from "../../_utils/auth/auth.functions";
import {getIdFromCookie} from "../../_utils/auth/auth.functions";
import { useHistory } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown'
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const LoggedHeader = ({ onLogout }) => {
  const idFromCookie = getIdFromCookie();
  const history = useHistory();

  const onClickLogout = (e) => {
    e.preventDefault();
    logout();
    onLogout();
    history.push("/");
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
    <PersonIcon /> Compte
  </Dropdown.Toggle>

  <Dropdown.Menu>
    <Dropdown.Item href={"/account/" + idFromCookie}>  <PersonIcon /> Mon Compte</Dropdown.Item>
    <Dropdown.Item href="/login" onClick={onClickLogout} > <LogoutIcon />Se Deconnecter</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
        </div>
      </nav>
    </header>
  );
};

export default LoggedHeader;
