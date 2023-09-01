import * as mongoose from 'mongoose';

export const AiModelsSchema = new mongoose.Schema({
  chatLlmName: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  modelName: {
    type: String,
  },
  apiKey: {
    type: String,
  },
});
