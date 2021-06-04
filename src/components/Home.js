import styles from '../styles/Home.module.css';
import { useHistory } from 'react-router-dom';

const Home = () => {
    // use the useHistory function from react-router-dom in order to change to a different page
    const history = useHistory();

    const routeChange = () => {    
        // redirect to the practice page
        history.push("/practice");
    }

    return (
        <div className={styles.home}>
            <div className={styles.middle}>
                <h1>Programming typing practice for the Computer Science field.</h1>
                <button onClick={routeChange} className={styles.button}>practice</button>

                <h4><i className="fab fa-github"></i> Contribute to the <a href="https://github.com/AlvGreat/first-react-app" target="_blank" rel='noreferrer'>open source project!</a></h4>
                <h5><i className="fab fa-discord"></i> Created by AlvGreat, @alv#3519</h5>
            </div>
        </div>
    );
}
 
export default Home;