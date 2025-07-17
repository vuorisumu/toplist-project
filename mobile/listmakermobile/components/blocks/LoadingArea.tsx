import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { PropsWithChildren } from "react";
import { ActivityIndicator, View } from "react-native";

type Props = {
    loading: boolean;
} & PropsWithChildren;
export default function LoadingArea({ loading, children }: Props) {
    const { theme } = useAppContext();

    if (loading)
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: Colors[theme].secondary,
                    height: 150,
                    borderRadius: 20,
                    alignContent: "center",
                    justifyContent: "center",
                }}
            >
                <ActivityIndicator size={"large"} color={Colors[theme].icon} />
            </View>
        );

    return children;
}
