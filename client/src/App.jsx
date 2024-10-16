import { Outlet } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import NavBar from "./components/NavBar/NavBar";
import { setContext } from "@apollo/client/link/context";
import { AuthProvider } from "./context/AuthContext.jsx";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <div>
          <main>
            <NavBar />
            <Outlet />
          </main>
        </div>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
