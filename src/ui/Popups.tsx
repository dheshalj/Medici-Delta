import "intl";
import "intl/locale-data/jsonp/en";

import React, { Dispatch, SetStateAction, useState } from "react";
import { Text, View, Modal, StyleSheet, TouchableOpacity } from "react-native";

import Img_Logo from "imgs/logo.svg";
import Img_Success from "imgs/success_popup.svg";
import Img_Error from "imgs/error_popup.svg";

// import DatePicker from 'react-native-date-picker';
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { InputBox } from "./InputBox";
import { Format } from "../utils";
import { LargeTextButton } from "./Buttons";

import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const PopUp = {
  Info: (props: {
    type: "info" | "success" | "error";
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
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.img}>
              {props.type === "info" ? (
                <Img_Logo width="175" height="175" />
              ) : props.type === "success" ? (
                <Img_Success width="75" height="100" />
              ) : (
                <Img_Error width="75" height="100" />
              )}
            </View>
            <Text
              style={{
                ...styles.modalText,
                color: props.type === "error" ? "#F25475" : "#4251DE",
              }}
            >
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
              style={styles.registerButton}
            >
              <Text style={styles.register}>{props.button.text}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  },
  Key: (props: {
    syndicate: string;
    onSuccess: (req: any) => void;
    onDismiss: () => void;
    active: [get: [boolean, any], set: Dispatch<SetStateAction<[boolean, any]>>];
    error: [get: [boolean, any], set: Dispatch<SetStateAction<[boolean, any]>>];
    txt: [get: string, set: Dispatch<SetStateAction<string>>];
  }) => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={props.active[0][0]}
        onRequestClose={() => {
          props.active[1](props.active[0]);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.img}>
              <Img_Logo width="175" height="175" />
            </View>
            <InputBox
              isCenter
              title="Syndicate"
              placeholder="XXX XXX"
              value={props.txt[0]}
              style={styles.keyInput}
              onChangeText={(t) => props.txt[1](Format.SyndicateFormat(t))}
            />
            <LargeTextButton
              title={"Confirm"}
              isLoading={false}
              style={{
                marginTop: 30,
                borderRadius: 5,
              }}
              onPress={() => {
                props.active[1]([false, props.active[0][1]])
                if (props.syndicate === props.txt[0]) {
                  props.onSuccess(props.active[0][1])
                } else {
                  props.error[1]([true, props.error[0][1]])
                }
              }}
            />

            <TouchableOpacity
              onPress={() => {
                props.onDismiss();
                props.active[1]([false, props.active[0][1]]);
              }}
              style={styles.registerButton}
            >
              <Text style={styles.register}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  },
  Reason: (props: {
    onComplete: (res: string, req: any) => void;
    onDismiss: () => void;
    res: [get: string, set: Dispatch<SetStateAction<"Insufficient Balance" | "SWIFT Delay" | "CEFT Delay">>];
    active: [get: [boolean, any], set: Dispatch<SetStateAction<[boolean, any]>>];
  }) => {
    const [isFocus, setIsFocus] = useState(false);
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={props.active[0][0]}
        onRequestClose={() => {
          props.active[1](props.active[0]);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.img}>
              <Img_Logo width="175" height="175" />
            </View>

            <Text
              style={{
                ...styles.modalText,
                color: "#2F394E",
              }}
            >
              Reason
            </Text>

            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: "black" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={[
                { label: "Insufficient Balance", value: "Insufficient Balance" },
                { label: "SWIFT Delay", value: "SWIFT Delay" },
                { label: "CEFT Delay", value: "CEFT Delay" },
              ]}
              maxHeight={150}
              labelField="label"
              valueField="value"
              placeholder={props.res[0]}
              value={props.res[0]}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item: any) => {
                props.res[1](item.value);
                setIsFocus(false);
              }}
            />

            <LargeTextButton
              title={"Send"}
              isLoading={false}
              style={{
                marginTop: 10,
                borderRadius: 5,
              }}
              onPress={() => {
                props.active[1]([false, props.active[0][1]])
                props.onComplete(props.res[0], props.active[0][1]);
              }}
            />

            <TouchableOpacity
              onPress={() => {
                props.onDismiss();
                props.active[1]([false, props.active[0][1]]);
              }}
              style={styles.registerButton}
            >
              <Text style={styles.register}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  },
  TryAgain: (props: {
    onTryAgain: (req: any) => void;
    onDismiss: () => void;
    res: [get: string, set: Dispatch<SetStateAction<"Insufficient Balance" | "SWIFT Delay" | "CEFT Delay">>];
    active: [get: [boolean, any], set: Dispatch<SetStateAction<[boolean, any]>>];
  }) => {
    const [isFocus, setIsFocus] = useState(false);
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={props.active[0][0]}
        onRequestClose={() => {
          props.active[1](props.active[0]);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.img}>
              <Img_Logo width="175" height="175" />
            </View>

            <Text
              style={{
                ...styles.modalText,
                color: "#2F394E",
              }}
            >
              Incorrect Syndicate
            </Text>

            <LargeTextButton
              title={"Try Again"}
              isLoading={false}
              style={{
                marginTop: 10,
                borderRadius: 5,
              }}
              onPress={() => {
                props.active[1]([false, props.active[0][1]])
                props.onTryAgain(props.active[0][1]);
              }}
            />

            <TouchableOpacity
              onPress={() => {
                props.onDismiss();
                props.active[1]([false, props.active[0][1]]);
              }}
              style={styles.registerButton}
            >
              <Text style={styles.register}>Cancel</Text>
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
      getDate: Date | undefined,
      setDate: (value: React.SetStateAction<CalendarDate>) => void
    ];
    minimumDate?: Date;
  }) => {
    return (
      <DatePickerModal
        locale="en"
        mode="single"
        visible={props.methods[0]}
        date={props.methods[2]}
        onConfirm={(params) => {
          props.methods[1](false);
          props.methods[3](params.date);
        }}
        onDismiss={() => {
          props.methods[1](false);
        }}
        validRange={{
          startDate: props.minimumDate,
        }}
        saveLabel="Save"
      />
    );
  },
};

const styles = StyleSheet.create({
  img: {
    alignItems: "center",
    justifyContent: "center",
  },
  register: {
    fontSize: 11,
    color: "#8F92A1",
    fontFamily: "Poppins-Medium",
  },
  registerButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    paddingTop: 30,
    width: "70%",
    alignItems: "center",
    shadowColor: "#000",
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
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Poppins-Medium",
    fontSize: 13,
  },
  modalSmallText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    color: "#8F92A1",
  },
  keyInput: {
    marginTop: 15,
    height: 50,
    width: "100%",
    borderRadius: 12,
  },

  dropdown: {
    height: 50,
    width: "100%",
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontFamily: "Poppins-Medium",
  },
  placeholderStyle: {
    fontFamily: "Poppins-Medium",
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  inputSearchStyle: {
    height: 40,
    fontFamily: "Poppins-Medium",
  },
});
