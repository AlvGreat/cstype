import styles from '../styles/LoginSignup.module.css';
import { Redirect } from 'react-router-dom';
import { useState } from 'react';

import firebase from "firebase/app";
import "firebase/auth";

const Signup = () => {
    let [returnToHome, setReturnToHome] = useState(false);
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [username, setUsername] = useState("");
    let [errorPage, setErrorPage] = useState(false);
    let [errorMessage, setErrorMessage] = useState(null);

    const updateEmail = (e) => {
        setEmail(e.target.value);
    }

    const updatePassword = (e) => {
        setPassword(e.target.value);
    }

    const updateUsername = (e) => {
        setUsername(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {     
            user.updateProfile({
                displayName: username
            }).catch(() => {
                // fail
            })
            
            const user = userCredential.user;
            console.log(user);
            setReturnToHome(true);
        }).catch((error) => {
            if(error.code === "auth/weak-password") {
                setErrorMessage("Weak password, please try again.");
            }
            console.log(error.code);
            console.log(error.message);
            setErrorPage(true);
        });
    }

    if(errorPage) {
        return <Redirect to='error'/>
    }
    else if(returnToHome) {
        return <Redirect to='/' />
    }

    return (
        <div className={styles.center}>
            <form onSubmit={handleSubmit} className={styles.login}>
                <h2 className={styles.title}>Sign up to track your progress!</h2>
                <div className={styles.inputField}>
                    <i className="fas fa-user"></i>
                    <input type="text" placeholder="Username" onChange={updateUsername}/>
                </div>
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
 
export default Signup;