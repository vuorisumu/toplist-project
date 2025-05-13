import { StyleSheet, Text } from "react-native";

import ViewContainer from "@/components/ViewContainer";
import { useEffect } from "react";
import { fetchAllCategories } from "../../api/categories";
import { fetchTemplateNamesByInput } from "../../api/templates";

export default function ExtraView() {
    useEffect(() => {
        fetchAllCategories()
            .then((res) => {
                console.log(res);
            })
            .catch((e) => console.log(e));

        fetchTemplateNamesByInput("t")
            .then((res) => {
                console.log(res);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);
    return (
        <ViewContainer>
            <Text>Blank</Text>
        </ViewContainer>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute",
    },
});
