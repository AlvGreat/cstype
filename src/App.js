//import styles from './App.module.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Profile from './components/Profile';
import TypingTest from './components/TypingTest';
import ResetPassword from './components/ResetPassword';
import Login from './components/Login';
import Logout from './components/Logout';
import Signup from './components/Signup';
import Error404 from './components/Error404';

// set up firebase
import './config/fbConfig.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/logout">
              <Logout />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/practice">
              <TypingTest />
            </Route>
            <Route path="/resetpassword">
              <ResetPassword />
            </Route>
            <Route path="*">
              <Error404 />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
