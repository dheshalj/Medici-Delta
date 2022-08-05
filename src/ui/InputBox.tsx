import React from 'react';
import {StyleProp, StyleSheet, TextStyle} from 'react-native';
import {TextInput, Text} from 'react-native-paper';

export const InputBox = (props: {
  title: string;
  placeholder?: string;
  maxLength?: number;
  isCenter?: boolean;
  disabled?: boolean;
  secureTextEntry?: boolean;
  value?: string;
  style?: any | StyleProp<TextStyle>;
  onChangeText?: ((text: string) => void) & Function;
  right?: Icon;
}) => {
  return (
    <>
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
                name: props.right?.name as string,
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
          props.style
            ? {...styles(props.isCenter).input, ...props.style}
            : styles(props.isCenter).input
        }
      />
    </>
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
      name={props.name}
      color={props.color}
      onPress={props.onPress}
    />
  );
};

type Icon = {
  name: string;
  color: string;
  onPress?: () => void;
};
