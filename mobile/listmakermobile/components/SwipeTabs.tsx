import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";

import Categories from "@/app/categories";
import Index from "../app/index";

const SwipeTabs = () => {
    const pagerRef = useRef<any>(null);
    const [page, setPage] = useState(0);

    const tabs = [
        { key: "home", title: "Home", component: <Index /> },
        { key: "categories", title: "Categories", component: <Categories /> },
    ];

    return (
        <View style={styles.container}>
            <PagerView
                style={{ flex: 1 }}
                initialPage={0}
                onPageSelected={(e) => setPage(e.nativeEvent.position)}
                ref={pagerRef}
            >
                {tabs.map((tab, index) => (
                    <View key={index}>{tab.component}</View>
                ))}
            </PagerView>

            <View style={styles.tabBar}>
                {tabs.map((tab, index) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tab, page === index && styles.activeTab]}
                        onPress={() => pagerRef.current?.setPage(index)}
                    >
                        <Text style={styles.tabText}>{tab.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#eee",
    },
    tab: {
        flex: 1,
        padding: 16,
        alignItems: "center",
    },
    activeTab: {
        backgroundColor: "#fff",
    },
    tabText: {
        fontSize: 16,
    },
});

export default SwipeTabs;
