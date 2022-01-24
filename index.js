const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
type Location {
    id: ID
    name: String
    type: String
    dimension: String
    residents: [Character]!
    created: String
  }

  type Episode {
    id: ID
    name: String
    air_date: String
    episode: String
    characters: [Character]!
    created: String
  }

  type Character {
    id: ID
    name: String
    status: String
    species: String
    type: String
    gender: String
    origin: Location
    location: Location
    image: String
    episode: [Episode]!
    created: String
  }

  type Query {
    characters: [Character]
    charactersByPage(number: Int, pages: Int): [Character]
    charactersByFilter(name: String): [Character]
  }
`;

const characterList = require('./ricky-and-morty.json');

function getCharactersByPage(args) {
  let start = ((args.number - 1) * args.pages);
  let end = (start + args.pages);

  const sliced = characterList.slice(start, end);

  return sliced;
}

function getCharactersByFilter(args) {
  let name = args.name;

  const filtered = characterList.filter(x => x.name.includes(name));

  return filtered;
}

const resolvers = {
  Query: {
    characters: () => characterList,
    charactersByPage(parent, args, context, info) {
      return getCharactersByPage(args);
    },
    charactersByFilter(parent, args, context, info) {
      return getCharactersByFilter(args);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
