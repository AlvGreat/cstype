import styles from './App.module.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Profile from './components/Profile';
import Practice from './components/Practice';
import Login from './components/Login';
import Logout from './components/Logout';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={true}/>
        <div className="content">
          <Switch>
            <Route exact path = "/">
              <Home />
            </Route>
            <Route path="/profile">
              <Profile stats={{wpm: 138, avgWpm: 80, gamesPlayed: 18, avgAccuracy: 97.4, joinDate: "January 22nd, 2021"}}/>
            </Route>
            <Route path="/logout">
              <Logout />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/practice">
              <Practice />
            </Route>
          </Switch>
        </div>
      </div>

      
    </Router>
    
  );
}

export default App;
