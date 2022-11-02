import { ERROR_TYPES } from "../enums/errors.js"

export async function findOne(db, collection, filter) {
    const data = db.data[collection]
    const items = data.filter(filter)
    if (items.length === 0) {
        let err = new Error()
        err.name = ERROR_TYPES.NOT_FOUND
        err.message = "Not Found"
        throw err
    }
    return items[0];
}