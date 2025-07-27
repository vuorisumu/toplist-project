import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { createCommonStyles } from "@/utils/styles";
import { meetsTemplateRequirements } from "@/utils/validation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { Switch } from "react-native-gesture-handler";
import ButtonStyled from "../ButtonStyled";
import CategorySelection from "../inputs/CategorySelection";
import { DropdownItem } from "../inputs/Dropdown";
import EditableField from "../inputs/EditableField";
import ImagePicker from "../inputs/ImagePicker";
import ItemList from "../inputs/ItemList";
import { Paragraph } from "../Paragraph";

type Props = {
    data?: any;
    onSubmit: (data: any) => void;
    saving?: boolean;
};
export default function EditableTemplate({ data, onSubmit, saving }: Props) {
    const { t } = useTranslation();
    const { theme, user } = useAppContext();
    const commonStyles = createCommonStyles(theme);
    const [cover, setCover] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<
        string | DropdownItem | undefined
    >();
    const [items, setItems] = useState<any>([{ item_name: "" }]);
    const [isBlank, setIsBlank] = useState(false);
    const [hasImages, setHasImages] = useState(false);
    const [errors, setErrors] = useState<any>(null);

    useEffect(() => {
        console.log(category);
    }, [category]);

    const meetsRequirements = async () => {
        try {
            await meetsTemplateRequirements({
                title: title,
                items: items,
                hasImages: hasImages,
                isBlank: isBlank,
            });
            setErrors(null);
            return true;
        } catch (e: any) {
            setErrors(e.errors);
            return false;
        }
    };

    const handleSubmit = async () => {
        const canSave = await meetsRequirements();
        if (!canSave) return;

        // const templateData: any = {
        //     name: title,
        // };

        const removeCover = data && data.cover_image !== null && cover === null;
        const templateData: any = {
            name: title,
            settings: {
                hasImages: hasImages && !isBlank,
                isBlank,
            },
            ...(description.trim() && { description }),
            ...(cover !== null && { cover_image: cover }),
            ...(removeCover && { cover_image: "NULL" }),
            ...(category &&
                category !== "placeholder" &&
                (!data || data.category !== category) && { category }),
            ...(!data && { creator_id: user.user_id }),
        };

        templateData.items = isBlank
            ? [{ item_name: "" }]
            : items.map((i: any) => ({
                  item_name: i.item_name,
                  ...(hasImages && { img_id: i.img_id }),
              }));

        // create image array
        const addedImages =
            hasImages && !isBlank
                ? items
                      .filter((i: any) => i.item_name.trim() !== "" && i.img)
                      .map((i: any) => ({
                          id: i.img_id,
                          img: i.img,
                      }))
                : [];

        // add images to database
        if (addedImages.length > 0) {
            console.log("Images:");
            console.log(addedImages);
            // const res = await addNewImages(addedImages);
            // console.log(res);
        }

        onSubmit(templateData);
    };

    return (
        <View style={{ gap: 10 }}>
            <View>
                <Text style={commonStyles.subHeader}>
                    {t("templates.info")}
                </Text>
                <View style={styles.infoblock}>
                    <View>
                        <Text style={commonStyles.smallTitle}>
                            {t("templates.cover_image")}
                        </Text>
                        <ImagePicker img={cover} setImg={setCover} />
                    </View>
                    <EditableField
                        title={t("templates.name")}
                        value={title}
                        setValue={setTitle}
                        error={errors?.title !== undefined && title.length < 1}
                    />
                    <EditableField
                        title={t("templates.description")}
                        value={description}
                        setValue={setDescription}
                    />
                    <View style={styles.inputblock}>
                        <Text style={commonStyles.smallTitle}>
                            {t("templates.category")}
                        </Text>
                        <CategorySelection
                            value={category}
                            setValue={setCategory}
                        />
                    </View>
                </View>
            </View>

            <View style={{ gap: 5 }}>
                <Text style={commonStyles.subHeader}>
                    {t("templates.items")}
                </Text>
                <View style={commonStyles.basicRow}>
                    <Switch
                        value={isBlank}
                        onChange={() => setIsBlank(!isBlank)}
                        trackColor={{ true: Colors[theme].icon }}
                        thumbColor={Colors[theme].text}
                    />
                    <Paragraph>{t("templates.make_blank")}</Paragraph>
                </View>

                {!isBlank && (
                    <View style={commonStyles.basicRow}>
                        <Switch
                            value={hasImages}
                            onChange={() => setHasImages(!hasImages)}
                            trackColor={{ true: Colors[theme].icon }}
                            thumbColor={Colors[theme].text}
                        />
                        <Paragraph>{t("templates.has_images")}</Paragraph>
                    </View>
                )}

                {isBlank ? (
                    <Paragraph>{t("templates.blank_desc")}</Paragraph>
                ) : (
                    <ItemList
                        initialItems={items}
                        onChange={setItems}
                        hasImages={hasImages}
                    />
                )}
            </View>

            {errors && (
                <View>
                    {Object.entries(errors as Record<string, string[]>).map(
                        ([field, value]) =>
                            value.map((msg, i) => (
                                <Paragraph key={`${field}${i}`}>
                                    {msg}
                                </Paragraph>
                            ))
                    )}
                </View>
            )}

            <View>
                <ButtonStyled
                    title={t("common.save")}
                    icon="save"
                    size={26}
                    onPress={handleSubmit}
                    loading={saving}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    infoblock: {
        gap: 10,
    },
    inputblock: {
        gap: 5,
    },
});
