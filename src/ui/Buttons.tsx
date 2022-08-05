import React, {ReactNode} from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Text} from 'react-native-paper';

export const SmallTextButton = (props: {
  children: ReactNode;
  textStyle?: StyleProp<TextStyle>;
  onPress?: (event: GestureResponderEvent) => void;
}) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.smallTextButton}>
      <Text
        style={
          props.textStyle
            ? {...styles.smallText, ...(props.textStyle as any)}
            : styles.smallText
        }>
        {props.children as any}
      </Text>
    </TouchableOpacity>
  );
};

export const LargeTextButton = (props: {
  title: string;
  uppercase?: boolean;
  isLoading: boolean;
  style?: StyleProp<TextStyle>;
  onPress: () => void;
}) => {
  return (
    <Button
      uppercase={props.uppercase ? props.uppercase : false}
      loading={props.isLoading}
      style={
        props.style
          ? {...styles.largeTextButton, ...(props.style as any)}
          : styles.largeTextButton
      }
      onPress={props.onPress}
      mode="contained">
      <Text style={styles.largeText}>{props.title}</Text>
    </Button>
  );
};

export const NButton = (props: {
  n: {
    text: string;
    mode?: "outlined" | "contained" | undefined;
    uppercase: boolean;
    style?: "green" | "red";
    onPress: () => void;
  }[];
}) => {
  return (
    <View style={styles.pendreqview}>
      {props.n.map((n) => {
        return (
          <Button
            mode={n.mode}
            uppercase={n.uppercase}
            style={{
              ...(n.style === "green"
                ? styles.pendreqacc
                : n.style === "red"
                ? styles.pendreqdec
                : undefined),
              width: `${Math.floor(100 / props.n.length) - (props.n.length === 1 ? 0 : 2)}%`,
            }}
            labelStyle={
              n.style === "green"
                ? styles.pendreqacctxt
                : n.style === "red"
                ? styles.pendreqdectxt
                : undefined
            }
            onPress={n.onPress}
          >
            {n.text}
          </Button>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  smallText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  smallTextButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeTextButton: {
    backgroundColor: '#608EE9',
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
  },
  largeText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  pendreqview: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  pendreqacc: {
    elevation: 0,
    borderRadius: 13,
    width: "48%",
    backgroundColor: "#2DC897",
  },
  pendreqdec: {
    borderRadius: 13,
    width: "48%",
    borderWidth: 1,
    borderColor: "#F07590",
  },
  pendreqacctxt: {
    fontFamily: "Poppins-Regular",
    color: "white",
    fontSize: 12,
    padding: 3,
  },
  pendreqdectxt: {
    fontFamily: "Poppins-Regular",
    color: "#F07590",
    fontSize: 12,
    padding: 3,
  },
});
