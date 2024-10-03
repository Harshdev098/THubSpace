import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { UserFetchProfile } from '../Services/profile';
import { useParams } from 'react-router-dom';

export default function UserProfile() { // displaying user profile to others
    const { username } = useParams()
    const [Profresult, setProfResult] = useState({ userDetails: {}, projDetails: [] });

    const profile = async () => {
        console.log("profile function called");
        const userProfile = await UserFetchProfile(username);
        console.log("userProfile: ",userProfile)
        setProfResult(userProfile);
    };

    useEffect(() => {
        profile();
    }, [username]);
    return (
        <>
            <p>Username: {Profresult.userDetails.username}</p>
            <p>Name: {Profresult.userDetails.name}</p>
            <p>Email: {Profresult.userDetails.email}</p>
            <p>College: {Profresult.userDetails.college}</p>
            <p>City: {Profresult.userDetails.city}</p>
            <ul>
                {Profresult.projDetails.length > 0 ? (
                    Profresult.projDetails.map((proj, index) => (
                        <li key={index}><Link to={`/project/${proj.title}`} >{proj.title}</Link></li>
                    ))
                ) : (
                    <p>No projects found</p>
                )}
            </ul>
        </>
    )
}
