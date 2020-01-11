import { Router, Request, Response } from "express";

export class FlightController {
    public router = Router();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(private database: any) {
        this.router.get("/", this.getAll);
    }

    getAll(req: Request, res: Response) {
        res.send([]);
    }
}
