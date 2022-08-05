import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import Moment from "moment";
Moment.locale("en");

export const FlushReq = (props: {
  status: "pending" | "error" | "success";
  id: string;
  value: {
    valIn$: number;
    valInLKR: number;
  };
  lgdtime: Date;
  tbdtime?: Date;
  notShowStatus?: boolean;
  overrideIcon?: string;
}) => {
  return (
    <View style={styles.historylist}>
      <TouchableOpacity style={styles.historylistbutton}>
        <Icon
          size={15}
          name={
            props.overrideIcon
              ? props.overrideIcon
              : props.status === "pending"
              ? "arrow-left"
              : props.status === "success"
              ? "arrow-right"
              : "alert-circle-outline"
          }
          color={
            props.status === "pending"
              ? "#FFB800"
              : props.status === "success"
              ? "#2DC897"
              : "#F17A92"
          }
        />
      </TouchableOpacity>

      <View style={styles.sec1}>
        <Text style={styles.sec1_1}>#{props.id}</Text>
        <Text style={styles.sec1_2}>
          {formatDate(props.lgdtime)}
          {/* 17-Apr | 10:50am */}
        </Text>
      </View>

      <View style={styles.sec2}>
        <Text
          style={(() => {
            return {
              ...styles.sec2_1,
              color:
                props.status === "pending"
                  ? "#FFB800"
                  : props.status === "success"
                  ? "#2DC897"
                  : "#F17A92",
            };
          })()}
        >
          {props.value.valIn$}USD - {props.value.valInLKR}LKR
        </Text>
        {props.notShowStatus ? null : (
          <Text style={styles.sec2_2}>
            {props.status === "pending"
              ? "In progress"
              : formatDate(props.tbdtime)}
          </Text>
        )}
      </View>
    </View>
  );
};

function formatDate(date?: Date): string {
  if (!date) {
    return "undefined";
  }

  let da = Moment(date).format("DD");
  let mo = Moment(date).format("MM");
  let ye = Moment(date).format("YYYY");
  return `${Moment(date).format("DD")}-${Moment(date).format("MMM")} | ${Moment(
    date
  ).format("hh:mma")}`;
}

const styles = StyleSheet.create({
  historylist: {
    flexDirection: "row",
    width: "100%",
  },
  historylistbutton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(143, 146, 161, 0.08)",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
  },
  sec1: {
    flexDirection: "column",
    marginLeft: 15,
  },
  sec1_1: {
    fontFamily: "Poppins-Medium",
    color: "black",
    fontSize: 12.5,
  },
  sec1_2: {
    fontFamily: "Poppins-Light",
    fontSize: 13,
  },
  sec2: {
    flexDirection: "column",
    marginBottom: 15,
    marginLeft: "auto",
    alignItems: "flex-end",
  },
  sec2_1: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
  },
  sec2_2: {
    fontFamily: "Poppins-Light",
    fontSize: 13,
  },
});
