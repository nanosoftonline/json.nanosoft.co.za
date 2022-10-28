import express from "express";
import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

import { customAlphabet } from "nanoid";
const nanoid = customAlphabet('1234567890abcdef', 10)

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)
await db.read()
db.data ||= { users: [], customers: [], products: [], tasks: [] }

const server = express();
server.use(express.json());
const PORT = 4000;

server.listen(PORT, () => console.info("Running on http://localhost:" + PORT))

server.get("/:collection/:id", (req, res) => {
    const { collection, id } = req.params
    const data = db.data[collection]

    if (!data) {
        return res.json({ message: collection + " not a validate collection" })
    }

    const items = data.filter(d => d.id === id)
    if (items.length) {
        return res.json(items[0])
    }

    return res.status(404).json({ message: "Not Found" })

});


server.get("/:collection", (req, res) => {
    try {
        const { collection } = req.params
        const data = db.data[collection]
        return res.status(data ? 200 : 400).json(data || { message: collection + " not a validate collection" })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
});

server.post("/:collection", async (req, res) => {
    try {
        const { collection } = req.params
        const data = db.data[collection];
        data.push({ ...req.body, id: nanoid(5) })
        await db.write()
        res.json({ message: "Created" })

    } catch (e) {
        res.status(500).json({ message: e.message })
    }
});



server.delete("/:collection/:id", async (req, res) => {
    try {
        const { collection, id } = req.params
        const data = db.data[collection]
        const index = data.map(d => d.id).indexOf(id)
        data.splice(index, 1)
        await db.write();
        res.json({ message: "Deleted" })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
});

server.put("/:collection/:id", async (req, res) => {
    try {
        const { collection, id } = req.params
        const dataToUpdate = req.body
        const data = db.data[collection]
        const index = data.map(d => d.id).indexOf(id)
        data[index] = { ...data[index], ...dataToUpdate }
        await db.write();
        res.json({ message: "updated" })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
});