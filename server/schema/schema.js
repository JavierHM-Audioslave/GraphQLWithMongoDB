const graphql = require("graphql");
const Book = require("../models/book");
const Author = require("../models/author");
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInt, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;





const BookType = new GraphQLObjectType({    // NOTA: "BookType" es un type object el cual define cómo es el objeto Book. //
    name: "Book",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {   // NOtA: acá estoy definiendo la relación que tiene el libro con el autor. Más especificamente, obteniendo el autor que escribió este libro. //
            type: AuthorType,
            resolve(parent, args){
                // return authors.find(author => author.id === parent.authorId)
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({  // NOTA: "AuthorType" es un type object el cual define cómo es el objeto Author. //
    name: "Author",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type : GraphQLString},
        age: { type : GraphQLInt},
        books: {    // NOtA: acá estoy definiendo la relación que tiene el autor con los libros. Más especificamente, obteniendo TODOS los libros que escribió este autor. //
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({authorId: parent.id});
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({   // NOTA: este es un objeto que nos permite englobar las consultas para que nos devuelva UN book. UN author, TODOS los books o TODOS los authors.
    name: "RootQueryType",
    fields: {
        book: { // Con esta query se devuelve todo o parte de UN BookType. Qué BookType nos va a devolver depende del argumento enviado desde el front al hacer {book(id: ciertoNumero)} donde "ciertoNumero" es el campo id del BookType. //
            type: BookType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args){
                return Book.findById(args.id);  // "args.id" va a contener el valor del id que se mande desde el frontend. // 
            }
        },
        author: {   // Con esta query se devuelve todo o parte de UN AuthorType. Qué AuthorType nos va a devolver depende del argumento enviado desde el front al hacer {author(id: ciertoNumero)} donde "ciertoNumero" es el campo id del AuthorType. //
            type: AuthorType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args){
                return Author.findById(args.id);    // "args.id" va a contener el valor del id que se mande desde el frontend. // 
            }
        },
        books: { // Con esta query se devuelven TODOS los "books" que hayan dentro de ese objeto.
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({});
            }
        },
        authors: {  // Con esta query se devuelven TODOS los "authors" que hayan dentro de ese objeto.
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({});
            }
        }

    }
});



const Mutation = new GraphQLObjectType({    // NOTA: este es un objeto que nos permite englobar las operaciones de creación en la BD. //
    name: "Mutation",
    fields: {
        addAuthor: {    // NOTA: addAuthor sirve para agregar un autor a MongoDB a través de mongoose. //
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},    // NOTA: con "GraphQLNonNull" lo que hago es declarar que este campo siempre tiene que tener un valor y así prevenir que un "author" se grabe en la BD sin este campo. //
                age: {type: new GraphQLNonNull(GraphQLInt)}     // NOTA: ídem nota de arriba. //
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },

        addBook: {      // NOTA: addBook sirve para agregar un libro a MongoDB a través de mongoose. //
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},    // NOTA: con "GraphQLNonNull" lo que hago es declarar que este campo siempre tiene que tener un valor y así prevenir que un "book" se grabe en la BD sin este campo. //
                genre: {type: new GraphQLNonNull(GraphQLString)},   // NOTA: ídem nota de arriba. //
                authorId: {type: new GraphQLNonNull(GraphQLString)} // NOTA: ídem nota de arriba. //
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
})



module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})