/* eslint-disable camelcase */
const Joi = require("joi").extend(require("@joi/date"));

const rankingQuerySchema = Joi.object({
  namesOnly: Joi.boolean().optional(),
  search: Joi.string().optional(),
  distinct: Joi.boolean().optional(),
  count: Joi.number().optional(),
  tempId: Joi.number().optional(),
  tname: Joi.string().optional(),
  rname: Joi.string().optional(),
  uname: Joi.string().optional(),
  category: Joi.alternatives(
    Joi.number().integer().optional(),
    Joi.array().items(Joi.number()).optional()
  ),
  sortBy: Joi.string()
    .valid("id", "name", "creatorname", "templatename")
    .optional(),
  sortOrder: Joi.string().valid("asc", "desc").default("asc").optional(),
  from: Joi.number().integer().optional(),
  amount: Joi.number().integer().optional(),
  creatorId: Joi.number().optional(),
});

const rankingSchema = Joi.object({
  toplist_name: Joi.string().required(),
  template_id: Joi.number().required(),
  creator_id: Joi.number().optional(),
  toplist_desc: Joi.string().optional(),
  ranked_items: Joi.array()
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
  creation_time: Joi.date().optional() /*.format("YYYY-MM-DD HH:mm:ss"),*/,
});

module.exports = {
  rankingQuerySchema,
  rankingSchema,
};
