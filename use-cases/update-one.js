export async function updateOne(db, collection, id, dataToUpdate) {
    const data = db.data[collection];
    const index = data.findIndex(d => d.id === id)
    if (index === -1) {
        throw new Error('Document not found')
    } else {
        data[index] = { ...data[index], ...dataToUpdate }
    }
    await db.write();
}