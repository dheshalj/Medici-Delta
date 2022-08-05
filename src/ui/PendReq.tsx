import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Surface } from "react-native-paper";
import { NButton, FlushReq } from ".";

export const PendReq = (props: {
  id: string;
  value: {
    valIn$: number;
    valInLKR: number;
  };
  lgdtime: Date;
  tbdtime?: Date;
  onAccept: () => void;
  onDecline: () => void;
}) => {
  return (
    <Surface style={styles.pendreqsurface}>
      <FlushReq
        status="pending"
        overrideIcon="arrow-right"
        id={props.id}
        value={props.value}
        notShowStatus
        lgdtime={props.lgdtime}
        tbdtime={props.tbdtime}
      />
      <NButton
        n={[
          {
            text: "Accept",
            mode: "contained",
            uppercase: false,
            style: "green",
            onPress: props.onAccept,
          },
          {
            text: "Decline",
            mode: "outlined",
            uppercase: false,
            style: "red",
            onPress: props.onDecline,
          },
        ]}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  pendreqsurface: {
    elevation: 0,
    borderRadius: 15,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 15,
    backgroundColor: "#fafafa",
  },
});
