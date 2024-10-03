import React, { useState } from 'react'

export default function Users({ username, email, addUser }) {
    const [disable, setDisable] = useState(false)
    const adduserFunction = () => {
        addUser(username)
        setDisable(true)
    }
    return (  //showing users so that user can add them as a member
        <>
            <h3 style={{textAlign:"center"}}>Search Users</h3>
            <ul>
                <li style={{ display: disable === true ? 'none' : 'flex' }} >
                    <div>
                        <h2 style={{fontSize:"19px"}}>{username}</h2>
                        <p style={{ padding: "0px 5px", fontSize:"18px"  }}>{email}</p>
                    </div>
                    <div>{disable === false ? (<button onClick={adduserFunction}>Add<i class="fa-solid fa-plus" style={{ padding: "3px 0px 3px 4px" }}></i></button>) : (<span>Added</span>)}</div>
                </li>
            </ul>
        </>
    )
}
