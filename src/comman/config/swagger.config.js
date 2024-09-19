import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { serve, setup } from "swagger-ui-express";
import path from "path";
import expressBasicAuth from "express-basic-auth";

const YAML = require("yamljs");

const router = express.Router();
const swaggerDocument = YAML.load(path.join(__dirname, "../../../swagger.yml"));

if (process.env.NODE_ENV !== "production") {
    router.use(
        "/",
        (req, res, next) => {
            swaggerDocument.info.title = process.env.APP_NAME || "To-Do";
            swaggerDocument.info.version = "1.0";
            swaggerDocument.servers = [
                {
                    url: `http://localhost:${process.env.PORT}/`,
                    description: "API base url",
                },
            ];
            req.swaggerDoc = swaggerDocument;
            next();
        },
        serve,
        setup(swaggerDocument, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        })
    );
}

export default router;
