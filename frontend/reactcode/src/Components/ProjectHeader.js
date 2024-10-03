import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function ProjectHeader(props) {
  const location = useLocation()
  return (
    <>
      <header class="header">
        <div class="header-left">
          <div class="title" style={{fontSize:"25px"}}><i className="fa-solid fa-star" style={{ padding: "0px 6px",fontSize:'18px' }}></i>{props.projName}</div>
        </div>
        <div class="header-right">
          <input type="text" placeholder="Type to search" />
          <button class="button">Search</button>
          <img src="https://i.imgur.com/yC6zK6u.png" class="avatar" />
        </div>
      </header>

      <nav class="nav">
        <div class="nav-items">
          <Link to={`/project/${props.projName}/team`} style={{ borderBottom: location.pathname === `/project/${props.projName}/team` ? '2.5px solid green' : 'none' }} >Team</Link>
          <Link to={``} >Code</Link>
          <Link to={`/project/${props.projName}/discussion`} style={{ borderBottom: location.pathname === `/project/${props.projName}/discussion` ? '2.5px solid green' : 'none' }} >Discussion</Link>
          <Link to={`/project/${props.projName}/chat`} style={{ borderBottom: location.pathname === `/project/${props.projName}/chat` ? '2.5px solid green' : 'none' }}>Chat</Link>
          <Link to={`/project/${props.projName}/activity`} style={{ borderBottom: location.pathname === `/project/${props.projName}/activity` ? '2.5px solid green' : 'none' }} >Acitvities</Link>
        </div>
      </nav>
    </>
  )
}
