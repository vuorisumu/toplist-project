/* eslint-disable camelcase */
const Joi = require("joi");

const userQuerySchema = Joi.object({
  search: Joi.string().optional(),
  hasRankings: Joi.boolean().optional(),
  hasTemplates: Joi.boolean().optional(),
  name: Joi.string().optional(),
  email: Joi.string().optional(),
  tempId: Joi.number().optional(),
  from: Joi.number().integer().optional(),
  amount: Joi.number().integer().optional(),
});

const userSchema = Joi.object({
  user_name: Joi.string().required(),
  email: Joi.string().email({ tlds: false }).required(),
  password: Joi.string().min(6).required(),
});

const editUserSchema = Joi.object({
  user_name: Joi.string().optional(),
  email: Joi.string().email({ tlds: false }).optional(),
  password: Joi.string().min(6).optional(),
});

module.exports = {
  userQuerySchema,
  userSchema,
  editUserSchema,
};
