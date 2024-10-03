import React, { useState } from 'react'
import { userCreation } from '../Services/UserAuth'
import { Link } from 'react-router-dom'

export default function Signup() {
    const [username,setUsername]=useState(null)
    const [name,setname]=useState(null)
    const [SignupStatus,setSignupStatus]=useState({status:false,message:""})
    const [email,setemail]=useState(null)
    const [password,setpassword]=useState(null)
    const handleUsercreation=async(e)=>{
        e.preventDefault()
        const response=await userCreation(name,email,password,username)
        setSignupStatus({status:response.status,message:response.message})
    }
  return (
    <>
        <div className="container">
        <div className="image">
            <img src="images/logo.png" alt=""/>
        </div>
        {SignupStatus.message && <div id='box2' style={{backgroundColor: SignupStatus.status===true ? "#d4edda" : "#f8d7da",color: SignupStatus.status===true ? "#155724" : "#721c24"}}>{SignupStatus.message}</div>}
        <div className="form" id="login">
            <form id="registrationForm" className='loginForm' onSubmit={handleUsercreation}>
                <h2>Registration</h2>
                <label htmlFor="name">Username:</label>
                <input type="text" id="username" name="username" placeholder="Enter the Username" onChange={(e)=>{setUsername(e.target.value)}} required/>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" placeholder="Enter the Name" onChange={(e)=>{setname(e.target.value)}} required/>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="Enter the email" onChange={(e)=>{setemail(e.target.value)}} required/>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" placeholder="Enter the Password" onChange={(e)=>{setpassword(e.target.value)}} required/>
                <button type="submit" id="submitBtn">Register</button>
                <Link to="/login">Login here</Link>
            </form>
        </div>
    </div>
    </>
  )
}
