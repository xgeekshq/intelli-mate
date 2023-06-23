import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: {
        userId: {
          type: String,
          required: false,
        },
        isAi: {
          type: Boolean,
          default: false,
          required: true,
        },
        aiMeta: {
          type: {
            llmModel: {
              type: String,
              required: true,
            },
            tokens: {
              type: Number,
              required: true,
            },
            replyTo: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
            },
          },
          required: false,
        },
      },
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ChatSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
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
  { timestamps: true }
);
