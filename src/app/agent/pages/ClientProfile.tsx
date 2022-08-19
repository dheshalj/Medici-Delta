import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar } from "react-native-paper";

import { InputBox, NButton, SmallTextButton } from "../../../ui";
import { tabheader, user } from "../../../types";
import { Backend } from "../../../backend";
import { Data } from "../helpers/Data";

export function ClientProfileScreen({ route, navigation }: any) {
  const [snack, setSnack] = React.useState({
    isVis: true,
    msg: "Hi",
    action: {
      label: "Undo",
      onPress: () => {},
    },
  });

  const client = {
    user: route.params.user as user,
    state: route.params.state as tabheader,
    parent: route.params.parent as string,
  };

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
                    Backend.Client.updateUser(
                      client.user.indicator,
                      {
                        state: "active",
                        parent: client.parent,
                      },
                      async (err: any) => {
                        if (err) {
                          console.log("Error at ClientList.tsx:238", err);
                          return;
                        }
                        // TODO: Open areyousure Popup here
                        Data.updateClients(client.user.indicator);
                        console.warn(`${client.parent} is now active`);
                        navigation.pop(1);
                      }
                    );
                  },
                },
                {
                  text: "Decline",
                  mode: "outlined",
                  uppercase: false,
                  style: "red",
                  onPress: () => {
                    Backend.Client.updateUser(
                      client.user.indicator,
                      {
                        state: "reject",
                        parent: client.parent,
                      },
                      async (err: any) => {
                        if (err) {
                          console.log("Error at ClientList.tsx:238", err);
                          return;
                        }
                        // TODO: Open areyousure Popup here
                        Data.updateClients(client.user.indicator);
                        console.warn(`${client.parent} is now rejected`);
                        navigation.pop(1);
                      }
                    );
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
                    Backend.Client.updateUser(
                      client.user.indicator,
                      {
                        state: "deactive",
                        parent: client.parent,
                      },
                      async (err: any) => {
                        if (err) {
                          console.log("Error at ClientList.tsx:238", err);
                          return;
                        }
                        // TODO: Open areyousure Popup here
                        Data.updateClients(client.user.indicator);
                        setSnack({
                          isVis: true,
                          msg: `${client.parent} is now deactive`,
                          action: snack.action,
                        });
                        navigation.pop(2);
                      }
                    );
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
                    Backend.Client.updateUser(
                      client.user.indicator,
                      {
                        state: "active",
                        parent: client.parent,
                      },
                      async (err: any) => {
                        if (err) {
                          console.log("Error at ClientList.tsx:238", err);
                          return;
                        }
                        // TODO: Open areyousure Popup here
                        Data.updateClients(client.user.indicator);
                        console.warn(`${client.parent} is now active`);
                        navigation.pop(1);
                      }
                    );
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
                    Backend.Client.updateUser(
                      client.user.indicator,
                      {
                        state: "active",
                        parent: client.parent,
                      },
                      async (err: any) => {
                        if (err) {
                          console.log("Error at ClientList.tsx:238", err);
                          return;
                        }
                        // TODO: Open areyousure Popup here
                        Data.updateClients(client.user.indicator);
                        console.warn(`${client.parent} is now active`);
                        navigation.pop(1);
                      }
                    );
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
