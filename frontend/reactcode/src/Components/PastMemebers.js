import React from 'react'

export default function PastMemebers() {
  return (
    <>
      <h3 style={{textAlign:"center"}}>Past Members</h3>
      <ul>
        <li>
          <div>
            <h2 style={{fontSize:"19px"}}>Username</h2>
            <p style={{ padding: "0px 5px", fontSize:"18px" }}>email</p>
          </div>
          <div><button>ADD<i class="fa-solid fa-plus" style={{ padding: "3px 0px 3px 4px" }}></i></button></div>
        </li>
      </ul>
    </>
  )
}
