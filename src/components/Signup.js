import styles from '../styles/LoginSignup.module.css';
import { Redirect } from 'react-router-dom';
import { useState, useEffect, useRef} from 'react';

import firebase from "firebase/app";
import "firebase/auth";

const Signup = () => {
    let isMountedRef = useRef(null);

    let [returnToHome, setReturnToHome] = useState(false);
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [username, setUsername] = useState("");
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

        if(username.length < 3) {
            setErrorMessage("You must choose a username longer than 3 characters");
        }
        else {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {     
                    // update their profile to set their username
                    userCredential.user.updateProfile({
                        displayName: username
                    }).then(() => {
                        if(isMountedRef.current) setReturnToHome(true);
                    })
                    .catch((error) => {
                        if(isMountedRef.current) setErrorMessage(error.message);
                    })
                }).catch((error) => {
                    // set the error message and don't let the user finish signing up
                    if(isMountedRef.current) setErrorMessage(error.message);
                });
        }
    }

    // read the user data so that they see their average when loading screen
    useEffect(() => {
        isMountedRef.current = true; 

        return () => isMountedRef.current = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(returnToHome) {
        return <Redirect to='/' />
    }

    return (
        <div>
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
                <input type="submit" value="Sign Up!" className={styles.btn}/>
            </form>
        </div>
    );
}
 
export default Signup;