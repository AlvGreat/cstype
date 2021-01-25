import styles from '../styles/Practice.module.css';
import { useState, useEffect } from 'react';

const Practice = () => {
    // keep track of the character index the user is on 
    let [chIndex, setChIndex] = useState(0);

    // display stats for the user
    let [wpm, setWpm] = useState(0);
    
    // keep track of how many mistakes the user makes
    let [inaccuracies, setInaccuracies] = useState(0);

    let [accuracyPercent, setAccuracyPercent] = useState(100);

    // when the user types the first key, keep track of the time
    let [startTime, setStartTime] = useState(null); 

    const getRandText = () => {
        const allTexts = [
            "for(int i = 0; i < 5; i++) {",
            "for(int i = 0; i < N; i++) {", 
            "for(int i = 0; i < nums.size(); i++) {",
            "for(int j = i; j < N; j++) {",
            "for(auto& x : str) {",
            "for(int& x : nums) {",
            "int x = 0;", 
            "int ans = 0;", 
            "ans = max(ans, v[i]);",
            "v.push_back(i);",
            "cout << ans << endl;",
            "cin >> x;",
            "for(auto& a : v) cin >> a;",
            "while(N--) {",
            "vector<int> v;",
            "unordered_map<int, int> m;",
            "void helper(vector<int>& nums, int x) {",
            "include <bits/stdc++.h>;",
        ];
        return allTexts[Math.floor(Math.random() * allTexts.length)];
    }

    let [text, setText] = useState(getRandText());

    // generate a new test with random text and reset variables
    const newTest = (e) => {
        console.log(e);

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
    
    const calculateStats = (chIndex) => {
        let endTime = new Date(); 
        const ms = endTime - startTime; 

        const currentCpm = ((chIndex + 1) / ms) * 1000 * 60.0;
        setWpm((currentCpm / 5.0).toFixed(2));

        // fix divide by 0 error
        if(chIndex === 0 && inaccuracies > 0) setAccuracyPercent(0);
        else setAccuracyPercent((100*(chIndex)/(chIndex + inaccuracies)).toFixed(2));
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
                calculateStats(chIndex);
            }
            else if(key === "Backspace") {
                setChIndex(--chIndex);
            }
            // if they typed some other valid character, then they typed it wrong
            else if(key.length === 1){
                setInaccuracies(++inaccuracies);
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

    return (
        <div className={styles.typing}>
            <div>
                {letterSpans}
                <div className={styles.buttons}>
                    {<div onClick={newTest} className={styles.startBtn}>Next Test</div>}
                </div>
            </div>
            <div className={styles.stats}>
                <div>{`Speed: ${wpm} WPM`}</div>
                <div>{`Accuracy ${accuracyPercent}%`}</div>
                <div className={styles.userStats}>
                    <div>{`Avg. Speed: -- WPM`}</div>
                    <div>{`Avg. Accuracy -- %`}</div>
                </div>
            </div>
        </div>
    );
}

export default Practice;