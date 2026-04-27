const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const wasteRoutes = require("./routes/wasteRoutes");


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/waste", wasteRoutes);

mongoose.connect("mongodb://shriyhavijay_db_user:Shriyha%4027@ac-x4rbj4k-shard-00-00.e9nknzf.mongodb.net:27017,ac-x4rbj4k-shard-00-01.e9nknzf.mongodb.net:27017,ac-x4rbj4k-shard-00-02.e9nknzf.mongodb.net:27017/?ssl=true&replicaSet=atlas-tg5nxd-shard-0&authSource=admin&appName=Cluster0")
.then(()=>console.log("DB connected"))
.catch(err=>console.log(err));


app.listen(5000, ()=>console.log("Server running on port 5000"));