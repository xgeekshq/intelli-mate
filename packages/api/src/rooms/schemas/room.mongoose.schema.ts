import * as mongoose from 'mongoose';

export const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    unique: true,
    required: true,
  },
  private: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: String,
    required: true,
  },
  members: {
    type: [String],
    required: true,
    minItems: 1,
  },
});
