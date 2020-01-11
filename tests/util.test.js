/* eslint-disable @typescript-eslint/no-var-requires */
const validation = require("../build/util/Validation");
const parseJson = require("../build/util/parseJson");
const MOCK_DATA = require("./mock");
const Flight = require("../build/models/Flight").Flight;

describe("Ensure validation passes", () => {
    it("should fail validation", async () => {
        try {
            await validation.transformAndValidate(MOCK_DATA.flight1, Flight);
        } catch (err) {
            expect(err).toBeTruthy();
        }
    });

    it("should pass validation", async () => {
        const json = JSON.stringify(MOCK_DATA.flight1);
        const flight = await parseJson.parseJsonAndValidate(json, Flight);
        expect(flight).toBeTruthy();
    });

});