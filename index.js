import express from "express";
import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import { nanoid } from "nanoid";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)
await db.read()
db.data ||= { users: [], customers: [], products: [] }

const server = express();
server.use(express.json());
const PORT = 4000;

server.listen(PORT, () => console.info("Running on http://localhost:" + PORT))
server.get("/:collection", (req, res) => {
    const data = db.data[req.params.collection]
    if (!data) {
        res.json({ message: req.params.collection + " not a validate collection" })
    } else {
        res.send(data)
    }
});

server.post("/:collection", async (req, res) => {
    try {
        const collection = db.data[req.params.collection];
        collection.push({ id: nanoid(), ...req.body })
        await db.write()
        res.json({ message: "Created" })

    } catch (e) {
        res.status(500).json({ message: e.message })
    }
});


server.get("/:collection/:id", (req, res) => {
    res.send("Testing")
});

server.delete("/:collection/:id", (req, res) => {
    res.send("Testing")
});

server.put("/:collection/:id", (req, res) => {
    res.send("Testing")
});