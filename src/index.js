import React, { Component } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { store } from './store';
import Home from './components/HomeComponent';
import NewUser from './components/NewUserComponent';
import OldUser from './components/OldUserComponent';
import Admin from './components/AdminComponent';
import Player from './components/PlayerComponent';
import './resources/favicon.ico';

const render = () => ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<Switch>
		      <Route path='/' component={OldUser} exact />
		      <Route path='/signUp' component={NewUser} exact />
		      <Route path='/login' component={OldUser} exact />
		      <Route path='/admin' component={Admin} exact />
		      <Route path='/player' component={Player} exact />
		    </Switch>
		</BrowserRouter>
	</Provider>, 
	document.getElementById("mainContainer")
);

render();

console.log('INITIALLISING APPLICATION');