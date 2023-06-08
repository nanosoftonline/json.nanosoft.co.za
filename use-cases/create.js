import { customAlphabet } from "nanoid"
const nanoid = customAlphabet('1234567890abcdef', 10)

export async function create(db, collection, item) {
    const data = db.data[collection]
    const foundIndex = data.findIndex(d => d.id === item.id)
    if (foundIndex === -1) {
        data.push({ ...item, id: item.id || nanoid(5) })
    } else {
        throw new Error('Document already exists')
    }
    await db.write()
}