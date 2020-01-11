import * as express from "express";
import * as compression from "compression";
import * as bodyParser from "body-parser";
import * as lusca from "lusca";
import * as session from "express-session";
import * as config from "config";

import "reflect-metadata";
import { FlightController } from "./routes/FlightController";
import { FlightDatabase } from "./database/FlightDatabase";

const flightController = new FlightController(new FlightDatabase());

// Create Express server
const app = express();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sessionConfig = config.get("session") as any;

// Default config for compression
app.use(compression());

// Allow inbound POST requirements
app.use(bodyParser.json());

/**
 * Enable this to allow form-based POST of data
 */
// app.use(bodyParser.urlencoded({ extended: true }));

// BEGIN: Security hardening
app.use(session(sessionConfig));
app.use(lusca({
    csrf: true,
    xframe: "SAMEORIGIN",
    p3p: "ABCDEF",
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    xssProtection: true,
    nosniff: true,
    referrerPolicy: "same-origin"
}));
app.disable("x-powered-by");
if (app.get("env") === "production") {
    app.set("trust proxy", 1); // Allow single reverse proxy
}
// END: Security hardening

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Express started on ${port}`));

app.use("/flights", flightController.router);

export default app;