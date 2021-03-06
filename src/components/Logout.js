import { Link } from 'react-router-dom';
import styles from '../styles/Logout.module.css';
import firebase from "firebase/app";
import "firebase/auth";

const Logout = () => {
    firebase.auth().signOut().then(() => {
        // sign out successful
    }).catch((error) => {
        console.log(error);
    });

    return (
        <div className={styles.centered}>
            <div className={styles.text}>
                <h2>You're now logged out!</h2>
                <div className={styles.linkdiv}>
                    <Link to="/" className={styles.link}>Return to home</Link>
                </div>
                <div className={styles.linkdiv}>
                    <Link to="/login" className={styles.link}>Log back in</Link>
                </div>
            </div>
        </div>
    );
}
 
export default Logout
