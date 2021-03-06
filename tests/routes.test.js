/* eslint-disable @typescript-eslint/no-var-requires */
const request = require("supertest");
const app = require("../build/app");
const MOCK_DATA = require("./mock");

describe("Get flights", () => {
    it("should get all flights", async () => {
        const res = await request(app)
            .get("/flights");
        expect(res.body.size).toEqual(0);
        expect(res.statusCode).toEqual(200);
    });
});

describe("Create flights", () => {
    it("should create a flight", async () => {
        const res = await request(app)
            .post("/flights")
            .send(MOCK_DATA.flight1);
        expect(res.statusCode).toEqual(201);
    });

    it("should retrieve the new flight", async () => {
        const res = await request(app)
            .get("/flights");
        expect(res.body.size).toEqual(1);
        expect(res.statusCode).toEqual(200);
        expect(res.body.flights[0]).toEqual(MOCK_DATA.flight1);
    });

    it("should fail posting an invalid date", async () => {
        const res = await request(app)
            .post("/flights")
            .send(MOCK_DATA.flight2);
        expect(res.statusCode).toEqual(400);
        expect(res.body.flight).toEqual(undefined);
        expect(res.body.message[0].isDate).toEqual("arrivalTime must be a Date instance");
    });
});

describe("Filter flights correctly", () => {
    it("should create a flight", async () => {
        const res = await request(app)
            .post("/flights")
            .send(MOCK_DATA.flight3);
        expect(res.statusCode).toEqual(201);
    });

    it("should retrieve the new flight", async () => {
        const res = await request(app)
            .get("/flights");
        expect(res.statusCode).toEqual(200);
        expect(res.body.flights).toContainEqual(MOCK_DATA.flight3);
    });

    it("should get the filtered airline", async () => {
        const res = await request(app)
            .get("/flights?airline=AB");
        expect(res.statusCode).toEqual(200);
        expect(res.body.size).toEqual(1);
        expect(res.body.flights[0]).toEqual(MOCK_DATA.flight3);
    });

    it("should retrieve none", async () => {
        const res = await request(app)
            .get("/flights?airline=UI");
        expect(res.statusCode).toEqual(200);
        expect(res.body.size).toEqual(0);
    });

    it("should fail to retrieve", async () => {
        const res = await request(app)
            .get("/flights?airline=ABC");
        expect(res.statusCode).toEqual(400);
    });
});


test("teardown", () => {
    app.close();
});