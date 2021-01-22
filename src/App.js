import styles from './App.module.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Profile from './Profile';

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
              <Profile />
            </Route>
          </Switch>
        </div>
      </div>

      
    </Router>
    
  );
}

export default App;
