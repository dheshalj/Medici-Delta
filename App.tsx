/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ClientScreen} from './src/app/client';
import {AgentScreen} from 'src/app/agent';

function ChooseScreen({navigation}: any) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Client', {});
        }}>
        <Text>Client</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Agent', {});
        }}>
        <Text>Agent</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles._button}
        disabled
        onPress={() => {
          navigation.navigate('Admin', {});
        }}>
        <Text>Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default () => {  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Choose">
        <Stack.Screen
          name="Choose"
          component={ChooseScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Client"
          component={ClientScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Agent"
          component={AgentScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Admin"
          component={ClientScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  _button: {
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
