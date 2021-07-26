import BookList from "./components/BookList"
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

//Apollo Client setup
const client = new ApolloClient({ // NOTA: de esta forma Apollo Client sabe en qué endpoint ejecutará las queries que hagamos. //
  uri: "http://localhost:4000/graphql"
});

function App() {
  return (
    <ApolloProvider client={client}>  {/* NOTA: este ApolloProvider permite envolver todo el código React para que, dentro de éste, se pueda ejecutar las queries desde cualquier componente. // */}
      <div className="main">
        <h1>Practicando GraphQL</h1>
        <BookList/>
      </div>
    </ApolloProvider>
  );
}

export default App;
