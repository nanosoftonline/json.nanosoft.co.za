import express from "express";
import { Low, JSONFile } from 'lowdb'
import Joi from 'joi'
import { create } from "./use-cases/create.js";
import { ERROR_TYPES } from "./enums/errors.js";
import { deleteOne } from "./use-cases/delete-one.js";
import { findOne } from "./use-cases/find-one.js";
import { updateOne } from "./use-cases/update-one.js";
import { find } from "./use-cases/find.js";
const adapter = new JSONFile("db.json")
const db = new Low(adapter)
await db.read()
db.data ||= { customers: [], tasks: [] }
const server = express()
server.use(express.json())

const handleAsync = (fn) => async (req, res, next) => {
    try {
        await fn(req, res)
    } catch ({ name, message }) {
        console.log(message)
        switch (name) {
            case ERROR_TYPES.VALIDATION:
                res.status(400).json({ message })
                break;
            case ERROR_TYPES.SYSTEM:
                res.status(500).json({ message })
                break;
            case ERROR_TYPES.NOT_FOUND:
                res.status(404).json({ message })
                break;
            default:
                res.status(500).json({ message })
        }
    }
}

const validate = (schema, part) => {
    const { error } = Joi.object(schema).validate(part)
    if (error) {
        let err = new Error()
        err.name = ERROR_TYPES.VALIDATION
        err.message = error.message
        throw err
    }
}

server
    .get("/:collection", handleAsync(async (req, res) => {
        validate({ collection: Joi.string().valid("customers", "tasks") }, req.params);
        const { collection } = req.params
        const items = await find(db, collection, d => true)
        return res.json(items)
    }))
    .post("/:collection", handleAsync(async (req, res) => {
        validate({ collection: Joi.string().valid("customers", "tasks") }, req.params);
        validate({ customerName: Joi.string().required(), emailAddress: Joi.string().required(), type: Joi.string().required(), isActive: Joi.boolean().required() }, req.body);
        const { collection } = req.params
        await create(db, collection, req.body);
        res.json({ message: "Created" })
    }))
    .get("/:collection/:id", handleAsync(async (req, res) => {
        validate({ collection: Joi.string().valid("customers", "tasks").required(), id: Joi.string().required() }, req.params);
        const { collection, id } = req.params
        const item = await findOne(db, collection, (d => d.id === id))
        return res.json(item)
    }))
    .delete("/:collection/:id", handleAsync(async (req, res) => {
        validate({ collection: Joi.string().valid("customers", "tasks").required(), id: Joi.string().required() }, req.params);
        const { collection, id } = req.params
        await deleteOne(db, collection, id)
        res.json({ message: "Deleted" })
    }))
    .put("/:collection/:id", handleAsync(async (req, res) => {
        validate({ collection: Joi.string().valid("customers", "tasks").required(), id: Joi.string().required() }, req.params);
        validate({ customerName: Joi.string(), emailAddress: Joi.string(), type: Joi.string(), isActive: Joi.boolean() }, req.body);
        const { collection, id } = req.params
        const dataToUpdate = req.body
        await updateOne(db, collection, id, dataToUpdate)
        res.json({ message: "Updated" })
    }));

server.listen(4000, () => console.info("Running on http://localhost:4000"))