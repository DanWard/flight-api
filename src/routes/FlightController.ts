import { Router, Request, Response, NextFunction } from "express";
import { FlightDatabase } from "../database/FlightDatabase";
import { parseJsonAndValidate } from "../util/ParseJson";
import { Flight } from "../models/Flight";

export class FlightController {
    public router = Router();
    // IATA compliant regex
    private airlineRegex = /^\w{2}$/g;

    constructor(private database: FlightDatabase) {
        this.router.get("/", this.getAll);
        this.router.post("/", this.insertFlight);
        this.router.use(this.handleErrors);
    }

    private getAll = (req: Request, res: Response) => {
        let results = [];
        const { airline } = req.query;

        // Validate if any query matches the regex
        if (airline && airline.match(this.airlineRegex)) {
            results = this.database.find({
                flightNumber: {
                    "$regex": [`^${airline}.*`, "ig"]
                }
            } as any);
        } else if (airline) {
            throw new Error("Invalid airline specified.");
        } else {
            results = this.database.find({});
        }

        res.send({
            flights: results,
            size: results.length,
            status: 200
        });
    }

    private insertFlight = async (req: Request, res: Response) => {
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
    }


    /**
     * Add generic error handler
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private handleErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(500).send({
            status: 500,
            message: err.message
        });
    }
}
