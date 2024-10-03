export const SearchFunction = async (query) => {
    const token = localStorage.getItem('accessToken');
    console.log(token);
    console.log("query: ", query);
  
    const response = await fetch('http://localhost:3000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ query })
    });
  
    if (response.ok) {
      const result = await response.json();
      console.log(result);
      return {
        profileResult: result.profileResult || [],
        projResult: result.projResult || []
      };
    } else {
      console.error('Search request failed');
      return { profileResult: [], projResult: [] };
    }
  };
  