import bcrypt from 'bcrypt';
import _ from 'lodash';

const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(err => _.pick(err, ['path', 'message']));
  }

  return [{ path: 'name', message: 'Something went wrong' }];
};

export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    register: async (parent, { password, ...otherArgs }, { models }) => {
      const hashedPassword = await bcrypt.hash(password, 12);

      try {
        if (password.length < 5 || password.length > 25) {
          return {
            ok: false,
            errors: [{
              path: 'password',
              message: 'The password needs to be between 5 and 25 characters'
            }],
          };
        }

        const user = await models.User.create({ ...otherArgs, password: hashedPassword });
        console.log('stuff');
        return {
          ok: true,
          user,
        };
      } catch (e) {
        console.log(e);
        return {
          ok: false,
          errors: formatErrors(e, models),
        };
      }
    },
  },
};
