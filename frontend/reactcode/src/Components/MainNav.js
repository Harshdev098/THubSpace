import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function MainNav(props) {
    const navigate=useNavigate()
  const [query, setQuery] = useState()
  const search = async() => {
    await props.SearchQuery(query)
    navigate('/searchresult')
  }
  return (
    <>
        <div className='upper-nav'>
        <div className='nav-image'>
          <img src="" alt="" />
        </div>
        <div className='nav-search'>
          <input type="text" placeholder='Search with project name,username...' onChange={(e) => { setQuery(e.target.value) }} />
          <button onClick={search} >Search<i class="fa-solid fa-magnifying-glass" style={{padding:"0px 2px 0px 8px",fontSize:'18px'}}></i></button>
          {/* <img src="" alt="" /> */}
        </div>
      </div>
      <nav>
        <ul>
          <li><Link to="/create/project" className='createP' >Create<i class="fa-solid fa-plus" style={{padding:'0px 4px 0px 4px'}}></i></Link></li>
          <li><Link to='/notification' style={{fontSize:"19px",textDecoration:'none',color:'black'}}>Notifications</Link></li>
          <li><button>Generate SSH Key<i class="fa-solid fa-key" style={{padding:'0px 0px 0px 10px',fontSize:'18px'}}></i></button></li>
        </ul>
      </nav>
    </>
  )
}
