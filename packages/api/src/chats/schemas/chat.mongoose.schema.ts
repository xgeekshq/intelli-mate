import * as mongoose from 'mongoose';

const MetaSchema = new mongoose.Schema(
  {
    tokens: {
      type: Number,
      required: true,
    },
    replyTo: {
      type: String,
      required: false,
    },
    ai: {
      type: {
        llmModel: {
          type: String,
          required: true,
        },
      },
      _id: false,
      required: false,
    },
  },
  { _id: false, required: true }
);

const SenderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    isAi: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { _id: false, required: true }
);

export const MessageSchema = new mongoose.Schema({
  sender: SenderSchema,
  content: {
    type: String,
    required: true,
  },
  meta: MetaSchema,
  createdAt: {
    type: String,
    required: true,
  },
});

export const ChatSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      index: true,
      required: true,
    },
    messageHistory: {
      type: [MessageSchema],
    },
    participantIds: {
      type: [String],
    },
  },
  {
    timestamps: { createdAt: 'created', updatedAt: 'updated' },
  }
);

ChatSchema.virtual('createdAt').get(function () {
  return this['created'].toISOString();
});

ChatSchema.virtual('updatedAt').get(function () {
  return this['updated'].toISOString();
});
