import React from 'react';
import {Text, View, Image, StyleSheet, ImageSourcePropType} from 'react-native';
import {Chip} from 'react-native-paper';

export function Avatar(props: {
  img: ImageSourcePropType;
  name: string;
  cb: () => void;
}) {
  return (
    <View style={styles.chipview}>
      <Chip
        avatar={<Image source={props.img} />}
        style={styles.chip}
        onPress={props.cb}>
        <Text style={styles.chipname}>{props.name}</Text>
      </Chip>
    </View>
  );
}

const styles = StyleSheet.create({
  chipview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  chip: {
    margin: 20,
  },
  chipname: {
    fontFamily: 'Poppins-Medium',
  },
});
