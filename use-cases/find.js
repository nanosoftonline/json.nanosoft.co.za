
export async function find(db, collection, filter) {
    const data = db.data[collection]
    const items = data.filter(filter)
    return items;
}