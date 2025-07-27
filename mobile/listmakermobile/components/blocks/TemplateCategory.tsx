import { getCategoryByID } from "@/utils/cache";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Paragraph } from "../Paragraph";

type Props = {
    id: number;
};
export default function TemplateCategory({ id }: Props) {
    const { t } = useTranslation();
    const [category, setCategory] = useState("");
    useEffect(() => {
        getCategoryByID(id)
            .then((val) => setCategory(val))
            .catch((e) => console.log(e));
    }, [id]);

    return (
        <Paragraph>
            {t("templates.category")}: {category}
        </Paragraph>
    );
}
