import i18next from "i18next";
import * as yup from "yup";

const ITEMS = "items";
const TITLE = "title";

const itemSchema = yup.object({
    img_name: yup.string().required({ key: "missing_item_name", title: ITEMS }),
    img_uri: yup
        .string()
        .when("$hasImages", ([images], schema) =>
            images === true
                ? schema.required({ key: "missing_image", title: ITEMS })
                : schema
        ),
});
const templateSchema = yup.object().shape({
    title: yup.string().required({ key: "no_title", title: TITLE }),
    items: yup
        .array()
        .when("$isBlank", ([blank], schema) =>
            blank === false
                ? schema
                      .of(itemSchema)
                      .min(5, { key: "not_enough_items", title: ITEMS })
                : schema
        ),
});

export const meetsTemplateRequirements = async (data) => {
    try {
        await templateSchema.validate(
            {
                title: data.title,
                items: data.items,
            },
            {
                abortEarly: false,
                context: { hasImages: data.hasImages, isBlank: data.isBlank },
            }
        );
    } catch (err) {
        const errors = {};
        err.errors.map((e) => {
            if (!errors[e.title]) {
                errors[e.title] = new Set();
            }
            errors[e.title].add(i18next.t(`templates.errors.${e.key}`));
        });

        const finalErrors = {};
        for (const key in errors) {
            finalErrors[key] = Array.from(errors[key]);
        }

        throw { errors: finalErrors };
    }
};
