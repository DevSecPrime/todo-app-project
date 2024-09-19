import knex from "knex";

import knexFile from "../../../knexfile.js";
import { attachPaginate } from "knex-paginate"

import dotenv from "dotenv";
dotenv.config();

const environment = process.env.NODE_ENV || "development";

const dbConnection = knex(knexFile[environment]);

attachPaginate();
export default dbConnection;

