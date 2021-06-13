// use styles from both the login/signup and error 404 page
import styles from '../styles/LoginSignup.module.css';
import centerStyles from '../styles/Error404.module.css';

import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import firebase from "firebase/app";
import "firebase/auth";

const Login = () => {
    const isMountedRef = useRef(null);
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // update email and password variables as user types them into form input fields 
    const updateEmail = (e) => {
        setEmail(() => e.target.value);
    }

    const handleSubmit = (e) => {
        // prevent default actions of a form
        e.preventDefault();

        // sign in user using firebase
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {    
                // email sent!
                setIsSubmitted(true);
            })
            .catch((error) => {
                // set the error message provided by Firebase and don't let the user finish logging in
                if(isMountedRef.current) setErrorMessage(error.message);
            })
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
                <h1>An email has been sent to the address you provided!</h1>
                <h2>You can return to the home page <Link to="/">here</Link>.</h2>
            </div>
        )
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className={styles.login}>
                <h2 className={styles.title}>Reset Password</h2>
                <div className={styles.inputField}>
                    <i className="fas fa-envelope"></i>
                    <input type="text" placeholder="Email" onChange={updateEmail}/>
                </div>
                <h3 className={styles.errorMsg}>{errorMessage}</h3>
                <input type="submit" value="Submit" className={styles.btn}/>
            </form>
        </div>
    );
}

export default Login;