import React, { useState } from "react";
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInputFocusEventData,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { TextInput, Text } from "react-native-paper";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";

export const InputBox = (props: {
  title: string;
  placeholder?: string;
  maxLength?: number;
  isCenter?: boolean;
  disabled?: boolean;
  secureTextEntry?: boolean;
  value?: string;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  onChangeText?: ((text: string) => void) & Function;
  right?: Icon | React.ReactNode | any;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
}) => {
  return (
    <View style={props.style}>
      <Text variant="titleSmall" style={styles(props.isCenter).title}>
        {props.title}
      </Text>
      <TextInput
        mode="outlined"
        placeholder={props.placeholder}
        dense={true}
        secureTextEntry={props.secureTextEntry}
        right={
          props.right
            ? getIcon_({
                icon: props.right?.icon as string,
                color: props.right?.color as string,
                onPress: props.right?.onPress,
              })
            : undefined
        }
        onFocus={props.onFocus}
        disabled={props.disabled}
        maxLength={props.maxLength}
        value={props.value}
        onChangeText={(t) =>
          props.onChangeText ? props.onChangeText(t) : null
        }
        style={
          props.textStyle
            ? { ...styles(props.isCenter).input, ...(props.textStyle as any) }
            : styles(props.isCenter).input
        }
      />
    </View>
  );
};

export const InputCountry = (props: {
  title: string;
  placeholder?: string;
  value?: string;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  hooks: [
    [
      countryCode: CountryCode,
      setCountryCode: React.Dispatch<React.SetStateAction<CountryCode>>
    ],
    [
      country: Country,
      setCountry: React.Dispatch<React.SetStateAction<Country>>
    ],
    [
      countryPickerVisible: boolean,
      setCountryPickerVisible: React.Dispatch<React.SetStateAction<boolean>>
    ]
  ];
  onChange: (country: Country) => void
}) => {
  return (
    <View style={props.style}>
      <Text variant="titleSmall" style={styles(false).title}>
        {props.title}
      </Text>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          mode="outlined"
          dense={true}
          disabled
          value={props.value}
          style={{
            textAlign: "right",
            flex: 1,
            ...(props.textStyle
              ? { ...styles(false).input, ...(props.textStyle as any) }
              : styles(false).input),
          }}
        />

        <TouchableOpacity
          style={{
            alignItems: "center",
            borderColor: "#8d8d8d",
            borderWidth: 1,
            marginTop: 6,
            marginLeft: 10,
            justifyContent: "center",
            height: 42,
            width: 42,
            borderRadius: 4,
          }}
        >
          <CountryPicker
            countryCode={props.hooks[0][0]}
            withFilter
            withFlag
            withEmoji
            onSelect={(country: Country) => {
              props.hooks[0][1](country.cca2);
              props.hooks[1][1](country);
              props.onChange(country)
            }}
            containerButtonStyle={{
              alignContent: "center",
              justifyContent: "center",
              paddingBottom: 2,
              paddingLeft: 6,
              flex: 1,
            }}
            visible={props.hooks[2][0]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = (isCenter?: boolean) =>
  StyleSheet.create({
    title: {
      textAlign: isCenter ? "center" : "left",
      fontFamily: "Poppins-Medium",
    },
    input: {
      textAlign: isCenter ? "center" : "left",
      marginBottom: 20,
      borderRadius: 50,
      fontSize: 15,
      fontFamily: "Poppins-Medium",
    },
  });

export const getIcon_ = (props: Icon): React.ReactNode => {
  return (
    <TextInput.Icon
      name={props.icon}
      color={props.color}
      onPress={props.onPress}
    />
  );
};

type Icon = {
  icon: string;
  color: string;
  onPress?: () => void;
};
