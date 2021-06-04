import styles from '../styles/Navbar.module.css'
import { Link } from 'react-router-dom';
import { useState } from 'react';

import firebase from "firebase/app";
import "firebase/auth";

const Navbar = () => {
    const [isDoneLoading, setIsDoneLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    // if user has logged in or out
    firebase.auth().onAuthStateChanged(user => {
        // when we get the data about the user being logged in or not
        setIsDoneLoading(() => true);

        // set the logged in variable depending on if firebase provided a valid user not-null object
        user ? setIsLoggedIn(true) : setIsLoggedIn(false);
    })

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}> 
                <Link to="/" style={{textDecoration: "none"}}>
                    <h1>CS</h1><h2 className={styles.logosmall}>type</h2>
                </Link>
            </div>
            <div className={styles.navLinks}>
                {(isDoneLoading && isLoggedIn) && <Link to="/profile">Profile</Link>}
                {(isDoneLoading && isLoggedIn) && <Link to="/logout">Log Out</Link>}
                {(isDoneLoading && !isLoggedIn) && <Link to="/login">Log In</Link>}
                {(isDoneLoading && !isLoggedIn) && <Link to="/signup">Sign Up</Link>}
            </div>
        </nav>
    );
}

export default Navbar;