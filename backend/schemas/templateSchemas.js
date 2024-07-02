/* eslint-disable camelcase */
const Joi = require("joi").extend(require("@joi/date"));

const querySchema = Joi.object({
  count: Joi.boolean().optional(),
  namesOnly: Joi.boolean().optional(),
  search: Joi.string().optional(),
  tname: Joi.string().optional(),
  uname: Joi.string().optional(),
  category: Joi.alternatives(
    Joi.number().integer().optional(),
    Joi.array().items(Joi.number()).optional()
  ),
  sortBy: Joi.string().valid("id", "name", "creatorname").optional(),
  sortOrder: Joi.string().valid("asc", "desc").default("asc").optional(),
  from: Joi.number().integer().optional(),
  amount: Joi.number().integer().optional(),
  creatorId: Joi.number().optional(),
});

const specifiedIdSchema = Joi.object({
  getCreatorId: Joi.boolean().optional(),
});

const templateSchema = Joi.object({
  name: Joi.string().required(),
  creator_id: Joi.number().optional(),
  description: Joi.string().optional(),
  category: Joi.number().optional(),
  items: Joi.array()
    .items(
      Joi.object().keys({
        item_name: Joi.string().required(),
      })
    )
    .required(),
});

module.exports = {
  querySchema,
  specifiedIdSchema,
  templateSchema,
};
