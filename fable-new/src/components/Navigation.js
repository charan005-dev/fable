import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import {AuthContext} from '../firebase/Auth';
import SignOutButton from './SignOut';
import '../App.css';

const Navigation = () => {
  const {currentUser} = useContext(AuthContext);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
  return (
    <nav className='navigation'> 
     
     <h1>F A B L E</h1>
      
     
        
          <SignOutButton /> 
      
      
    </nav>
  );
};

const NavigationNonAuth = () => {
  return (
    <nav className='navigation'>
      <h1>F A B L E</h1>
    </nav>
  );
};

export default Navigation;