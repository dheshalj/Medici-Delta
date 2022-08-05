import React, {Dispatch, SetStateAction} from 'react';
import {Text, View, Modal, StyleSheet, TouchableOpacity} from 'react-native';

import Img_Logo from 'imgs/logo.svg';
import Img_Success from 'imgs/success_popup.svg';
import Img_Error from 'imgs/error_popup.svg';

import DatePicker from 'react-native-date-picker';

export const PopUp = {
  Info: (props: {
    type: 'info' | 'success' | 'error';
    title: string;
    body?: string;
    button: {
      text: string;
      onPress: () => void;
    };
    exception: boolean;
    active: [get: boolean, set: Dispatch<SetStateAction<boolean>>];
  }) => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={props.active[0] && props.exception}
        onRequestClose={() => {
          props.active[1](props.active[0]);
          props.button.onPress();
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.img}>
              {props.type === 'info' ? (
                <Img_Logo width="175" height="175" />
              ) : props.type === 'success' ? (
                <Img_Success width="75" height="100" />
              ) : (
                <Img_Error width="75" height="100" />
              )}
            </View>
            <Text
              style={{
                ...styles.modalText,
                color: props.type === 'error' ? '#F25475' : '#4251DE',
              }}>
              {props.title}
            </Text>
            {props.body ? (
              <Text style={styles.modalSmallText}>{props.body}</Text>
            ) : null}
            <TouchableOpacity
              onPress={() => {
                props.active[1](props.active[0]);
                props.button.onPress();
              }}
              style={styles.registerButton}>
              <Text style={styles.register}>{props.button.text}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  },
  DatePickerModal: (props: {
    methods: [
      getOpen: boolean,
      setOpen: (value: React.SetStateAction<boolean>) => void,
      getDate: Date,
      setDate: (value: React.SetStateAction<Date>) => void,
    ];
    minimumDate?: Date;
  }) => {
    return (
      <DatePicker
        modal
        open={props.methods[0]}
        date={props.methods[2]}
        minimumDate={props.minimumDate}
        mode={'date'}
        onConfirm={date => {
          props.methods[1](false);
          props.methods[3](date);
        }}
        onCancel={() => {
          props.methods[1](false);
        }}
      />
    );
  },
};

const styles = StyleSheet.create({
  img: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  register: {
    fontSize: 12,
  },
  registerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  modalSmallText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#8F92A1',
  },
});
