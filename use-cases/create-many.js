import { customAlphabet } from "nanoid"
const nanoid = customAlphabet('1234567890abcdef', 10)

export async function createMany(db, collection, items) {

    if (!db.data[collection]) {
        db.data[collection] = []
    }
    const data = db.data[collection]

    if (!Array.isArray(items)) {
        throw new Error('Items must be an array')
    }

    items.forEach(item => {
        item.id = item.id || nanoid(5)
        data.push(item)
    })

    await db.write()
}