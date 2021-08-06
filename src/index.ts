import cors from "cors";
import express, { Application } from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import indexRouter from "./routes";

createConnection()
  .then(async (connection) => {
    const app: Application = express();
    const port = process.env.DB_SERVER || 8080;

    app.use(express.json());

    // setup express app here
    app.use(cors());
    app.options("*", cors);

    app.use("/api", indexRouter);

    // start express server
    app.listen(port);
  })
  .catch((error) => console.log(error));
