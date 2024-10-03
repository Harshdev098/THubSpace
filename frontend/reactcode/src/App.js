import './css/App.css';
import AddProject from './Components/AddProject';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState,useEffect } from 'react';
import { create } from './Services/createProject';
import TeamRoutes from './TeamRoutes';
import Main from './Pages/Main';
import ViewProfile from './Components/ViewProfile';
import { SearchFunction } from './Services/SearchFunction';
import SearchResult from './Components/SearchResult';
import UserProfile from './Components/UserProfile';
import Notification from './Components/Notification'
import Whiteboord from './Components/Whiteboord';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import { loginAuth } from './Services/UserAuth'
import Home from './Pages/Home';
import MemVerification from './Pages/MemVerification';

function App() {
  const [status, setStatus] = useState({ status: null, message: "" });
  const [searchResult, setSearchResult] = useState({ ProfileResult: [], ProjResult: [] })
  const [LoginStatus, setLoginStatus] = useState({ status: false, message: null })

  // Function to handle project creation
  const handleCreateProject = async (title, desc) => {
    console.log("setted title while creating Project is: ", title);
    const statusResult = await create(title, desc);
    console.log(statusResult)
    setStatus({ status: statusResult.status, message: statusResult.message })
  };

  const SearchQuery = async (query) => { //search feature
    const result = await SearchFunction(query)
    setSearchResult({ ProfileResult: result.profileResult || [], ProjResult: result.projResult || [] })
  }

  const loginAuthentication = async (email, password) => { 
    const response = await loginAuth(email, password);
    console.log("Response from loginAuth:", response);
      console.log("Login successful, redirecting...");
      setLoginStatus({ status: response.status, message: response.message});
      setTimeout(() => {
        window.location.href = '/main';
      }, 2000);
  };
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/validate' element={<MemVerification />} />
        <Route path='/notifications' element={<Notification />} />
        <Route path='/login' element={<Login loginAuth={loginAuthentication} LoginStatus={LoginStatus} />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/' element={<Home />} />
        <Route path='/searchresult' element={<SearchResult searchResult={searchResult} />} />
        <Route path='/main' element={<Main SearchQuery={SearchQuery} />} />
        <Route path='/profile/:username' element={<UserProfile />} />
        <Route path='/viewprofile' element={<ViewProfile />} />
        <Route path='/create/project' element={<AddProject status={status} username={LoginStatus} create={handleCreateProject} />} />
        <Route path='/project/:projName/*' element={<TeamRoutes />} />
        <Route path='/whiteboard' element={<Whiteboord />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
