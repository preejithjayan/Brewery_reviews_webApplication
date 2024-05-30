// App.js
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
// import BreweryDetails from './pages/BreweryDetails';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import Brew from '../pages/Brew'
import RouteContainer from './RouteContainer';
import AuthRoute from './AuthRoute';
import PrivateRoute from './PrivateRoute';

export default function Router() {
  return (
    <BrowserRouter>
        <Routes>
          <Route Component={RouteContainer}>
            <Route exact path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/brew/:id" element={<PrivateRoute><Brew /></PrivateRoute>} />
            <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          </Route>
        </Routes>
    </BrowserRouter>
  );
}
