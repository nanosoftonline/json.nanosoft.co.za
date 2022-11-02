export async function deleteOne(db, collection, id) {
    const data = db.data[collection]
    const index = data.map(d => d.id).indexOf(id)
    data.splice(index, 1)
    await db.write();
}