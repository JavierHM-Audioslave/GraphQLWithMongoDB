const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb+srv://javo:test123@author-book.llpfd.mongodb.net/Author-Book?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})    // NOTA: nos conectamos a la instancia de MongoDB. //
    .catch(error => console.log(`Error when trying to connect to the DB - Error returned is: ${error}`));
mongoose.connection     // NOTA: mongoose.connection accede a la conexión creada en la línea de arriba. //
    .once("open", () => {   // NOTA: esta función sólo se ejecuta una vez y es apenas se levanta el servidor al hacer "nodemon app" en la consola (y después de haber pasado por la línea de arriba con el connect). //
        console.log("Connected to database");

        app.use("/graphql", graphqlHTTP({   // NOTA: esta línea junto con las dos líneas siguientes levanta el servicio que permite ejecutar queries en GraphQL. //
            schema: schema, // NOTA: esquema que permite ejecutar todas las queries que estén implementadas en el archivo "schema.js".
            graphiql: true  // NOTA: esta línea permite que las queries sean también ejecutadas a través de la interfaz gráfica del navegador. //
        }));

        app.listen(4000, () => {    // NOTA: puerto en el cual escucha el servidor de GraphQL
            console.log("Now listening for requests on port 4000");
        });
    })
    .on("error", error => { // NOTA: esta función se ejecuta cada vez que haya un error tanto cuando se intenta levantar el servidor por primera vez como cuando se necesita obtener una conexión 
        console.error(`Connection refused - ${error}`);
    });