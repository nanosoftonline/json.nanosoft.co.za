export async function updateOne(db, collection, id, dataToUpdate) {
    const data = db.data[collection];
    const index = data.map(d => d.id).indexOf(id)
    data[index] = { ...data[index], ...dataToUpdate }
    await db.write();
}