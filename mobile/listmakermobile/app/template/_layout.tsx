import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { createCommonStyles } from "@/utils/styles";
import { HeaderBackButton } from "@react-navigation/elements";
import Constants from "expo-constants";
import { Stack, useNavigation } from "expo-router";
import { Text, View } from "react-native";

export default function TemplateLayout() {
    const { theme } = useAppContext();
    const commonStyles = createCommonStyles(theme);
    const navigation = useNavigation();
    const tint = Colors[theme].icon;

    return (
        <Stack
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: { backgroundColor: "transparent" },
                header: (props) => (
                    <View
                        style={[
                            commonStyles.basicRow,
                            {
                                paddingTop: Constants.statusBarHeight,
                                paddingHorizontal: 10,
                                paddingBottom: 5,
                                backgroundColor: Colors[theme].background,
                            },
                        ]}
                    >
                        <HeaderBackButton
                            onPress={() => navigation.goBack()}
                            tintColor={tint}
                        />
                        <Text style={commonStyles.titleText}>
                            {props.options.title || props.route.name}
                        </Text>
                    </View>
                ),
                headerTintColor: tint,
            }}
        >
            <Stack.Screen name="new" options={{ title: "New Template" }} />
            <Stack.Screen name="[id]/index" options={{ title: "Template" }} />
            <Stack.Screen
                name="[id]/create"
                options={{ title: "New Top List" }}
            />
            <Stack.Screen
                name="[id]/edit"
                options={{ title: "Edit Template" }}
            />
        </Stack>
    );
}
