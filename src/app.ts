import express from 'express';
import cors from 'cors';
import {deleteAllDataController} from "./routers/deleteAllDataController";

export const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res
        .status(200)
        .json({version: '1.0'})
});


app.delete("/testing/all-data", deleteAllDataController)