import { IResolvers } from '@graphql-tools/utils';

// Define resolvers as an object
const resolvers: IResolvers = {
  Query: {
    _: () => 'Hello World!',
  },
};

export default resolvers;
