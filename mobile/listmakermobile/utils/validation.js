import i18next from "i18next";
import * as yup from "yup";

const templateSchema = yup.object().shape({
    title: yup.string().required({ key: "no_title" }),
    items: yup.array().min(5, { key: "not_enough_items" }),
});

export const meetsTemplateRequirements = async (data) => {
    try {
        await templateSchema.validate(
            {
                title: data.title,
                items: data.items,
            },
            { abortEarly: false }
        );
    } catch (err) {
        const errors = {};
        err.inner.map((e) => {
            if (!errors[e.path]) {
                errors[e.path] = [];
            }
            errors[e.path].push(i18next.t(`templates.errors.${e.message.key}`));
        });
        throw { errors: errors };
    }
};
