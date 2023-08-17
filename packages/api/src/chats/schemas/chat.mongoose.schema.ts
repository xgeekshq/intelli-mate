import * as mongoose from 'mongoose';

const MessageMetaSchema = new mongoose.Schema(
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

const MessageSchema = new mongoose.Schema({
  sender: SenderSchema,
  content: {
    type: String,
    required: true,
  },
  meta: MessageMetaSchema,
  createdAt: {
    type: String,
    required: true,
  },
});

const DocumentMetaSchema = new mongoose.Schema(
  {
    mimetype: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    queryable: {
      type: Boolean,
      required: true,
    },
    vectorDBDocumentName: {
      type: String,
      default: null,
    },
    vectorDBDocumentDescription: {
      type: String,
      default: null,
    },
  },
  { _id: false, required: true }
);

const DocumentSchema = new mongoose.Schema({
  roles: {
    type: [String],
  },
  meta: DocumentMetaSchema,
  src: {
    type: [String],
    required: true,
    select: false,
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
    documents: {
      type: [DocumentSchema],
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
