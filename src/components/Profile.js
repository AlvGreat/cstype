import styles from '../styles/Profile.module.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import React from 'react';
import { Line } from 'react-chartjs-2';

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
            <div className={styles.profile}>
                <div className={styles.header}>
                    <h1 className={styles.username}>
                        {displayName}
                        <Link to="/changeusername"><i className={`fas fa-pencil-alt ${styles.icon}`}></i></Link>
                    </h1>
                    <h3 className={styles.smallStats}>User since {signupDate.toLocaleDateString()}</h3>
                    <h3 className={styles.smallStats}>Games Played: 0 games</h3>
                </div>

                <div className={`${styles.middle} ${styles.extraMargin}`}>
                    <h2>Play some games to see more stats!</h2>
                </div>
            </div>
        )
    }
    
    if(notLoggedIn) {
        return (
            <div className={styles.middle}>
                <div className={styles.header}>
                    <h3>Log in to save your profile!</h3>
                </div>
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
    
    // data/options objects for react charts
    const wpmData = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [
            {
                label: 'WPM',
                data: userData.pastGamesWpm,
                fill: false,
                backgroundColor: 'rgb(199, 133, 237)',
                borderColor: 'rgba(199, 133, 237, 0.4)',
            },
        ],
    };
    
    const accData = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [
            {
                label: 'Accuracy',
                data: userData.pastGamesAcc,
                fill: false,
                backgroundColor: 'rgb(133, 237, 154)',
                borderColor: 'rgba(133, 237, 154, 0.4)',
            },
        ],
    }

    const chartOptions = {
        responsive: true, 
        maintainAspectRatio: false,
        ticks: {
            maxTicksLimit: 6
        }
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

            <div className={styles.chart}>
                <Line data={wpmData} options={chartOptions}/>
            </div> 
            <div className={styles.chart}>
                <Line data={accData} options={chartOptions}/>
            </div> 
        </div>
    );
}
 
export default Profile;
