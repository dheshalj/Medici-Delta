import React from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {TextInput, Text} from 'react-native-paper';

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
  right?: Icon;
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
        disabled={props.disabled}
        maxLength={props.maxLength}
        value={props.value}
        onChangeText={t => (props.onChangeText ? props.onChangeText(t) : null)}
        style={
          props.textStyle
            ? {...styles(props.isCenter).input, ...props.textStyle as any}
            : styles(props.isCenter).input
        }
      />
    </View>
  );
};

const styles = (isCenter?: boolean) =>
  StyleSheet.create({
    title: {
      textAlign: isCenter ? 'center' : 'left',
      fontFamily: 'Poppins-Medium',
    },
    input: {
      textAlign: isCenter ? 'center' : 'left',
      marginBottom: 20,
      borderRadius: 50,
      fontSize: 15,
      fontFamily: 'Poppins-Medium',
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
