import styles from '../styles/Home.module.css';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

const Home = () => {
    return (
        <div className={styles.home}>
            <div className={styles.middle}>
                <h1>Programming typing practice for the Computer Science field.</h1>
                <Link to="/practice">
                    <Button className={styles.button}>
                        practice
                    </Button>
                </Link>

                <h4>Contribute to the <a href="https://github.com/AlvGreat/first-react-app" target="_blank" rel='noreferrer'>open source project!</a></h4>
                <h5>Created by AlvGreat, @alv#3519</h5>
            </div>
        </div>
    );
}
 
export default Home;