import styles from '../styles/Error.module.css';
import { Link } from 'react-router-dom';

const Error = () => {
    return (
        <div className={styles.center}>
            <h1>Error 404</h1>
            <h2>This page can't be found... but maybe you can create it! </h2>
            <h2>Contribute to the <a href="https://github.com/AlvGreat/first-react-app" target="_blank" rel='noreferrer'>open source project here</a></h2>
            <h2>Or return to the <Link to="/">home page</Link></h2>
            <i className="fas fa-rocket"></i>
        </div>
    );
}
 
export default Error;