import styles from '../styles/LoginSignup.module.css';
import { Redirect } from 'react-router-dom';
import { useState } from 'react';

import firebase from "firebase/app";
import "firebase/auth";

const Login = () => {
    let [returnToHome, setReturnToHome] = useState(false);
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [errorPage, setErrorPage] = useState(false);

    const updateEmail = (e) => {
        setEmail(e.target.value);
    }

    const updatePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {     
                const user = userCredential.user;
                console.log(user);
                setReturnToHome(true);
            })
            .catch((error) => {
                console.log(error.code);
                console.log(error.message);
                setErrorPage(true);
            })
    }

    if(errorPage) {
        return <Redirect to='error'/>
    }
    if(returnToHome) {
        return <Redirect to='/' />
    }
    
    return (
        <div className={styles.center}>
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
                <input type="submit" value="Login" className={styles.btn}/>
            </form>
        </div>
    );
}

export default Login;