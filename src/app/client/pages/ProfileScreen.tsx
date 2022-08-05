/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Avatar, Button, List } from "react-native-paper";

import { useIsLoggingInGlobal } from "src/vars";
import { InputBox, PopUp, SmallTextButton } from "src/ui";
import { Backend } from "src/backend";
import Errors from "src/ui/Errors";
import { ErrorTypes_Profile } from "src/types";

export function ProfileScreen({ route, navigation }: any) {
  const [errorSwitcher, setErrorSwitcher] = React.useState(
    undefined as ErrorTypes_Profile
  );

  const [popup_SuccessUpdate, setPopup_SuccessUpdate] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);

  const {
    nameOfUser,
    NIC,
    businessName,
    BRNumber,
    mobileNumber,
    domain,
    indicator,
    syndicate,
    bankAccDetails,
  } = JSON.parse(route.params.details);

  const [getAccNumber, setAccNumber] = React.useState(bankAccDetails.AccountNo);
  const [getBankName, setBankName] = React.useState(bankAccDetails.BankName);
  const [getBankBranch, setBankBranch] = React.useState(
    bankAccDetails.BankBranch
  );
  const [getSWIFTBICCode, setSWIFTBICCode] = React.useState(
    bankAccDetails.SWIFTBICCode
  );

  return (
    <ScrollView
      alwaysBounceHorizontal={false}
      alwaysBounceVertical={false}
      bounces={false}
    >
      <View style={styles.page}>
        <View style={styles.logo}>
          <Avatar.Image size={120} source={require("imgs/avatar.jpg")} />
        </View>
        <InputBox disabled title="Name of the client" value={nameOfUser} />
        <InputBox disabled title="NIC number" value={NIC} />
        <InputBox disabled title="Business Name" value={businessName} />
        <InputBox disabled title="BR Number" value={BRNumber} />
        <InputBox disabled title="Primary Mobile Number" value={mobileNumber} />
        <InputBox disabled title="Domain" value={domain} />
        <InputBox disabled title="Indicator" value={indicator} />

        <List.Section>
          <List.Accordion
            style={{
              borderRadius: 10,
              height: 40,
              padding: 0,
            }}
            titleStyle={{
              textAlign: "center",
              fontFamily: "Poppins-Medium",
              fontSize: 12,
            }}
            title="Bank Account Details"
          >
            <View
              style={{
                marginTop: 20,
                marginRight: 20,
                marginLeft: 20,
              }}
            >
              <InputBox
                title="Account Number"
                placeholder="0451842556557564"
                maxLength={16}
                value={getAccNumber}
                onChangeText={(t) => setAccNumber(t)}
                style={{ marginBottom: 15 }}
              />
              <InputBox
                title="Bank Name"
                placeholder="DFCC Bank PLC"
                value={getBankName}
                onChangeText={(t) => setBankName(t)}
                style={{ marginBottom: 15 }}
              />
              <InputBox
                title="Bank Branch"
                placeholder="Nawala"
                value={getBankBranch}
                onChangeText={(t) => setBankBranch(t)}
                style={{ marginBottom: 5 }}
              />
              <InputBox
                title="SWIFT/BIC Code"
                placeholder="XXXX XX XX ###"
                maxLength={14}
                value={getSWIFTBICCode}
                onChangeText={(t) => setSWIFTBICCode(t)}
                style={{ marginBottom: 5 }}
              />

              <Errors.display
                switcher={errorSwitcher}
                text={{
                  AccountNo: "Invaild Account Number !",
                  BankName: "Bank Name not specified !",
                  BankBranch: "Bank Branch not specified !",
                  SWIFTBICCode: "Invaild SWIFT/BIC Code",
                }}
              />

              <Button
                uppercase={false}
                loading={isLoading}
                style={styles.updateButton}
                onPress={async () => {
                  if (getAccNumber.length < 1) {
                    setErrorSwitcher("AccountNo");
                    return;
                  }
                  if (getBankName.length < 1) {
                    setErrorSwitcher("BankName");
                    return;
                  }
                  if (getBankBranch.length < 1) {
                    setErrorSwitcher("BankBranch");
                    return;
                  }
                  if (
                    !/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(
                      getSWIFTBICCode.replace(/ /g, "")
                    )
                  ) {
                    setErrorSwitcher("SWIFTBICCode");
                    return;
                  }
                  setErrorSwitcher(undefined);

                  setIsLoading(true);
                  Backend.Client.updateUser(
                    indicator,
                    {
                      "bankAccDetails.AccountNo": getAccNumber,
                      "bankAccDetails.BankName": getBankName,
                      "bankAccDetails.BankBranch": getBankBranch,
                      "bankAccDetails.SWIFTBICCode": getSWIFTBICCode,
                    },
                    (err) => {
                      if (err) {
                        console.error(err);
                        return;
                      }
                      setPopup_SuccessUpdate(true);
                    }
                  );
                  setIsLoading(false);
                }}
                mode="contained"
              >
                <Text style={styles.updateText}>Update</Text>
              </Button>

              <PopUp.Info
                type="success"
                title="Updated Account Details !"
                button={{
                  text: "OK",
                  onPress: () => {
                    setPopup_SuccessUpdate(false);
                  },
                }}
                exception={true}
                active={[popup_SuccessUpdate, setPopup_SuccessUpdate]}
              />
            </View>
          </List.Accordion>
        </List.Section>

        <View style={styles.bottomNav}>
          <SmallTextButton
            textStyle={styles.gbth}
            onPress={() => {
              navigation.goBack();
            }}
          >
            Go back to Home
          </SmallTextButton>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    alignContent: "center",
    justifyContent: "center",
    flex: 1,
    margin: 50,
    backgroundColor: "white",
  },
  logo: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  registerTitles: {
    fontFamily: "Poppins-Regular",
  },
  registerInputs: {
    marginBottom: 20,
    borderRadius: 50,
    fontSize: 15,
    fontFamily: "Poppins-Regular",
  },
  forgotSyndicate: {
    fontSize: 12,
    color: "#FFB800",
  },
  register: {
    fontSize: 12,
  },
  registerHeading: {
    fontFamily: "Poppins-Bold",
    color: "#608EE9",
    textAlign: "center",
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: "#608EE9",
    borderRadius: 10,
    marginBottom: 10,
  },
  registerText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  bottomNav: {
    alignItems: "center",
    justifyContent: "center",
  },
  gbth: {
    fontFamily: "Poppins-Regular",
    color: "#B9BAC8",
    marginTop: 15,
  },
  updateButton: {
    backgroundColor: "#608EE9",
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 15,
  },
  updateText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
});
