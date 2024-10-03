import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProfile } from '../Services/profile';

export default function ViewProfile() {
    const [result, setResult] = useState({ userDetails: {}, projDetails: [] });

    const profile = async () => {
        console.log("profile function called");
        const userProfile = await fetchProfile();
        setResult(userProfile);
    };

    useEffect(() => {
        profile();
    }, []);

    return (
        <>
            {result.userDetails ? (
                <>
                    <p>Username: {result.userDetails.username}</p>
                    <p>Name: {result.userDetails.name}</p>
                    <p>Email: {result.userDetails.email}</p>
                    <p>College: {result.userDetails.college}</p>
                    <p>City: {result.userDetails.city}</p>
                </>
            ) : (
                <p>Loading user details...</p>
            )}
            <ul>
                {result.projDetails && result.projDetails.length > 0 ? (
                    result.projDetails.map((proj, index) => (
                        <li key={index}><Link to={`/project/${proj.title}`} >{proj.title}</Link></li>
                    ))
                ) : (
                    <p>No projects found</p>
                )}
            </ul>
        </>
    );
}
