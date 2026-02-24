import { Pressable, Text } from "react-native";

const activeTab = "#F42C04";
const inactiveTab = "#625F63AA";
export const TabButton: React.FC<{
  active: boolean;
  title: string;
  onPress: () => void;
}> = ({ active, onPress, title }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: 8,
        backgroundColor: active ? activeTab : inactiveTab,
      }}
    >
      <Text
        style={{
          color: "white",
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
};
