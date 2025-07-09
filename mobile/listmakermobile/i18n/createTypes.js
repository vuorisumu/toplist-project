/* eslint-disable no-undef */
const fs = require("fs");
const path = require("path");

const inputDir = path.resolve(__dirname, "./locales/en-US");
const outputFile = path.resolve(__dirname, "../i18n.d.ts");

const getIndent = (level) => " ".repeat(level * 4);

const createNamespace = (obj, level = 1) => {
    return Object.entries(obj)
        .map(([key, value]) => {
            if (typeof value === "string") {
                return `${getIndent(level)}${key}: string;`;
            } else {
                return `${getIndent(level)}${key}: {\n${createNamespace(
                    value,
                    level + 1
                )}\n${getIndent(level)}};`;
            }
        })
        .join("\n");
};

function generate() {
    const namespaces = {};

    fs.readdirSync(inputDir).forEach((file) => {
        if (!file.endsWith(".json")) return;

        const namespace = path.basename(file, ".json");
        const fullPath = path.join(inputDir, file);
        const json = JSON.parse(fs.readFileSync(fullPath, "utf8"));

        // Start at level 2 (8 spaces) for proper alignment inside TS declaration
        namespaces[namespace] = createNamespace(json, 2);
    });

    const content = `import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
${Object.entries(namespaces)
    .map(([ns, keys]) => `      ${ns}: {\n${keys}\n      };`)
    .join("\n")}
    };
  }
}
`;

    fs.writeFileSync(outputFile, content, "utf8");
    console.log(`Types generated to ${outputFile}`);
}

generate();
