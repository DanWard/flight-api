import { Router, Request, Response } from "express";
import { FlightDatabase } from "../database/FlightDatabase";
import { parseJsonAndValidate } from "../util/ParseJson";
import { Flight } from "../models/Flight";

export class FlightController {
    public router = Router();

    constructor(private database: FlightDatabase) {
        this.router.get("/", this.getAll);
        this.router.post("/", this.insertFlight);
    }

    getAll = (req: Request, res: Response) => {
        let results = [];

        if (req.query.airline) {
            results = this.database.find({
                flightNumber: {
                    "$contains": req.query.airline
                }
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

    insertFlight = async (req: Request, res: Response) => {
        try {
            const flight: Flight = await parseJsonAndValidate(JSON.stringify(req.body), Flight) as Flight;

            const result = this.database.insert(flight);

            res.status(201).send({
                flight: result,
                status: 201
            });

        } catch (err) {
            console.error(err);

            const validationErrors = err.length ? err.reduce((prev: any, error: any) => {
                prev.push(error.constraints);
                return prev;
            }, []) : undefined;

            res.status(400).send({
                error: "Request failed",
                message: validationErrors ? validationErrors : "",
                status: 400
            });
        }
    };
}
