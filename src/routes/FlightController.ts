import { Router, Request, Response } from "express";
import { FlightDatabase } from "src/database/FlightDatabase";

export class FlightController {
    public router = Router();

    constructor(private database: FlightDatabase) {
        this.router.get("/", this.getAll);
    }

    getAll = (req: Request, res: Response) => {
        let results = [];

        if (req.query.airline) {
            results = this.database.find({
                flightNumber: {
                    "$contains": req.query.airline
                }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
        } else {
            results = this.database.find({});
        }

        res.send({
            flights: results,
            size: results.length,
            status: 200
        });
    }
}
