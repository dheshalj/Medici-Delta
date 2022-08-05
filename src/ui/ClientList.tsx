/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { combineTransition } from "react-native-reanimated";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Backend } from "../backend";
import { tabheader, user } from "../types";

export const ClientList = (props: {
  client: user;
  parentID: string;
  state: tabheader;
  onPress?: ((state: tabheader, parent: string) => void) | undefined;
}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        props.onPress
          ? props.onPress(
              props.state,
        
              props.state === "pending"
                ? props.parentID
                : props.state === "active"
                ? props.parentID
                : props.state === "reject"
                ? props.parentID
                : props.parentID
            )
          : null
      }
    >
      <View style={styles.clientlist}>
        <View style={styles.client_det}>
          <Text
            style={{
              ...styles.client_name,
              color:
                props.state === "pending"
                  ? "#FFB800"
                  : props.state === "active"
                  ? "#2DC897"
                  : props.state === "reject"
                  ? "#F17A92"
                  : "#2F394E",
            }}
          >
            {props.client.nameOfUser}
          </Text>
          <Text style={styles.client_domain}>{props.client.domain}</Text>
        </View>

        <View style={styles.client_stat}>
          <TouchableOpacity style={styles.clientliststatus} disabled>
            <Icon
              size={12}
              name={"checkbox-blank-circle"}
              color={
                props.state === "pending"
                  ? "#FFB800"
                  : props.state === "active"
                  ? "#2DC897"
                  : props.state === "reject"
                  ? "#F17A92"
                  : "#2F394E"
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  clientlist: {
    flexDirection: "row",
    width: "100%",
  },
  clientliststatus: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(143, 146, 161, 0.08)",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
  },
  client_det: {
    flexDirection: "column",
  },
  client_name: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
  },
  client_domain: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
  },
  client_stat: {
    flexDirection: "column",
    marginBottom: 15,
    marginLeft: "auto",
    alignItems: "flex-end",
  },
  sec2_1: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
  },
  sec2_2: {
    fontFamily: "Poppins-Light",
    fontSize: 13,
  },
});
