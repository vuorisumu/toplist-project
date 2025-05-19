export const Colors = {
    light: {
        text: "#474a4f",
        background: "#f2f4f7",
        icon: "#559102",
    },
    dark: {
        text: "#f7f3f1",
        background: "#24272b",
        icon: "#6a9d23",
    },
};

export type ColorKey = keyof typeof Colors.light & keyof typeof Colors.dark;
