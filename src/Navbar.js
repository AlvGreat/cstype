import { Link } from 'react-router-dom';
import './Navbar.css'

const Navbar = ({ isLoggedIn }) => {
    return (
        <nav className="navbar">
            <div className="logo"> 
                <Link to="/" style={{textDecoration: "none"}}>
                    <h1>CS</h1><h2>type</h2>
                </Link>
            </div>
            <div className="navLinks">
                {isLoggedIn && <Link to="/profile">Profile</Link>}
                {isLoggedIn && <Link>Log Out</Link>}
                {!isLoggedIn && <Link>Log In / Sign Up</Link>}
            </div>
        </nav>
    );
}
 
export default Navbar;