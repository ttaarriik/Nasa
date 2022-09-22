const request = require('supertest');
const app = require('../../app');
const {mongoConnect, mongoDisconnect} = require('../../services/mongo');
const {loadPlanetsData} = require('../../models/planets.model');
describe('Test GET requests', () => {
    beforeAll( async () => {
     await mongoConnect();
     await loadPlanetsData();
    })

    afterAll( async () => {
        await mongoDisconnect();
    })

    describe("Test GET /launches", () => {
        test("It should return status code of 200", async () => {
            const response = await request(app).get('/v1/launches')
            .expect("Content-Type", /json/)
            .expect(200);
        })
    })
    
    describe("Test POST /launches", () => {
        const datawWithDate = {
            mission: "USSC",
            rocket: "Tareq",
            target: "Kepler-62 f",
            launchDate: "January 4, 2024"
        }
        const datawWithoutDate = {
            mission: "USSC",
            rocket: "Tareq",
            target: "Kepler-62 f",
        }
        const datawWithInvalidDate = {
            mission: "USSC",
            rocket: "Tareq",
            target: "Kepler-62 f",
            launchDate: "haha"
        }
        test("It should return status code of 201", async () => {
          
            const response = await request(app).post('/v1/launches')
            .send(datawWithDate)
            .expect("Content-Type", /json/)
            .expect(201);
    
            const responseDate = new Date(response.body.launchDate).valueOf();
            const requestDate = new Date(datawWithDate.launchDate).valueOf();
    
            expect(responseDate).toBe(requestDate);
    
            expect(response.body).toMatchObject(datawWithoutDate);
    
            
        })
    
        test("It should return status code of 400 and catch missing properties", async () => {
            const response = await request(app).post('/v1/launches')
            .send(datawWithoutDate)
            .expect("Content-Type", /json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({ 
                error: "One of the property is missing!"
            });
    
        })
    
        test("It catch an invalid date", async () => {
            const response = await request(app).post('/v1/launches')
            .send(datawWithInvalidDate)
            .expect("Content-Type", /json/)
            .expect(400)
    
            expect(response.body).toStrictEqual({
                error: "Invalid launch date!"
            })
        })
    })

})
