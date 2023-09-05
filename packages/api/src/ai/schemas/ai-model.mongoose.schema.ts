import * as mongoose from 'mongoose';

export const AiModelSchema = new mongoose.Schema(
  {
    chatLlmName: {
      type: String,
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
      type: Map,
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
