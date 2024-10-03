import React from 'react'
import { Link } from 'react-router-dom'
import '../css/main.css'
import Feed from '../Components/Feed'
import MainNav from '../Components/MainNav'

export default function Main(props) {
  return (
    <>
      <MainNav SearchQuery={props.SearchQuery} />
      <main>
        <div className='left-side'>
          <ul>
            <li>Create Feed</li>
            <li>Your Feeds</li>
            <li>Projects</li>
            <li>Teams</li>
            <li>Your SSH Key</li>
            <li>Setting</li>
          </ul>
        </div>
        <div className='page-main'>
        <h2 style={{textAlign:'center',fontSize:"24px"}}>Your Feeds</h2>
          <div className='feeds'>
            <ul>
              <Feed />
            </ul>
          </div>
        </div>
      </main>
    </>
  )
}
