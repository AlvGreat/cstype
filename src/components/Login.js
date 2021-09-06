import styles from '../styles/LoginSignup.module.css';
import { useHistory, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import firebase from "firebase/app";
import "firebase/auth";

const Login = () => {
    const isMountedRef = useRef(null);
    const email = useRef("");
    const password = useRef("");
    const [errorMessage, setErrorMessage] = useState(null);

    // provide a function to return to the homepage
    const history = useHistory();    
    const returnHome = () => {    
        history.push("/");
    }

    const handleSubmit = (e) => {
        // prevent default actions of a form
        e.preventDefault();

        // sign in user using firebase
        firebase.auth().signInWithEmailAndPassword(email.current.value, password.current.value)
            .then((userCredential) => {    
                // if the page is still mounted, return to the homepage
                if(isMountedRef.current) returnHome(); 
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
    
    return (
        <div>
            <form onSubmit={handleSubmit} className={styles.login}>
                <h2 className={styles.title}>Welcome back!</h2>
                <div className={styles.inputField}>
                    <i className="fas fa-envelope"></i>
                    <input type="text" placeholder="Email" ref={email}/>
                </div>
                <div className={styles.inputField}>
                    <i className="fas fa-lock"></i>
                    <input type="password" placeholder="Password" ref={password}/>
                </div>
                <Link to="/resetpassword" className={styles.smallLink}>Forgot Password?</Link>
                <h3 className={styles.errorMsg}>{errorMessage}</h3>
                <input type="submit" value="Login" className={styles.btn}/>
            </form>
        </div>
    );
}

export default Login;