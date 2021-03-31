import { Link } from 'react-router-dom';
import styles from '../styles/LoginSignup.module.css';
import firebase from "firebase/app";
import "firebase/auth";

const Logout = () => {
    firebase.auth().signOut().then(() => {
        // sign out successful
    }).catch((error) => {
        console.log(error);
    });

    return (
        <div className={styles.login}>
            <h2 className={styles.title}>You are now logged out!</h2>
            <Link to="/" className={styles.linkbtn}>Return to home</Link>
            <Link to="/login" className={styles.linkbtn}>Log back in</Link>
        </div>
    );
}
 
export default Logout
