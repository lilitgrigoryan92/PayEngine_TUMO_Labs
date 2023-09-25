import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Onboarding from './Components/Onboarding';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Onboarding} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
