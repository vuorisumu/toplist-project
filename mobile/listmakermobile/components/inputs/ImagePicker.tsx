import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import {
    launchImageLibraryAsync,
    useMediaLibraryPermissions,
} from "expo-image-picker";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Image,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import ImagePlaceholder from "../ImagePlaceholder";

type Props = {
    img?: string | null;
    setImg?: (img: any) => void;
    small?: boolean;
};
export default function ImagePicker({ img, setImg, small }: Props) {
    const { theme } = useAppContext();
    const { t } = useTranslation();
    const [image, setImage] = useState<any>(img || null);
    const [status, requestPermission] = useMediaLibraryPermissions();

    const pickImage = async () => {
        if (!status?.granted) {
            const permission = await requestPermission();
            if (!permission.granted) {
                console.log("No permission");
                return;
            }
        }

        let result = await launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [5, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            const context = ImageManipulator.manipulate(result.assets[0].uri);
            context.resize({ width: small ? 100 : 600 });
            const image = await context.renderAsync();
            const resized = await image.saveAsync({
                format: SaveFormat.JPEG,
            });
            setImage(resized);
            if (setImg) setImg(resized);
        }
    };

    return (
        <View style={styles.container}>
            {image ? (
                <View style={small && { width: 40 }}>
                    {small ? (
                        <TouchableOpacity onPress={pickImage}>
                            <Image
                                source={{ uri: image.uri }}
                                style={[styles.image, { aspectRatio: 1 }]}
                            />
                        </TouchableOpacity>
                    ) : (
                        <Image
                            source={{ uri: image.uri }}
                            style={styles.image}
                        />
                    )}

                    {!small && (
                        <Pressable
                            onPress={() => setImage(null)}
                            style={styles.deleteButton}
                        >
                            <MaterialIcons
                                name={"delete"}
                                size={24}
                                color={Colors[theme].red}
                            />
                        </Pressable>
                    )}
                </View>
            ) : (
                <ImagePlaceholder
                    onPress={pickImage}
                    text={t("templates.pick_cover_img")}
                    small={small}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    placeholder: {
        width: "100%",
        height: 100,
        backgroundColor: "red",
        borderRadius: 20,
        borderWidth: 2,
    },
    image: {
        aspectRatio: "5/3",
        width: "100%",
        resizeMode: "cover",
        borderRadius: 5,
    },
    deleteButton: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: 4,
    },
});
