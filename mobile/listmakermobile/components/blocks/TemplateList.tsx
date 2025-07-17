import { Text, View } from "react-native";
import { Paragraph } from "../Paragraph";
type Props = {
    templates?: any[];
};
export default function TemplateList({ templates }: Props) {
    if (!templates || templates.length === 0)
        return (
            <View>
                <Text>No templates found</Text>
            </View>
        );
    return (
        <View>
            {templates.map((template) => (
                <View key={`template${template.id}`}>
                    <Paragraph>{template.name}</Paragraph>
                </View>
            ))}
        </View>
    );
}
