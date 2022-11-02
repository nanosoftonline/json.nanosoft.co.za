import { customAlphabet } from "nanoid"
const nanoid = customAlphabet('1234567890abcdef', 10)

export async function create(db, collection, item) {
    const data = db.data[collection]
    data.push({ ...item, id: nanoid(5) })
    await db.write()
}