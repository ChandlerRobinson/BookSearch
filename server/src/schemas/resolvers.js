import User from '../models/User'; // Adjusted import path
import { AuthenticationError } from 'apollo-server-express';
import { signToken } from '../services/auth'; // Adjusted import path
const resolvers = {
    Query: {
        me: async (_parent, _args, context) => {
            if (context.user) {
                const userData = await User.findById(context.user.id).populate('savedBooks');
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
            const token = signToken(user.username, user.email, user.id);
            return { token, user };
        },
        addUser: async (_parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user.username, user.email, user.id);
            return { token, user };
        },
        saveBook: async (_parent, { input }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(context.user.id, { $addToSet: { savedBooks: input } }, { new: true }).populate('savedBooks');
                return updatedUser;
            }
            throw new AuthenticationError('Not logged in');
        },
        removeBook: async (_parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(context.user.id, { $pull: { savedBooks: { bookId } } }, { new: true }).populate('savedBooks');
                return updatedUser;
            }
            throw new AuthenticationError('Not logged in');
        },
    },
};
export default resolvers;
