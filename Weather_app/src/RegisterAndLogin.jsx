import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './FirebaseConfig'; 
import { useNavigate } from 'react-router-dom';
import './register.css'

const RegisterAndLogin = () => {

    const [login, setLogin] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e, type) => {
        e.preventDefault(); 

        const email = e.target.email.value;
        const password = e.target.password.value; 

        if (type === 'signIn') {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('User signed in:', user);
                    navigate('/home');
                })
                .catch((error) => {
                    window.alert('Error signing in: ' + error.message);
                });
        } else {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('User created:', user);
                    navigate('/home');
                })
                .catch((error) => {
                    window.alert('Error creating user: ' + error.message);
                    setLogin(true);
                });
        }
    };

    return (
        <div className='App'>
            <div className='row'>
                <div className={!login ? 'activeColor' : 'pointer'} onClick={() => setLogin(false)}>SignUp</div>
                <div className={login ? 'activeColor' : 'pointer'} onClick={() => setLogin(true)}>SignIn</div>
            </div>
            <h1>{login ? 'SignIn' : 'SignUp'}</h1>
            <form onSubmit={(e) => handleSubmit(e, login ? 'signIn' : 'signUp')}>
                <input className='email' name='email' type='email' placeholder='Email Address' /><br/>
                <input className='password' name='password' type='password' placeholder="Password" /><br/><br/>
                <button type='submit'>{login ? 'SignIn' : 'SignUp'}</button>
            </form>
        </div>
    );
};

export default RegisterAndLogin;
