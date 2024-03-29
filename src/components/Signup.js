import styles from '../styles/LoginSignup.module.css';
import { useHistory } from 'react-router-dom';
import { useState, useEffect, useRef} from 'react';

import firebase from "firebase/app";
import "firebase/auth";

const Signup = () => {
    const isMountedRef = useRef(null);

    const email = useRef("");
    const password = useRef("");
    const username = useRef("");
    const [errorMessage, setErrorMessage] = useState(null);

    // provide a function to return to the homepage
    const history = useHistory();    
    const returnHome = () => {    
        history.push("/");
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(username.length < 3) {
            setErrorMessage("You must choose a username with a length of 3 characters or more.");
        }
        else {
            firebase.auth().createUserWithEmailAndPassword(email.current.value, password.current.value)
                .then((userCredential) => {     
                    // update their profile to have their username
                    userCredential.user.updateProfile({
                        displayName: username.current.value
                    }).then(() => {
                        if(isMountedRef.current) returnHome();
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

    return (
        <div>
            <form onSubmit={handleSubmit} className={styles.login}>
                <h2 className={styles.title}>Sign up to track your progress!</h2>
                <div className={styles.inputField}>
                    <i className="fas fa-user"></i>
                    <input type="text" placeholder="Username" ref={username}/>
                </div>
                <div className={styles.inputField}>
                    <i className="fas fa-envelope"></i>
                    <input type="text" placeholder="Email" ref={email}/>
                </div>
                <div className={styles.inputField}>
                    <i className="fas fa-lock"></i>
                    <input type="password" placeholder="Password" ref={password}/>
                </div>
                <h3 className={styles.errorMsg}>{errorMessage}</h3>
                <input type="submit" value="Sign Up" className={styles.btn}/>
            </form>
        </div>
    );
}
 
export default Signup;