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

// Get config required for this file
const sessionConfig = config.get("session") as any;
const expressConfig = config.get("express") as any;
const luscaConfig = config.get("lusca") as any;

if (expressConfig.useCompression) {
    // Use defaults for compression
    app.use(compression());
}

if (expressConfig.useJsonParser) {
    // Allow inbound JSON POST requirements
    app.use(bodyParser.json());
}
if (expressConfig.useUrlEncParser) {
    // Enable URL encoded POST bodys to be decoded
    app.use(bodyParser.urlencoded({ extended: true }));
}

// BEGIN: Security hardening
if (expressConfig.useSession) {
    app.use(session(sessionConfig));

    if (expressConfig.useLusca) {
        // Use lusca if sessions are enabled due to cookie/session requirements
        app.use(lusca(luscaConfig));
    }

}

if (app.get("env") === "production") {
    // Allow single reverse proxy
    app.set("trust proxy", 1);
}

// Disable the header that shows this server is running on node
app.disable("x-powered-by");
// END: Security hardening

// Enable logging
app.use(morgan("combined"));

// BEGIN: Routes
const flightDatabase = new FlightDatabase();
const flightController = new FlightController(flightDatabase);
app.use("/flights", flightController.router);
// END: Routes

// Export the running HTTP Server to enable tests to use it
module.exports = app.listen(expressConfig.port, () => console.log(`[${new Date()}] Flight-API started on ${expressConfig.port}`));
