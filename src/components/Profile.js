import styles from '../styles/Profile.module.css';

const Profile = ({ stats }) => {
    return (
        <div className={styles.middle}>
            <h1 className={styles.username}>AlvGreat</h1>
            
            <div className={styles.cols}>
                <div>
                    <h2>Fastest Speed: {stats.wpm} wpm</h2>
                    <h2>Average Speed: {stats.avgWpm} wpm</h2>
                    <h2>Games Played: {stats.gamesPlayed} games</h2>
                </div>
                <div>
                    <h2>Average Accuracy: {stats.avgAccuracy}%</h2>
                    <h2>Date Joined: {stats.joinDate}</h2>
                </div>
            </div>
        </div>
    );
}
 
export default Profile;