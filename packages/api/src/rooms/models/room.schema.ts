import * as mongoose from 'mongoose';

export const RoomSchema = new mongoose.Schema({
  name: String,
  private: Boolean,
  owner: String,
  members: [{ type: String }],
});
