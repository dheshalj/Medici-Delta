import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

class Errors {
  static display(props: {switcher: any; text: any}) {
    return props.text[props.switcher] ? (
      <Text style={styles.errorReason}>{props.text[props.switcher]}</Text>
    ) : null;
  }
}

export default Errors;

const styles = StyleSheet.create({
  errorReason: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: 'red',
  },
});
