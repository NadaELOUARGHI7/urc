import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux'; 
import store from './redux/store'; 

import {Login} from "./user/Login";
import {Register} from "./user/Register";  
import Dashboard from './pages/dashboard';


function App() {

  return (

    <Provider store={store}> {/* Wrap the app with Provider and pass the store */}
    <Router>
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

    </Routes>
    </Router>
    </Provider>
  );
}

export default App;
