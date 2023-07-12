import * as mongoose from 'mongoose';

export const UserRolesSchema = new mongoose.Schema({
  userId: {
    type: String,
    index: true,
    required: true,
  },
  roles: {
    type: [String],
  },
});
