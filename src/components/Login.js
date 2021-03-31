import styles from '../styles/LoginSignup.module.css';
import { Redirect } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import firebase from "firebase/app";
import "firebase/auth";

const Login = () => {
    let isMountedRef = useRef(null);

    let [returnToHome, setReturnToHome] = useState(false);
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [errorMessage, setErrorMessage] = useState(null);

    const updateEmail = (e) => {
        setEmail(e.target.value);
    }

    const updatePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        // prevent default actions of a form
        e.preventDefault();

        // sign in user using firebase
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {     
                if(isMountedRef.current) setReturnToHome(true);
            })
            .catch((error) => {
                // set the error message and don't let the user finish logging in
                if(isMountedRef.current) setErrorMessage(error.message);
            })
    }

    useEffect(() => {
        isMountedRef.current = true; 

        // update our variable if the component is unmounted
        return () => isMountedRef.current = false;
    }, [])

    if(returnToHome) {
        return <Redirect to='/' />
    }
    
    return (
        <div>
            <form onSubmit={handleSubmit} className={styles.login}>
                <h2 className={styles.title}>Welcome back!</h2>
                <div className={styles.inputField}>
                    <i className="fas fa-envelope"></i>
                    <input type="text" placeholder="Email" onChange={updateEmail}/>
                </div>
                <div className={styles.inputField}>
                    <i className="fas fa-lock"></i>
                    <input type="password" placeholder="Password" onChange={updatePassword}/>
                </div>
                <h3 className={styles.errorMsg}>{errorMessage}</h3>
                <input type="submit" value="Login" className={styles.btn}/>
            </form>
        </div>
    );
}

export default Login;