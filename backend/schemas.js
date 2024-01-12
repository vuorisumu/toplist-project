/* eslint-disable camelcase */
const Joi = require("joi").extend(require("@joi/date"));

const querySchema = Joi.object({
  sortBy: Joi.string().valid("name", "creatorname").optional(),
  sortOrder: Joi.string().valid("asc", "desc").default("asc").optional(),
});

const rankingQuerySchema = Joi.object({
  sortBy: Joi.string().valid("name", "creatorname", "templatename").optional(),
  sortOrder: Joi.string().valid("asc", "desc").default("asc").optional(),
});

const userQuerySchema = Joi.object({
  name: Joi.string().optional(),
});

const templateSchema = Joi.object({
  name: Joi.string().required(),
  creator_id: Joi.number().optional(),
  description: Joi.string().optional(),
  items: Joi.array()
    .items(
      Joi.object().keys({
        item_name: Joi.string().required(),
      })
    )
    .required(),
  editkey: Joi.string().optional(),
  tags: Joi.array().items(Joi.number()).optional(),
});

const rankingSchema = Joi.object({
  ranking_name: Joi.string().required(),
  template_id: Joi.number().required(),
  creator_id: Joi.number().optional(),
  description: Joi.string().optional(),
  items: Joi.array()
    .items(
      Joi.object().keys({
        item_name: Joi.string().required(),
        item_note: Joi.string().optional(),
        deletable: Joi.boolean().optional(),
        rank_number: Joi.number().required(),
        blank: Joi.boolean().optional(),
        id: Joi.string().optional(),
      })
    )
    .required(),
  creation_time: Joi.date().format("YYYY-MM-DD HH:mm:ss"),
});

const userSchema = Joi.object({
  user_name: Joi.string().required(),
});

const tagSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = {
  querySchema,
  rankingQuerySchema,
  userQuerySchema,
  templateSchema,
  rankingSchema,
  userSchema,
  tagSchema,
};
