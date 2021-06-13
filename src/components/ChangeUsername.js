import styles from '../styles/LoginSignup.module.css';
import centerStyles from '../styles/CenteredMessage.module.css';

import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import firebase from "firebase/app";
import "firebase/auth";

const Login = () => {
    const isMountedRef = useRef(null);
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // update username variable as user types them into form input fields 
    const updateUsername = (e) => {
        setUsername(() => e.target.value);
    }

    const handleSubmit = (e) => {
        // prevent default actions of a form
        e.preventDefault();

        const user = firebase.auth().currentUser;

        // update the user's profile to change their username
        user.updateProfile({
            displayName: username,
            }).then(() => {
                // update was successful
                setIsSubmitted(true);
            }).catch((error) => {
                // display an error if something went wrong
                if(isMountedRef.current) setErrorMessage(error.message);
        });  
    }

    useEffect(() => {
        isMountedRef.current = true; 

        // update the corresponding variable if the React component is unmounted
        return () => isMountedRef.current = false;
    }, [])
    
    // if the user has already submitted the form, then display it and direct them to the homepage
    if(isSubmitted) {
        return (
            <div className={centerStyles.center}>
                <h1>Your username has been changed!</h1>
                <h2>Check out your new profile <Link to="/profile">here</Link>!</h2>
            </div>
        )
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className={styles.login}>
                <h2 className={styles.title}>Change Username</h2>
                <div className={styles.inputField}>
                    <i className="fas fa-envelope"></i>
                    <input type="text" placeholder="New Username" onChange={updateUsername}/>
                </div>
                <h3 className={styles.errorMsg}>{errorMessage}</h3>
                <input type="submit" value="Submit" className={styles.btn}/>
            </form>
        </div>
    );
}

export default Login;