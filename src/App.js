import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './views/Home';
import Config from './views/Config';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Switch>
            <Route exact path="/"> <Home /> </Route>
            <Route exact path="/6266cce0ef33ccc8cdae-config"> <Config /> </Route>
          </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

