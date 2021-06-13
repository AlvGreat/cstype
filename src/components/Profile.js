import styles from '../styles/Profile.module.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const Profile = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [userData, setUserData] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const [signupDate, setSignupDate] = useState(null);
    const [noData, setNoData] = useState(false);
    const [notLoggedIn, setNotLoggedIn] = useState(false);

    const arrayAverage = (array) => {
        return array.reduce((a, b) => a + b) / array.length;
    }
    
    // retrieve the user's data only once
    useEffect(() => {
        // keep track of if the component is still mounted
        let mounted = true;

        // if user has logged in or out
        firebase.auth().onAuthStateChanged(user => {
            if(mounted) {
                // if signed in
                if(user) {
                    const userID = user.uid;

                    setDisplayName(user.displayName);
                    setSignupDate(new Date(user.metadata.creationTime));

                    let firebaseUserRef = firebase.database().ref('/' + userID);
                
                    // get old data 
                    firebaseUserRef.once('value', snapshot => {
                        if(mounted) {
                            // if there is data, then update the array accordingly
                            if(snapshot.val() === null) {
                                setNoData(true);
                            }
                            // update the user data for the profile
                            setUserData(snapshot.val());
                            // set that we're done loading
                            setIsLoading(false);
                        }
                    });
                }
                else {
                    setNotLoggedIn(true);
                }
            }
        })

        // make sure that we don't update React state if our component/page is unmounted
        return () => mounted = false;
    }, []); 

    if(noData) {
        return (
            <div className={styles.middle}>
                <h1 className={styles.username}>{displayName}</h1>
                <h3>You have not played any games yet!</h3>
            </div>
        )
    }
    
    if(notLoggedIn) {
        return (
            <div className={styles.middle}>
                <h3>Log in to save your profile!</h3>
            </div>
        )
    }

    if(isLoading) {
        return (
            <div className={styles.profile}>
                <h2 className={styles.loadingText}>Loading...</h2>
            </div>
        )
    }

    return (
        <div className={styles.profile}>
            <div className={styles.header}>
                <h1 className={styles.username}>
                    {displayName}
                    <Link to="/changeusername"><i className={`fas fa-pencil-alt ${styles.icon}`}></i></Link>
                </h1>
                <h3 className={styles.smallStats}>User since {signupDate.toLocaleDateString()}</h3>
                <h3 className={styles.smallStats}>Games Played: {userData.gamesPlayed} games</h3>
            </div>

            <div className={styles.cols}>
                <div>
                    <h2>Recent Avg. Speed: {arrayAverage(userData.pastGamesWpm).toFixed(2)} wpm</h2>
                    <h2>All-time Avg. Speed: {(userData.avgOverallWpm).toFixed(2)} wpm</h2>
                    <h2>Fastest Speed: {userData.topWpm.toFixed(2)} wpm</h2>
                </div>
                <div>
                    <h2>Recent Avg. Accuracy: {arrayAverage(userData.pastGamesAcc).toFixed(2)}%</h2>
                    <h2>All-time Avg. Accuracy: {(userData.avgOverallAcc).toFixed(2)}%</h2>
                </div>
            </div>
        </div>
    );
}
 
export default Profile;
