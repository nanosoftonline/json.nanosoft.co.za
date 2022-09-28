import express from "express";
const server = express();
server.use(express.json());
const PORT = 4000;

server.listen(PORT, () => console.info("Running on http://localhost:" + PORT))
server.get("/:collection", (req, res) => {
    res.send("Testing")
});

server.post("/:collection", (req, res) => {
    res.send("Testing")
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