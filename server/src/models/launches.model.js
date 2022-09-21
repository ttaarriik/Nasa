const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

let DEFAULT_FLIGHT_NUMBER = 100;

async function getAllLaunches(skip, limit) {
   return await launchesDatabase.find({}, {'__v': 0, '_id': 0})
   .sort({flightNumber: 1})
   .skip(skip)
   .limit(limit);
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target
    });

    if(!planet) {
        throw new Error('The planet does not exist');
    }
    const newFlightNumber = await getLatestFlightNumber();
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customer: ['Zero To Mastery', 'NASA'],
        flightNumber: newFlightNumber
    });
    await saveLaunch(newLaunch);
}

async function findLaunch(filter) {
    await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId){
    return await findLaunch({
        flightNumber: launchId
    })
}

async function abortLaunchById(launchId){
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    });
    console.log("aborted", aborted);

    return aborted.modifiedCount === 1;
}

async function saveLaunch(launch) {
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    },
    launch, {upsert: true})
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase.findOne()
    .sort('-flightNumber');

    latestLaunch.flightNumber++;

    if(!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches';


async function populateLaunches() {
    console.log('Loading launches...')
    const response = await axios(SPACEX_API_URL, {
        query: {},
        options: {
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        "customer": 1
                    }
                }
            ]
        }
    })

    if(response.status !== 200) {
        console.log('Problem downloading new data');
        throw new Error('Launch data download failed');
    }
    
    const launchDocs = response.data;
    for(const launchDoc of launchDocs){
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers: customers
        }
        console.log(`${launch.flightNumber} ${launch.mission}`);
        await  saveLaunch(launch);
    }
}

async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });

    if(firstLaunch){
        console.log('The data has already been loaded')
    }else {
        populateLaunches();
    }    
}

module.exports = {
    loadLaunchData,
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById
}

