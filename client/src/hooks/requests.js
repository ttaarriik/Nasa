const URL = 'http://localhost:8000/v1/';

async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.
  const response = await fetch(`${URL}planets`);
  console.log(response);
  return await response.json();
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch(`${URL}launches`);
  const fetchedLaunches = await response.json();

  return fetchedLaunches.sort((a,b) => a.flightNumber - b.flightNumber);
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
  try {
   return await fetch(`${URL}launches/`, {
      method: 'POST',
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(launch)
    })
  }catch(err){
    return {
      ok: false
    }
  }
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
  try {
    return await fetch(`${URL}launches/${id}`, {
       method: 'DELETE',
       headers: { "Content-Type": "application/json"},
     })
   }catch(err){
     return {
       ok: false
     }
   }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};