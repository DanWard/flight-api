import * as loki from "lokijs";
import * as fs from "fs-extra";
import { Flight } from "src/models/Flight";

export class FlightDatabase {

    db = new loki("db");
    flights = this.db.addCollection("flights");

    constructor() {
        this.importMockData();
    }

    /**
     * Searches the in-memory db for the given query
     * @param query LokiJS query syntax
     */
    public find(query: PartialModel<Flight, LokiObj>) {
        const results = this.flights.find(query);
        return results.map((result) => {
            delete result["meta"];
            delete result["$loki"];
            return result;
        });
    }

    /**
     * Inserts one or many flights into the db
     * @param flight object of flight, or flights
     */
    public insert(flight: Flight) {
        this.flights.insert(flight);
    }

    /**
     * Imports mock data from disk
     */
    private async importMockData() {
        const data = await fs.readJSON("mock/flights.json");
        this.insert(data);
    }

}