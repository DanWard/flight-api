import "reflect-metadata";
import * as express from "express";
import * as compression from "compression";
import * as bodyParser from "body-parser";
import * as lusca from "lusca";
import * as session from "express-session";
import * as config from "config";
import * as morgan from "morgan";

import { FlightController } from "./routes/FlightController";
import { FlightDatabase } from "./database/FlightDatabase";

// Create Express server
const app = express();

const sessionConfig = config.get("session") as any;
const expressConfig = config.get("express") as any;

if (expressConfig.useCompression) {
    // Default config for compression
    app.use(compression());
}

if (expressConfig.useJsonParser) {
    // Allow inbound POST requirements
    app.use(bodyParser.json());
}
if (expressConfig.useUrlEncParser) {
    app.use(bodyParser.urlencoded({ extended: true }));
}

// BEGIN: Security hardening
if (expressConfig.useSession) {
    app.use(session(sessionConfig));

    if (expressConfig.useLusca) {
        app.use(lusca({
            csrf: true,
            xframe: "SAMEORIGIN",
            p3p: "ABCDEF",
            hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
            xssProtection: true,
            nosniff: true,
            referrerPolicy: "same-origin"
        }));
    }

}

app.disable("x-powered-by");
if (app.get("env") === "production") {
    app.set("trust proxy", 1); // Allow single reverse proxy
}
// END: Security hardening

// Enable logging
app.use(morgan("combined"));

const flightDatabase = new FlightDatabase();
const flightController = new FlightController(flightDatabase);
app.use("/flights", flightController.router);

module.exports = app.listen(expressConfig.port, () => console.log(`[${new Date()}] Flight-API started on ${expressConfig.port}`));
