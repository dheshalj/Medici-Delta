import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Paragraph} from 'react-native-paper';

import {Format, Utils} from 'src/utils';

export const Cards = {
  CurrentBalance: (props: {
    greenview?: boolean;
    $balance: number;
    රුbalance: number;
  }) => {
    const styles = stylesFuc(props.greenview);
    return (
      <Card style={styles.balancecard}>
        <Card.Content style={styles.balancecardcontent}>
          <Paragraph style={styles.balanceheading}>Current Balance</Paragraph>
          <View style={styles.balanceview}>
            <View style={styles.view_1}>
              <Paragraph style={styles.balanceIn$}>
                ${Format.AmountWithDeci(String(props.$balance), ',')}
              </Paragraph>
              <Paragraph style={styles.balanceInLKR}>
                {Format.AmountWithDeci(
                  String(
                    props.$balance *
                      Utils.exRates[Utils.exRates.length - 1].rate,
                  ),
                  ',',
                )}{' '}
                LKR
              </Paragraph>
            </View>
            <View style={styles.view_2}>
              <Paragraph style={styles.balanceIn$}>
                {Format.AmountWithDeci(String(props.රුbalance), ',')} LKR
              </Paragraph>
              <Paragraph style={styles.balanceInLKR}>
                $
                {Format.AmountWithDeci(
                  String(
                    props.රුbalance /
                      Utils.exRates[Utils.exRates.length - 1].rate,
                  ),
                  ',',
                )}
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  },
};

const stylesFuc = (greenview?: boolean) =>
  StyleSheet.create({
    balancecard: {
      backgroundColor: greenview ? '#ECFAF6' : '#E7F3FF',
      elevation: 0,
      borderRadius: 20,
      marginRight: 20,
      marginLeft: 20,
      marginBottom: 20,
    },
    balancecardcontent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    balanceheading: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 18,
      color: greenview ? '#2DC897' : '#608EE9',
    },
    balanceIn$: {
      fontFamily: 'Poppins-SemiBold',
      color: greenview ? '#2DC897' : '#608EE9',
      fontSize: 17,
    },
    balanceInLKR: {
      fontFamily: 'Poppins-Medium',
      fontSize: 12,
      color: '#8A8A8A',
    },
    balanceview: {
      flexDirection: 'row',
      marginTop: 20,
    },
    view_1: {
      fontFamily: 'Poppins-Medium',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 0.5,
      borderRightWidth: 0.5,
      borderRightColor: greenview ? '#2DC897' : '#4251DE',
    },
    view_2: {
      fontFamily: 'Poppins-Medium',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 0.5,
      textDecorationLine: 'underline',
      borderLeftWidth: 0.5,
      borderLeftColor: greenview ? '#2DC897' : '#4251DE',
    },
  });
