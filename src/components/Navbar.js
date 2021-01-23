import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css'

const Navbar = ({ isLoggedIn }) => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}> 
                <Link to="/" style={{textDecoration: "none"}}>
                    <h1>CS</h1><h2 className={styles.logosmall}>type</h2>
                </Link>
            </div>
            <div className={styles.navLinks}>
                {isLoggedIn && <Link to="/profile">Profile</Link>}
                {isLoggedIn && <Link to="/logout">Log Out</Link>}
                {!isLoggedIn && <Link to="/login">Log In / Sign Up</Link>}
            </div>
        </nav>
    );
}
 
export default Navbar;