import * as mongoose from 'mongoose';

export const AiModelSchema = new mongoose.Schema(
  {
    chatLlmName: {
      type: String,
    },
    alias: {
      type: String,
      required: false,
    },
    modelName: {
      type: String,
    },
    temperature: {
      type: Number,
    },
    description: {
      type: String,
    },
    meta: {
      type: Object,
      of: String,
    },
  },
  {
    timestamps: { createdAt: 'created', updatedAt: 'updated' },
  }
);

AiModelSchema.virtual('createdAt').get(function () {
  return this['created'].toISOString();
});

AiModelSchema.virtual('updatedAt').get(function () {
  return this['updated'].toISOString();
});
