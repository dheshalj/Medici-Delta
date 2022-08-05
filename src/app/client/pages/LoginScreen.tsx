import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';

import Logo from 'imgs/logo.svg';

import {useIsLoggingInGlobal} from 'src/vars';
import {InputBox, SmallTextButton} from 'src/ui';
import {Backend} from 'src/backend';
import Errors from 'src/ui/Errors';
import {ErrorTypes_Login} from 'src/types';

export function LoginScreen({navigation}: any) {

  const [textIndicator, setTextIndicator] = React.useState('0000 00 00 00 00');
  const [textSyndicate, setTextSyndicate] = React.useState('000 000');

  const [errorSwitcher, setErrorSwitcher] = React.useState(
    undefined as ErrorTypes_Login,
  );

  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <View style={styles.page}>
      <View style={styles.logo}>
        <Logo width="300" height="300" />
      </View>

      <InputBox
        title="Indicator"
        placeholder="1234 56 78 90 12"
        maxLength={16}
        isCenter={true}
        value={textIndicator}
        onChangeText={t => setTextIndicator(IndicatorFormat(t))}
      />

      <InputBox
        title="Syndicate"
        placeholder="XXX XXX"
        maxLength={7}
        isCenter={true}
        value={textSyndicate}
        onChangeText={t => setTextSyndicate(SyndicateFormat(t))}
        style={{marginBottom: 5}}
      />

      <SmallTextButton
        textStyle={styles.forgotSyndicate}
        /* onPress={() => navigation.navigate('Register', {})} */
      >
        Forgot your Syndicate ?
      </SmallTextButton>

      <Errors.display
        switcher={errorSwitcher}
        text={{
          UserNotExist: "User doesn't exist !",
          SyndMismatch: 'Syndicate Incorrect !',
          Indicator: 'Indicator must contain 12 digits !',
          Syndicate: 'Syndicate must contain 6 digits !',
        }}
      />

      <Button
        uppercase={false}
        loading={isLoading}
        style={styles.authorizeButton}
        onPress={async () => {
          if (textIndicator.length !== 16) {
            setErrorSwitcher('Indicator');
            return;
          }
          if (textSyndicate.length !== 7) {
            setErrorSwitcher('Syndicate');
            return;
          }

          setIsLoading(true);
          Backend.Common.Login(
            'client',
            textIndicator,
            textSyndicate,
            err => {
              if (err === 'user not found') {
                setErrorSwitcher('UserNotExist');
                setIsLoading(false);
                return;
              }
              if (err === 'synd incorrect') {
                setErrorSwitcher('SyndMismatch');
                setTextSyndicate('');
                setIsLoading(false);
                return;
              }
              setErrorSwitcher(undefined);
              setTextIndicator('');
              setTextSyndicate('');
              setIsLoading(false);
            },
            navigation,
          );
        }}
        mode="contained">
        <Text style={styles.authorizeText}>Authorize</Text>
      </Button>

      <SmallTextButton onPress={() => navigation.navigate('Register', {})}>
        Are you New to this Platform ? Register
      </SmallTextButton>
    </View>
  );
}

function IndicatorFormat(t: string): string {
  var txt = t.replace(/ /g, '').replace(/[^0-9]/g, '');
  return (
    txt.substring(0, 4) +
    ' ' +
    txt.substring(4, 6) +
    ' ' +
    txt.substring(6, 8) +
    ' ' +
    txt.substring(8, 10) +
    ' ' +
    txt.substring(10, 12)
  ).trim();
}

function SyndicateFormat(t: string): string {
  var txt = t.replace(/ /g, '');
  return (txt.substring(0, 3) + ' ' + txt.substring(3, 6)).trim();
}

const styles = StyleSheet.create({
  page: {
    alignContent: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 50,
    backgroundColor: 'white',
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorReason: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: 'red',
  },
  forgotSyndicate: {
    marginBottom: 30,
    color: '#FFB800',
  },
  register: {
    fontSize: 12,
  },
  authorizeButton: {
    backgroundColor: '#608EE9',
    borderRadius: 10,
    marginBottom: 10,
  },
  authorizeText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});
