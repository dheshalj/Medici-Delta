import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, Avatar } from "react-native-paper";

import { InputBox, SmallTextButton, PopUp, InputCountry } from "../../../ui";
import { Backend } from "../../../backend";
import { Format } from "../../../utils";
import Errors from "../../../ui/Errors";
import { ErrorTypes_Register } from "../../../types";
import { Country, CountryCode } from "react-native-country-picker-modal";

export function RegisterScreen({ navigation }: any) {
  const [textInput_NameOfClient, textInput_NameOfClient_] = React.useState("");
  const [textInput_NIC, textInput_NIC_] = React.useState("");
  const [textInput_BusinessName, textInput_BusinessName_] = React.useState("");
  const [textInput_BRNumber, textInput_BRNumber_] = React.useState("");
  const [textInput_Country, textInput_Country_] = React.useState("");
  const [textInput_MobileNumber, textInput_MobileNumber_] =
    React.useState("+94 ");
  const [textInput_Domain, textInput_Domain_] = React.useState("");
  const [textInput_Indicator, textInput_Indicator_] = React.useState("");
  const [textInput_Syndicate, textInput_Syndicate_] = React.useState("");
  const [util_SyndicateShow, util_SyndicateShow_] = React.useState(false);

  const [errorSwitcher, setErrorSwitcher] = React.useState(
    undefined as ErrorTypes_Register
  );

  const [isLoading, setIsLoading] = React.useState(false);

  const [popup_Success, setPopup_Success] = React.useState(false);
  const [popup_Error, setPopup_Error] = React.useState(false);

  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country>();
  const [countryPickerVisible, setCountryPickerVisible] =
    useState<boolean>(false);

  return (
    <ScrollView
      alwaysBounceHorizontal={false}
      alwaysBounceVertical={false}
      bounces={false}
    >
      <View style={styles.page}>
        <Text style={styles.registerHeading}>Register Yourself Here !</Text>
        <View style={styles.logo}>
          <Avatar.Image size={120} source={require("imgs/avatar.jpg")} />
        </View>

        {/* // Name of the client */}
        <InputBox
          title="Name of the client"
          placeholder="John Doe"
          value={textInput_NameOfClient}
          onChangeText={(t) => textInput_NameOfClient_(t)}
        />

        {/* // NIC number (Digits Only) */}
        <InputBox
          title="NIC number (Digits Only)"
          placeholder="XXXXXXXXX(XXX)"
          maxLength={12}
          value={textInput_NIC}
          onChangeText={(t) => textInput_NIC_(NICFormat(t))}
        />

        {/* // Business Name */}
        <InputBox
          title="Business Name"
          placeholder="Company LLC"
          value={textInput_BusinessName}
          onChangeText={(t) => textInput_BusinessName_(t)}
        />

        {/* // BR Number */}
        <InputBox
          title="BR Number"
          placeholder="XXXXXXXXX"
          value={textInput_BRNumber}
          onChangeText={(t) => textInput_BRNumber_(t)}
        />

        {/* // Country */}
        <InputCountry
          title="Country"
          value={country ? country.name.toString() : "Sri Lanka"}
          setter={textInput_Country_}
          hooks={[
            [countryCode, setCountryCode],
            [country, setCountry],
            [countryPickerVisible, setCountryPickerVisible],
          ]}
          onChange={(newcountry) => {
            console.log(newcountry ? newcountry.callingCode[0] : "94");
            textInput_MobileNumber_(
              Format.MobileNumberFormat(
                textInput_MobileNumber,
                `+${newcountry ? newcountry.callingCode[0] : "94"}`
              )
            );
          }}
        />

        {/* // Primary Mobile Number */}
        <InputBox
          title="Primary Mobile Number"
          // maxLength={16}
          value={textInput_MobileNumber}
          onChangeText={(t) => {
            textInput_MobileNumber_(
              Format.MobileNumberFormat(
                t,
                `+${country ? country.callingCode[0] : "94"}`
              )
            );
          }}
        />

        {/* // Domain */}
        <InputBox
          title="Domain"
          placeholder="company.lk"
          value={textInput_Domain}
          onChangeText={(t) => textInput_Domain_(Format.DomainFormat(t))}
        />

        {/* // Indicator */}
        <InputBox
          title="Indicator"
          placeholder="1234 56 78 90 12"
          maxLength={16}
          value={textInput_Indicator}
          onChangeText={(t) => textInput_Indicator_(Format.IndicatorFormat(t))}
        />

        {/* // Syndicate */}
        <InputBox
          title="Syndicate"
          placeholder="XXX XXX"
          maxLength={7}
          secureTextEntry={!util_SyndicateShow}
          right={{
            color: "#595959",
            onPress: () => util_SyndicateShow_(!util_SyndicateShow),
            icon: util_SyndicateShow ? "eye-off" : "eye",
          }}
          value={textInput_Syndicate}
          onChangeText={(t) => textInput_Syndicate_(Format.SyndicateFormat(t))}
        />

        <Errors.display
          switcher={errorSwitcher}
          text={{
            Name: "Name of Client not specified !",
            NIC: "Invaild NIC Number !",
            BName: "Bussiness Name not specified !",
            BRNo: "Invaild BR Number !",
            MobNo: "Invaild Mobile Number !",
            Domain: "Invaild Domain !",
            Indicator: "Indicator must contain 12 digits !",
            Syndicate: "Syndicate must contain 6 digits !",
          }}
        />

        <Button
          uppercase={false}
          loading={isLoading}
          style={styles.registerButton}
          onPress={async () => {
            if (textInput_NameOfClient.length < 1) {
              setErrorSwitcher("Name");
              return;
            }
            if (!(textInput_NIC.length === 9 || textInput_NIC.length === 12)) {
              setErrorSwitcher("NIC");
              return;
            }
            if (textInput_BusinessName.length < 1) {
              setErrorSwitcher("BName");
              return;
            }

            if (textInput_BRNumber.length < 5) {
              // TODO: BR Number length
              setErrorSwitcher("BRNo");
              return;
            }

            if (textInput_MobileNumber.length === 14) {
              setErrorSwitcher("MobNo");
              return;
            }

            if (
              !/^(((?!\-))(xn\-\-)?[a-z0-9\-_]{0,61}[a-z0-9]{1,1}\.)*(xn\-\-)?([a-z0-9\-]{1,61}|[a-z0-9\-]{1,30})\.[a-z]{2,}$/.test(
                textInput_Domain
              )
            ) {
              setErrorSwitcher("Domain");
              return;
            }

            if (textInput_Indicator.length !== 16) {
              setErrorSwitcher("Indicator");
              return;
            }
            if (textInput_Syndicate.length !== 7) {
              setErrorSwitcher("Syndicate");
              return;
            }
            setErrorSwitcher(undefined);

            setIsLoading(true);
            Backend.Common.Register(
              {
                nameOfUser: textInput_NameOfClient,
                NIC: textInput_NIC,
                businessName: textInput_BusinessName,
                BRNumber: textInput_BRNumber,
                mobileNumber: textInput_MobileNumber,
                domain: textInput_Domain,
                indicator: textInput_Indicator,
                syndicate: textInput_Syndicate,
                $balance: 0.0,
                රුbalance: 0.0,
                type: "client",
              },
              (err) => {
                if (err) {
                  setPopup_Error(true);
                  setIsLoading(false);
                  return;
                }
                textInput_NameOfClient_("");
                textInput_NIC_("");
                textInput_BusinessName_("");
                textInput_BRNumber_("");
                textInput_MobileNumber_("");
                textInput_Domain_("");
                textInput_Indicator_("");
                textInput_Syndicate_("");
                setPopup_Success(true);
                setIsLoading(false);
              }
            );
          }}
          mode="contained"
        >
          <Text style={styles.registerText}>Register</Text>
        </Button>

        <PopUp.Info
          type="success"
          title="Successfully Registered !"
          button={{
            text: "Login",
            onPress: () => navigation.navigate("Login" as never, {} as never),
          }}
          exception={true}
          active={[popup_Success, setPopup_Success]}
        />

        <PopUp.Info
          type="error"
          title="Error !"
          button={{
            text: "Go back",
            onPress: () => {},
          }}
          exception={true}
          active={[popup_Error, setPopup_Error]}
        />

        <SmallTextButton onPress={() => navigation.navigate("Login", {})}>
          Already Registered ? Login
        </SmallTextButton>
      </View>
    </ScrollView>
  );
}

function NICFormat(t: string): string {
  return t.replace(/[^0-9]/g, "").trim();
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
});
