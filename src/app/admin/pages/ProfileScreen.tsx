import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar } from "react-native-paper";

import { InputBox, SmallTextButton } from "../../../ui";

export function ProfileScreen({ route, navigation }: any) {
  const [util_SyndicateShow, util_SyndicateShow_] = React.useState(false);

  const {
    nameOfUser,
    NIC,
    businessName,
    BRNumber,
    mobileNumber,
    domain,
    indicator,
    syndicate,
  } = JSON.parse(route.params.details);

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

        {/* // Name of the client */}
        <InputBox disabled title="Name of the client" value={nameOfUser} />

        {/* // NIC number */}
        <InputBox disabled title="NIC number" value={NIC} />

        {/* // Business Name */}
        <InputBox disabled title="Business Name" value={businessName} />

        {/* // BR Number */}
        <InputBox disabled title="BR Number" value={BRNumber} />

        {/* // Primary Mobile Number */}
        <InputBox disabled title="Primary Mobile Number" value={mobileNumber} />

        {/* // Domain */}
        <InputBox disabled title="Domain" value={domain} />

        {/* // Indicator */}
        <InputBox disabled title="Indicator" value={indicator} />

        {/* // Syndicate */}
        <InputBox
          disabled
          title="Syndicate"
          secureTextEntry={!util_SyndicateShow}
          right={{
            color: "#8F92A1",
            onPress: () => util_SyndicateShow_(!util_SyndicateShow),
            name: util_SyndicateShow ? "eye-off" : "eye",
          }}
          value={syndicate}
        />

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
    // fontSize: 15,
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
});
