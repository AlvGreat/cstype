import styles from '../styles/Practice.module.css';
import { useState, useEffect, useRef } from 'react';

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const cppTests = require("../data/cpptests.json");
//const javaTests = require("../data/javatests.json");

const Practice = () => {
    // https://reactjs.org/docs/hooks-reference.html#useref
    // "Essentially, useRef is like a “box” that can hold a mutable value in its .current property."
    // use this to keep track of if our component gets unnmounted
    const isMountedRef = useRef(null);

    // keep track of the character index the user is on 
    let [chIndex, setChIndex] = useState(0);

    // when the user types the first key, keep track of the time
    const [startTime, setStartTime] = useState(null); 

    // tell the user to make an account to save data
    const [displayMsg, setDisplayMsg] = useState("");

    // display stats for the user
    const [wpm, setWpm] = useState(0);

    // keep track of how many mistakes the user makes
    let [inaccuracies, setInaccuracies] = useState(0);
    const [accuracyPercent, setAccuracyPercent] = useState(100);
    
    // keep track of the user's average wpm and accuracy
    const [avgWpm, setAvgWpm] = useState(0);
    const [avgAccuracy, setAvgAccuracy] = useState(0);

    // get a random code snippet for the user to type
    const getRandText = () => {
        return cppTests.tests[Math.floor(Math.random() * cppTests.tests.length)];
    }

    let [text, setText] = useState(getRandText());

    // generate a new test with random text and reset variables
    const newTest = () => {
        setStartTime(null);
        setInaccuracies(0);
        setAccuracyPercent(100);
        setWpm(0);
        setText(getRandText());
        setChIndex(0);
    }

    // turn each letter into a span, where the letter the user is at will be given a certain class
    const letterSpans = text.split('').map((char, index) => {
        if(index < chIndex) {
            return (<span className={styles.done} key={index}>{char}</span>);
        }
        else if(index === chIndex) {
            return (<span className={styles.cursor} key={index}>{char}</span>)
        }
        return (<span key={index}>{char}</span>);
    });    
    
    // returns an object containing the current wpm and accuracy
    const calculateStats = (chIndex) => {
        let endTime = new Date(); 
        const ms = endTime - startTime; 

        // based on the time that the user has taken and the current character index, update the wpm
        const currentCpm = ((chIndex + 1) / ms) * 1000 * 60.0;
        const currentWpm = currentCpm / 5.0;
        setWpm(currentWpm);

        const currentAccuracy = (100*chIndex)/(chIndex + inaccuracies)
        // fix divide by 0 error
        if(chIndex === 0 && inaccuracies > 0) setAccuracyPercent(0);
        else setAccuracyPercent(currentAccuracy);

        return { calculatedWpm: currentWpm, calculatedAccuracy : currentAccuracy };
    }

    // update the data for the wpm/accuracy averages
    const updateAveragesData = (recentSpeeds, recentAcc) => {
        if(recentSpeeds.length === 1) {
            setAvgWpm(wpm);
            setAvgAccuracy(accuracyPercent);
        } 
        else {
            // returns the average of all numbers in an array
            const average = (array) => array.reduce((a, b) => a + b) / recentSpeeds.length;
            
            let avgWpm = average(recentSpeeds);
            let avgAcc = average(recentAcc);

            setAvgWpm(avgWpm);
            setAvgAccuracy(avgAcc);
        }
    }
    
    // only reads the user data and runs to update on loading the screen
    const readUserData = () => {
        //const user = firebase.auth().currentUser;
        
        firebase.auth().onAuthStateChanged(user => {
            if(!isMountedRef.current) return;

            // if they're logged in, then fetch data from Firebase
            if(user != null) {
                const userID = user.uid;
                let firebaseUserRef = firebase.database().ref('/' + userID);

                // get old data 
                firebaseUserRef.once('value', snapshot => {
                    // check to make sure that the component is still mounted when we retrieve the data
                    if(isMountedRef.current) {
                        const oldData = snapshot.val();

                        // if there is data, then update the array accordingly
                        if(oldData != null) {
                            // update UI so user can see their average stats
                            updateAveragesData(oldData.pastGamesWpm, oldData.pastGamesAcc);
                        }
                        else {
                            // if the user doesn't have any data, tell them to play some games
                            setDisplayMsg("Play some games to track your progress!");
                        }
                    }
                })
            }  
            else {
                setDisplayMsg("Create an account to track and save your progress!");
            }
        });
        
    }

    // writes the new wpm and accuracy to Firebase
    const writeUserData = (calculatedWpm, calculatedAccuracy) => {
        const user = firebase.auth().currentUser;

        // if they're logged in, read/write data, otherwise tell user to create an account
        if(user != null) {
            const userID = user.uid;
            let firebaseUserRef = firebase.database().ref('/' + userID);

            // get old data 
            firebaseUserRef.once('value', snapshot => {
                // check to make sure that the component is still mounted when we retrieve the data
                if(isMountedRef.current) {
                    const oldData = snapshot.val();

                    let newRecentSpeeds, newRecentAcc;
                    let gamesPlayed = (oldData) ? oldData.gamesPlayed : 0;
    
                    // if there is data, then update the array accordingly
                    if(oldData != null) {
                        newRecentSpeeds = [...oldData.pastGamesWpm];
                        newRecentAcc = [...oldData.pastGamesAcc];
        
                        // if the user has more than 10 games, only save the most recent ones
                        if(oldData.pastGamesWpm.length === 10) {
                            // remove the first element (oldest game) from the beginning of the array
                            newRecentSpeeds.shift();
                            newRecentAcc.shift();
                        }
        
                        // add the most recent speed and accuracy to the end of the array
                        newRecentSpeeds.push(calculatedWpm);
                        newRecentAcc.push(calculatedAccuracy);
                    }
                    else {
                        // otherwise we make a new array of just the most recent scores
                        newRecentSpeeds = [calculatedWpm];
                        newRecentAcc = [calculatedAccuracy];
                    }
    
                    let newData = {
                        topWpm: oldData ? Math.max(oldData.topWpm, calculatedWpm) : calculatedWpm,
                        gamesPlayed: gamesPlayed + 1,  
                        // all games
                        avgOverallWpm: oldData ? (oldData.avgOverallWpm * gamesPlayed + calculatedWpm) / (gamesPlayed + 1) : calculatedWpm,
                        avgOverallAcc: oldData ? (oldData.avgOverallAcc * gamesPlayed + calculatedAccuracy) / (gamesPlayed + 1) : calculatedAccuracy,
                        // last 10 games
                        pastGamesWpm: newRecentSpeeds, 
                        pastGamesAcc: newRecentAcc,
                    }
    
                    // update UI so user can see their average stats
                    updateAveragesData(newRecentSpeeds, newRecentAcc);
    
                    // add new data to the database
                    firebase.database().ref('/' + userID).set(newData);
                }
            })
        }  
        else {
            setDisplayMsg("Create an account to save your progress!");
        }
    }

    // if the user typed the correct key
    const handleKeyDown = ({ key }) => {
        // when the user hits the first key, start the timer
        if(key.length === 1 &&  !startTime) setStartTime(new Date());

        if(chIndex < text.length) {
            // if they typed it right, move the index
            if(key === text[chIndex]) {
                setChIndex(++chIndex);
                
                // calculate the stats every time the user hits a correct key
                const { calculatedWpm, calculatedAccuracy } = calculateStats(chIndex);

                if(chIndex === text.length) {
                    writeUserData(calculatedWpm, calculatedAccuracy);
                }
            }
            else if(key === "Backspace") {
                setChIndex(--chIndex);
            }
            // if they typed some other valid character, then they typed it wrong
            else if(key.length === 1){
                setInaccuracies(inaccuracies => inaccuracies + 1);
            }
        }

        // if they hit the escape key, generate a new test
        if(key === "Escape") {
            newTest();
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        // remove event listener after component is unmounted
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }); 

    // read the user data so that they see their average when loading screen
    useEffect(() => {
        isMountedRef.current = true; 

        readUserData();

        return () => isMountedRef.current = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.typing}>
            <div>
                {letterSpans}
                <div className={styles.buttons}>
                    {<div onClick={newTest} className={styles.startBtn}>Next Test</div>}
                </div>
            </div>
            <div className={styles.stats}>
                <div>{`Speed: ${wpm.toFixed(2)} WPM`}</div>
                <div>{`Accuracy ${accuracyPercent.toFixed(2)}%`}</div>
                <div className={styles.userStats}>
                    <div>{`Avg. Speed: ${avgWpm.toFixed(2)} WPM`}</div>
                    <div>{`Avg. Accuracy: ${avgAccuracy.toFixed(2)}%`}</div>
                    <h4>{displayMsg}</h4>
                </div>
            </div>
        </div>
    );
}

export default Practice;