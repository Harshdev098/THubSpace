import React, { useEffect, useState } from 'react'
import { fetchNotification } from '../Services/FetchNotification'

export default function Notification() {
    const [notify,setNotify]=useState([])
    const fetchNotify=async()=>{
        const notifications=await fetchNotification()
        setNotify(notifications)
    }
    useEffect(()=>{
        fetchNotify()
    })
  return (
    <>
        <h1>Notifications</h1>
        <div className='notify-container'>
        <ul>
            {notify.length>0 ? notify.map((n)=>{
                return <li>
                    <h2>{n.sub}</h2>
                    <p>{n.desc}</p>
                </li>
            }) : (<p>No Notifications avalaible</p>)}
        </ul>
        </div>
    </>
  )
}
