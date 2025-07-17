const sharedColors = {
    white: "#ffffff",
    mid: "#7f7b82",
    red: "#af2016ff",
};
export const Colors = {
    light: {
        text: "#474a4f",
        background: "#f2f4f7",
        secondary: "#ffffff",
        icon: "#559102",
        fade: "#ffffff",
        ...sharedColors,
    },
    dark: {
        text: "#f7f3f1",
        background: "#24272b",
        secondary: "#292e32",
        icon: "#6a9d23",
        fade: "#000000",
        ...sharedColors,
    },
};

export type ColorKey = keyof typeof Colors.light & keyof typeof Colors.dark;
