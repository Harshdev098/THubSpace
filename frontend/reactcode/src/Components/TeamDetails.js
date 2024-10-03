import React from 'react'
import { Link } from 'react-router-dom'

export default function TeamDetails({ username, email, role, status }) {
  return (
    <>
      <div>
        <ul>
          <li style={{ backgroundColor: status === 0 ? "rgb(226, 226, 134)" : "rgb(161, 227, 161)" }}>
            <div>
              <Link style={{ color: "black" }} to={""}><h3 style={{fontSize:"20px"}}>{role === "leader" ? (
                <>
                  <i class="fa-solid fa-web-awesome"style={{ padding: "0px 4px" }}></i>
                  {username}
                </>
              ) : (
                username
              )}</h3></Link>
              <p style={{fontSize:"18px"}}>{email}</p>
            </div>
            <div style={{ margin: "16px" }}>
              <span style={{ border: "1.4px solid black", margin: "0px 6px", padding: "6px 14px", borderRadius: "20px", backgroundColor: status === 0 ? "rgb(226, 226, 103)" : "rgb(81, 203, 81)",fontSize:"17px" }}>{role}</span>
              <span style={{ border: "1.4px solid black", margin: "0px 6px", padding: "6px 14px", borderRadius: "20px", backgroundColor: status === 0 ? "rgb(226, 226, 103)" : "rgb(81, 203, 81)", fontSize:"17px" }}>{status === 1 ? "Verified" : "Not Verified"}</span>
            </div>
          </li>
        </ul>
      </div>
      {/* <div style={{ width: "40vw" }}>
        <img src={""} alt="" width={"100%"} />
      </div> */}
    </>
  )
}
