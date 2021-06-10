import styles from '../styles/TypingStats.module.css';

const TypingStats = ({accuracy, firebaseData, pageData}) => {
    const average = (array) => array.reduce((a, b) => a + b) / array.length;

    return (
        <div>
            <div>{`Speed: ${pageData.gameWpm.toFixed(2)} WPM`}</div>
            <div>{`Accuracy: ${accuracy.toFixed(2)}%`}</div>
            <div className={styles.userStats}>
                <div>{`Avg. Speed: ${firebaseData == null ? 0 : average(firebaseData.pastGamesWpm).toFixed(2)} WPM`}</div>
                <div>{`Avg. Accuracy: ${firebaseData == null ? 0 : average(firebaseData.pastGamesAcc).toFixed(2)}%`}</div>
                <h4>{pageData.displayMsg}</h4>
            </div>
        </div>
    );
}

export default TypingStats;