import * as mongoose from 'mongoose';

export const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 50,
      unique: true,
      index: true,
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    ownerId: {
      type: String,
      required: true,
    },
    members: {
      type: [String],
      required: true,
      minItems: 1,
    },
  },
  { timestamps: true }
);
