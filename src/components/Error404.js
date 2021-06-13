import styles from '../styles/Error404.module.css';
import { Link } from 'react-router-dom';

const Error = () => {
    return (
        <div className={styles.center}>
            <h1>Error 404</h1>
            <h2>This page can't be found... but maybe you can create it! </h2>
            <h2>Contribute to the website <a href="https://github.com/AlvGreat/cstype" target="_blank" rel='noreferrer'>here</a></h2>
            <h2>or return to the <Link to="/">home page</Link></h2>
            <i className="fas fa-rocket"></i>
        </div>
    );
}
 
export default Error;