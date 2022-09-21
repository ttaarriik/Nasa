const {parse} = require('csv-parse');
const fs = require('fs');
const path = require('path');
const planetsModel = require('./planets.mongo');

const habitablePlanets = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
      && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
      && planet['koi_prad'] < 1.6;
  }
function loadPlanetsData() {

    return new Promise((resolve, reject) => {

        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', async (data) => {
            if (isHabitablePlanet(data)) {
                await savePlanets(data);
            }
        })
        .on('error', (err) => {
            console.log(err);
            reject(err);
        })
        .on('end', async () => {
            const count = await getAllPlanets();
            console.log(`${count.length} habitable planets found!`);
        })
        resolve();
    })

}

async function getAllPlanets() {
    return await planetsModel.find({}, {
        '_id': 0, '__v': 0
    });
}

async function savePlanets(planet){
    try {
        await planetsModel.updateOne({
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name
        },
        {
            upsert: true,
        })
    }catch(err) {
        console.error('Could not load planets: ' + err);
    }
   
}

module.exports = {
    getAllPlanets,
    loadPlanetsData
};