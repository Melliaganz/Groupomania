import logo from "../../images/icon.png";
import Dropdown from 'react-bootstrap/Dropdown'
import LoginIcon from '@mui/icons-material/Login';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

const Header = () => {
  return (
    <header className="container-fluid p-0">
      <nav className="d-flex align-items-center navbar-expand-lg justify-content-between px-5">
        <a className="navbar-brand" href="/">
          <img src={logo} width={80} height={80} alt="logo of the company Groupomania" />
        </a>

        <div>
        <Dropdown>
  <Dropdown.Toggle variant="success" id="dropdown-basic">
    Connexion
  </Dropdown.Toggle>

  <Dropdown.Menu>
    <Dropdown.Item href="/signup"> <SaveAltIcon /> S'enregistrer</Dropdown.Item>
    <Dropdown.Item href="/login"><LoginIcon /> Se Connecter</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
        </div>
      </nav>
    </header>
  );
}

export default Header;
