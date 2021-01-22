import { Link } from 'react-router-dom';
import styles from './Navbar.module.css'

const Navbar = ({ isLoggedIn }) => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}> 
                <Link to="/" style={{textDecoration: "none"}}>
                    <h1>CS</h1><h2>type</h2>
                </Link>
            </div>
            <div className={styles.navLinks}>
                {isLoggedIn && <Link to="/profile">Profile</Link>}
                {isLoggedIn && <Link>Log Out</Link>}
                {!isLoggedIn && <Link>Log In / Sign Up</Link>}
            </div>
        </nav>
    );
}
 
export default Navbar;