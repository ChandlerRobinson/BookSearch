import { IResolvers } from '@graphql-tools/utils';
import User from '../models/User'; // Adjust path as needed
import { AuthenticationError } from 'apollo-server-express';
import { signToken } from '../services/auth'; // Adjust path if necessary

const resolvers: IResolvers = {
  Query: {
    me: async (_parent, _args, context) => {
      if (context.user) {
        const userData = await User.findById(context.user._id).populate('savedBooks');
        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    login: async (_parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Invalid credentials');
      }

      // Fix: Pass correct arguments to signToken
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    addUser: async (_parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });

      // Fix: Pass correct arguments to signToken
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (_parent, { input }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: input } },
          { new: true }
        ).populate('savedBooks');

        return updatedUser;
      }
      throw new AuthenticationError('Not logged in');
    },
    removeBook: async (_parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        ).populate('savedBooks');

        return updatedUser;
      }
      throw new AuthenticationError('Not logged in');
    },
  },
};

export default resolvers;

