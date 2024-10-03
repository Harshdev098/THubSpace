import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/login.css'

export default function Login(props) {
    const [email,setemail]=useState(null)
    const [password,setpassword]=useState(null)
    const handleLogin=async(e)=>{
        e.preventDefault()
        console.log(email,password)
        props.loginAuth(email,password)
    }

    return (
        <>
            <div className="container">
                <div className="image">
                    <img src="images/logo.png" alt="" />
                </div>
                {props.LoginStatus.message && <div id='box2' style={{backgroundColor: props.LoginStatus.status===true ? "#d4edda" : "#f8d7da",color: props.LoginStatus.status===true ? "#155724" : "#721c24"}}>{props.LoginStatus.message} {props.LoginStatus.username}</div>}
                <div className="form">
                    <form className='loginForm' onSubmit={handleLogin}>
                        <h2>Login</h2>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" placeholder="Enter your email" onChange={(e)=>{setemail(e.target.value)}} required />
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" placeholder="Enter your password" onChange={(e)=>{setpassword(e.target.value)}} required />
                        <a href="">Forgot Password?</a>
                        <button type="submit" id="loginBtn">Login</button>
                        <div className="register">
                            <p>Haven't Register?&nbsp;</p><Link to="/signup">Register Now</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
