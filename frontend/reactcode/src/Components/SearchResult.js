import React from 'react';
import { Link } from 'react-router-dom';

export default function SearchResult(props) {
  return (
    <div>
      <ul>
        {props.searchResult.ProfileResult.length > 0 ? (
          props.searchResult.ProfileResult.map((result, index) => (
            <li key={index}><Link to={`/profile/${result.username}`}>{result.username}</Link></li>
          ))
        ) : props.searchResult.ProjResult.length > 0 ? (
          props.searchResult.ProjResult.map((result, index) => (
            <li key={index}>
              <Link to={`/project/view/${result.title}/team`} >{result.title}</Link>
            </li>
          ))
        ) : (
          <p>No Results found</p>
        )}
      </ul>
    </div>
  );
}
