import React from "react";
import { TouchableOpacity, ColorValue, StyleSheet } from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { tabheader } from "../types";

export const Tab = (props: {
  state: tabheader;
  color: ColorValue;
  currentTab: tabheader;
  setCurrentTab: (value: React.SetStateAction<tabheader>) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.setCurrentTab(props.state);
      }}
      style={
        props.currentTab === props.state
          ? { ...styles.tab, backgroundColor: props.color }
          : styles.tab
      }
    >
      <Icon
        size={19}
        name={"checkbox-blank-circle"}
        color={props.currentTab === props.state ? "#FFF" : props.color}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tab: {
    elevation: 0,
    width: 66,
    height: 66,
    backgroundColor: "rgba(143, 146, 161, 0.08)",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
  },
});
