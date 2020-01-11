import * as loki from "lokijs";
import { Flight } from "src/models/Flight";

export class FlightDatabase {

    db = new loki("db");
    flights = this.db.addCollection("flights");

    constructor() {
        this.flights.insert({
            flightNumber: "QF12",
            "arrivalPort": "SYD",
            "departurePort": "MEL",
            "departureTime": new Date(),
            "arrivalTime": new Date()
        });
    }

    public find(query: PartialModel<Flight, LokiObj>) {
        const results = this.flights.find(query);
        return results.map((result) => {
            delete result["meta"];
            delete result["$loki"];
            return result;
        });
    }

}