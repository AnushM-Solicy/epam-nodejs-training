import * as fs from "fs";
import * as express from "express";
import { v4 as uuid } from "uuid";
const app = express();
const PORT = 3000;
const DB = "users.json";
const authMiddlware = (req, res, next) => {
    const apikey = req.get("api-key");
    if (apikey === "1234") {
        next();
    }
    else {
        res.status(401).send("invalid key");
    }
};
const getUsers = () => {
    try {
        const data = fs.readFileSync(DB, "utf-8");
        return JSON.parse(data);
    }
    catch (err) {
        console.log(err);
        return [];
    }
};
const save = (users) => {
    fs.writeFileSync(DB, JSON.stringify(users, null, 2), "utf-8");
};
app.use(express.json());
app.get("/users", authMiddlware, (req, res) => {
    const users = getUsers();
    res.json(users);
});
app.post("/users", authMiddlware, (req, res) => {
    const { name, surname, age } = req.body;
    if (name && surname && age) {
        const user = {
            name,
            surname,
            age: parseInt(age),
            userId: uuid(),
        };
        const users = getUsers();
        users.push(user);
        save(users);
        res.json(user);
    }
    else {
        res.status(400).json({ message: "Invalid request body" });
    }
});
app.delete("/users/:id", authMiddlware, (req, res) => {
    const id = req.params;
    const users = getUsers();
    const userIndex = users.findIndex((user) => user.userId === id.id);
    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }
    users.splice(userIndex, 1);
    save(users);
    res.json({ message: "user is dleeted" });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
