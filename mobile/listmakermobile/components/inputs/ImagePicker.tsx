import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { createCommonStyles } from "@/utils/styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
    launchImageLibraryAsync,
    useMediaLibraryPermissions,
} from "expo-image-picker";
import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import ImagePlaceholder from "../ImagePlaceholder";

export default function ImagePicker() {
    const { theme } = useAppContext();
    const commonStyles = createCommonStyles(theme);
    const [image, setImage] = useState<string | null>(null);
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
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            {image ? (
                <View>
                    <Image source={{ uri: image }} style={styles.image} />
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
                </View>
            ) : (
                <ImagePlaceholder
                    onPress={pickImage}
                    text="Pick image from gallery"
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
