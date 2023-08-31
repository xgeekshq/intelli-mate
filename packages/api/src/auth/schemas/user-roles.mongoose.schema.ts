import * as mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
    },
  },
  { _id: false, required: true }
);

export const UserRolesSchema = new mongoose.Schema({
  userId: {
    type: String,
    index: true,
    required: true,
  },
  roles: {
    type: [RoleSchema],
  },
});
