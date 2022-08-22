import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar } from "react-native-paper";

import { InputBox, NButton, PopUp, SmallTextButton } from "../../../ui";
import { tabheader, user } from "../../../types";
import { Backend } from "../../../backend";
import { Data } from "../helpers/Data";

export function ClientProfileScreen({ route, navigation }: any) {
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

  const client = {
    user: route.params.user as user,
    state: route.params.state as tabheader,
    parent: route.params.parent as string,
  };

  // Popups
  const [popup_Key, setPopup_Key] = React.useState<[boolean, any]>([
    false,
    undefined,
  ]);
  const [popup_ErrorSyn, setPopup_ErrorSyn] = React.useState<[boolean, any]>([
    false,
    undefined,
  ]);

  const [keyForWhat, setKeyForWhat] = React.useState<
    "Accept" | "Decline" | "Deactivate" | "Activate"
  >();

  const [textInput_Syndicate, textInput_Syndicate_] = React.useState("");
  const [popup_Activated, setPopup_Activated] = React.useState(false);
  const [popup_Accepted, setPopup_Accepted] = React.useState(false);
  const [popup_Deactivated, setPopup_Deactivated] = React.useState(false);
  const [popup_Rejected, setPopup_Rejected] = React.useState(false);
  const [popup_Declined, setPopup_Declined] = React.useState(false);
  const [popup_Error, setPopup_Error] = React.useState(false);

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
        <InputBox
          disabled
          title="Name of the client"
          value={client.user.nameOfUser}
        />

        {/* // NIC number */}
        <InputBox disabled title="NIC number" value={client.user.NIC} />

        {/* // Business Name */}
        <InputBox
          disabled
          title="Business Name"
          value={client.user.businessName}
        />

        {/* // BR Number */}
        <InputBox disabled title="BR Number" value={client.user.BRNumber} />

        {/* // Primary Mobile Number */}
        <InputBox
          disabled
          title="Primary Mobile Number"
          value={client.user.mobileNumber}
        />

        {/* // Domain */}
        <InputBox disabled title="Domain" value={client.user.domain} />

        {/* // Indicator */}
        <InputBox disabled title="Indicator" value={client.user.indicator} />

        <View style={styles.bottomNav}>
          {client.state === "pending" ? (
            <NButton
              n={[
                {
                  text: "Accept",
                  mode: "contained",
                  uppercase: false,
                  style: "green",
                  onPress: () => {
                    setKeyForWhat("Accept");
                    setPopup_Key([true, client]);
                  },
                },
                {
                  text: "Decline",
                  mode: "outlined",
                  uppercase: false,
                  style: "red",
                  onPress: () => {
                    setKeyForWhat("Decline");
                    setPopup_Key([true, client]);
                  },
                },
              ]}
            />
          ) : client.state === "active" ? (
            <NButton
              n={[
                {
                  text: "Deactivate",
                  mode: "outlined",
                  uppercase: false,
                  style: "red",
                  onPress: () => {
                    setKeyForWhat("Deactivate");
                    setPopup_Key([true, client]);
                  },
                },
              ]}
            />
          ) : client.state === "deactive" ? (
            <NButton
              n={[
                {
                  text: "Activate",
                  mode: "contained",
                  uppercase: false,
                  style: "green",
                  onPress: () => {
                    setKeyForWhat("Activate");
                    setPopup_Key([true, client]);
                  },
                },
              ]}
            />
          ) : client.state === "reject" ? (
            <NButton
              n={[
                {
                  text: "Accept",
                  mode: "contained",
                  uppercase: false,
                  style: "green",
                  onPress: () => {
                    setKeyForWhat("Accept");
                    setPopup_Key([true, client]);
                  },
                },
              ]}
            />
          ) : null}
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

      <PopUp.Key
        syndicate={syndicate}
        onSuccess={(client) => {
          Backend.Client.updateUser(
            client.user.indicator,
            {
              state:
                keyForWhat == "Deactivate"
                  ? "deactive"
                  : keyForWhat === "Decline"
                  ? "reject"
                  : "active",
              parent: client.parent,
            },
            async (err: any) => {
              if (err) {
                console.log("Error at ClientList.tsx:238", err);
                return;
              }
              Data.updateAgents(client.user.indicator);
              keyForWhat == "Accept"
                ? setPopup_Accepted(true)
                : keyForWhat == "Activate"
                ? setPopup_Activated(true)
                : keyForWhat == "Deactivate"
                ? setPopup_Deactivated(true)
                : keyForWhat == "Decline"
                ? setPopup_Declined(true)
                : null;
            }
          );
        }}
        onDismiss={() => {}}
        active={[popup_Key, setPopup_Key]}
        error={[popup_ErrorSyn, setPopup_ErrorSyn]}
        txt={[textInput_Syndicate, textInput_Syndicate_]}
      />

      <PopUp.TryAgain
        onTryAgain={(client) => {
          textInput_Syndicate_("");
          setPopup_Key([true, client]);
        }}
        onDismiss={() => {}}
        active={[popup_ErrorSyn, setPopup_ErrorSyn]}
      />

      <PopUp.Info
        type="success"
        title="User has been Accepted !"
        button={{
          text: "Go Back",
          onPress: () => {
            setPopup_Accepted(false);
            navigation.pop(keyForWhat === "Deactivate" ? 2 : 1);
          },
        }}
        exception={true}
        active={[popup_Accepted, setPopup_Accepted]}
      />

      <PopUp.Info
        type="success"
        title="User has been Activated !"
        button={{
          text: "Go Back",
          onPress: () => {
            setPopup_Activated(false);
            navigation.pop(keyForWhat === "Deactivate" ? 2 : 1);
          },
        }}
        exception={true}
        active={[popup_Activated, setPopup_Activated]}
      />

      <PopUp.Info
        type="success"
        title="User has been Deactivated !"
        button={{
          text: "Go Back",
          onPress: () => {
            setPopup_Deactivated(false);
            navigation.pop(keyForWhat === "Deactivate" ? 2 : 1);
          },
        }}
        exception={true}
        active={[popup_Deactivated, setPopup_Deactivated]}
      />

      <PopUp.Info
        type="error"
        title="User has been Declined !"
        button={{
          text: "Go Back",
          onPress: () => {
            setPopup_Declined(false);
            navigation.pop(keyForWhat === "Deactivate" ? 2 : 1);
          },
        }}
        exception={true}
        active={[popup_Declined, setPopup_Declined]}
      />

      <PopUp.Info
        type="error"
        title="User has been Rejected !"
        button={{
          text: "Go Back",
          onPress: () => {
            setPopup_Rejected(false);
            navigation.pop(keyForWhat === "Deactivate" ? 2 : 1);
          },
        }}
        exception={true}
        active={[popup_Rejected, setPopup_Rejected]}
      />

      <PopUp.Info
        type="error"
        title="Error !"
        button={{
          text: "Go back",
          onPress: () => {
            setPopup_Error(false);
          },
        }}
        exception={true}
        active={[popup_Error, setPopup_Error]}
      />
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
