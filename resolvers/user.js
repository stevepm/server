import bcrypt from 'bcrypt';

export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    register: async (parent, { password, ...otherArgs }, { models }) => {
      const hashedPassword = await bcrypt.hash(password, 12);

      try {
        await models.User.create({ ...otherArgs, password: hashedPassword });
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
  },
};
