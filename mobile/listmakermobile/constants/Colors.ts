/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#f2f4f7";
const tintColorDark = "#24272b";

export const Colors = {
    light: {
        text: "#474a4f",
        background: "#f2f4f7",
        tint: tintColorLight,
        icon: "#559102",
        tabIconDefault: "#559102",
        tabIconSelected: tintColorLight,
    },
    dark: {
        text: "#f7f3f1",
        background: "#24272b",
        tint: tintColorDark,
        icon: "#6a9d23",
        tabIconDefault: "#6a9d23",
        tabIconSelected: tintColorDark,
    },
};

export type ColorKey = keyof typeof Colors.light & keyof typeof Colors.dark;
