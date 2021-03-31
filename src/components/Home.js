import styles from '../styles/Home.module.css';
import { Redirect } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
    let [practice, setPractice] = useState(false);

    const redirectPractice = () => {
        setPractice(true);
    }

    if(practice) {
        return <Redirect to='/practice' />
    }
    return (
        <div className={styles.home}>
            <div className={styles.middle}>
                <h1>Programming typing practice for the Computer Science field.</h1>
                <button onClick={redirectPractice} className={styles.button}>practice</button>

                <h4><i className="fab fa-github"></i> Contribute to the <a href="https://github.com/AlvGreat/first-react-app" target="_blank" rel='noreferrer'>open source project!</a></h4>
                <h5><i className="fab fa-discord"></i> Created by AlvGreat, @alv#3519</h5>
            </div>
        </div>
    );
}
 
export default Home;