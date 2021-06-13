import styles from '../styles/TypingTest.module.css';
import { useState, useEffect, useRef } from 'react';
import TypingStats from './TypingStats';

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

// get the actual typing tests
const cppTests = require("../data/cpptests.json");
//const javaTests = require("../data/javatests.json");

// return a random code snippet for the user to type
const getRandText = () => {
    return cppTests.tests[Math.floor(Math.random() * cppTests.tests.length)];
}

const TypingTest = () => {
    const isMountedRef = useRef(null);

    // keep track of a user's data using the same object as the one stored in Firebase
    const [firebaseData, setFirebaseData] = useState(null);

    // store all other data to be used on the page in a separate object
    const [typingPageData, setTypingPageData] = useState({
        test: getRandText(),
        chIndex: 0, 
        startTime: null, 
        displayMsg: "",
        gameWpm: 0, 
        gameMistakes: 0
    });

    // generate a new test with random text and reset variables
    const resetPageData = () => {
        setTypingPageData({
            test: getRandText(),
            chIndex: 0, 
            startTime: null, 
            displayMsg: "",
            gameWpm: 0, 
            gameMistakes: 0
        });
    }

    // turn each letter into a span
    const letterSpans = (typingPageData.test).split('').map((char, index) => {
        if(index < typingPageData.chIndex) {
            return (<span className={styles.done} key={index}>{char}</span>);
        }
        // the letter that the user is at will be highlighted
        else if(index === typingPageData.chIndex) {
            return (<span className={styles.cursor} key={index}>{char}</span>)
        }
        return (<span key={index}>{char}</span>);
    });

    const calculateWpm = () => {
        // calculate the gap in milliseconds between the current time and start time
        const currentTime = new Date();
        let msGap = currentTime - typingPageData.startTime;
        
        // make sure the msGap is not 0 to avoid divide by 0 error
        if(msGap === 0) msGap = 1; 

        // based on the time that the user has taken and the current character index, update the wpm
        const currentCpm = (typingPageData.chIndex / msGap) * 1000 * 60.0;
        const currentWpm = currentCpm / 5.0;
        
        setTypingPageData(prevState => ({
            ...prevState, 
            gameWpm: currentWpm
        }));
    }

    // return the user's accuracy based on the typing page data 
    const getAccuracy = () => {
        // fix divide by 0 error
        if(typingPageData.chIndex + typingPageData.gameMistakes === 0) return 100;

        return (100 * typingPageData.chIndex) / (typingPageData.chIndex + typingPageData.gameMistakes)
    }

    // this function updates the firebaseData variable as well as writes the data to Firebase 
    const updateFirebaseData = () => {
        let newData;

        // if there was previously no data
        if(!firebaseData) {
            newData = {
                avgOverallAcc: getAccuracy(),
                avgOverallWpm: typingPageData.gameWpm,
                gamesPlayed: 1,
                pastGamesAcc: [getAccuracy()],
                pastGamesWpm: [typingPageData.gameWpm],
                topWpm: typingPageData.gameWpm
            };
        }
        else {
            let newPastWpm = [...firebaseData.pastGamesWpm];
            let newPastAcc = [...firebaseData.pastGamesAcc];

            // if the arrays are already at 10 games, then remove the first element of each
            if(firebaseData.pastGamesWpm.length >= 10) {
                newPastWpm.shift();
                newPastAcc.shift();
            }

            // add the newest data to the end of the arrays
            newPastWpm.push(typingPageData.gameWpm);
            newPastAcc.push(getAccuracy());

            // if there is currently data, update accordingly
            setFirebaseData(prevState => {
                // weigh the old overall stats and add the next stats in
                newData = {
                    avgOverallAcc: (prevState.avgOverallAcc * prevState.gamesPlayed + getAccuracy()) / (prevState.gamesPlayed + 1),
                    avgOverallWpm: (prevState.avgOverallWpm * prevState.gamesPlayed + typingPageData.gameWpm) / (prevState.gamesPlayed + 1),
                    gamesPlayed: prevState.gamesPlayed + 1,
                    pastGamesAcc: newPastAcc,
                    pastGamesWpm: newPastWpm,
                    topWpm: Math.max(prevState.topWpm, typingPageData.gameWpm)
                }

                return newData;
            });

            writeUserData(newData);
        }
    }
    
    // read the user's data when they first open the page/if they switch user profiles
    const readUserData = () => {
        firebase.auth().onAuthStateChanged(user => {
            // if the component is no longer mounted, don't continue
            if(!isMountedRef.current) return;

            // if the user is logged in (!= null), then fetch data from Firebase
            if(user != null) {
                // to get the user's data, we get their firebase ref using "/" their user ID
                let firebaseUserRef = firebase.database().ref('/' + user.uid);

                // fetch user's old data 
                firebaseUserRef.once('value', snapshot => {
                    // once again, check to make sure that the component is still mounted
                    if(isMountedRef.current) {
                        const data = snapshot.val();

                        // if there is data, then save it to the firebaseData variable
                        if(data != null) {
                            setFirebaseData(data);

                            setTypingPageData(prevState => ({
                                ...prevState, 
                                displayMsg: ""
                            }));
                        }
                        else {
                            // if the user doesn't have any data, tell them to play some games
                            setTypingPageData(prevState => ({
                                ...prevState, 
                                displayMsg: "Play some games to track your progress!"
                            }));
                        }
                    }
                })
            }  
            else {
                // if the user isn't logged in
                setTypingPageData(prevState => ({
                    ...prevState, 
                    displayMsg: "Note: You must create an account to track and save your progress!"
                }));
            }
        });
    }

    // writes the new stats to Firebase
    const writeUserData = (newData) => {
        const user = firebase.auth().currentUser;

        // if they're logged in, then we can write data, otherwise tell user to create an account
        if(user != null) {
            // make sure our component is still mounted
            if(isMountedRef.current) {
                // add new data to the database
                firebase.database().ref('/' + user.uid).set(newData);
            }
        }  
        else {
            setTypingPageData(prevState => ({
                ...prevState, 
                displayMsg: "Create an account to save your progress!"
            }));
        }
    }

    // function for handling when a user presses a key
    const handleKeyDown = ({ key }) => {
        // if the user hits Esc, restart the typing test
        if(key === "Escape") {
            resetPageData();
        }

        // make sure the user is not already done with the test
        if(typingPageData.chIndex >= (typingPageData.test).length) return;

        // if the user hits a character, save the time with a Date object
        if(key.length === 1 && typingPageData.startTime === null) {
            setTypingPageData(prevState => ({
                ...prevState, 
                startTime: new Date()
            }));
        }

        // if the user types the correct key, move the chIndex up
        if(key === typingPageData.test[typingPageData.chIndex]) {
            setTypingPageData(prevState => ({
                ...prevState,
                chIndex: prevState.chIndex + 1
            }));

            // calculate/update the user's wpm 
            calculateWpm();

            // if the user is done with the test, update the firebase data
            if(typingPageData.chIndex === typingPageData.test.length - 1) {
                updateFirebaseData();
            }
        }
        // if they typed some other valid character, then it's wrong
        else if(key.length === 1) {
            setTypingPageData(prevState => ({
                ...prevState,
                gameMistakes: prevState.gameMistakes + 1
            }));
        }
        
        // if the user hits backspace, move the chIndex back
        if(key === "Backspace") {
            setTypingPageData(prevState => ({
                ...prevState,
                chIndex: prevState.chIndex - 1
            }));
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    });

    useEffect(() => {
        isMountedRef.current = true;

        readUserData();

        return () => {
            isMountedRef.current = false; 
        }
    }, []);

    return (
        <div className={styles.typing}>
            <div>
                {letterSpans}
                <div className={styles.buttons}>
                    {<div onClick={resetPageData} className={styles.startBtn}>Next Test</div>}
                </div>
            </div>
            <TypingStats 
                accuracy={getAccuracy()} 
                firebaseData={firebaseData} 
                pageData={typingPageData} 
            />
        </div>
    );
}

export default TypingTest;