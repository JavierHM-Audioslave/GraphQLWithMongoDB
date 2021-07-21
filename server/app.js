const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb+srv://javo:test123@author-book.llpfd.mongodb.net/Author-Book?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection
    .once("open", () => {
        console.log("Connected to database");

        app.use("/graphql", graphqlHTTP({
            schema: schema,
            graphiql: true
        }));

        app.listen(4000, () => {
            console.log("Now listening for requests on port 4000");
        });
    })
    .on("error", error => {
        console.error(`Connection refused - ${error}`);
    });