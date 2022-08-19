/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Text,
  View,
  BackHandler,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Divider, Snackbar } from "react-native-paper";
import vars, { useIsLoggingInGlobal } from "../../../vars";

import { Data } from "../helpers/Data";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ClientList, SmallTextButton, Tab } from "../../../ui";
import { user, tabheader } from "../../../types";
import { Utils } from "../../../utils";
import { Avatar } from "../../../ui/Avatar";

export function ClientListScreen({ route, navigation }: any) {
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

  const [exRates, setExRates] = useState(Utils.exRates);

  const [dataClients, setDataClients] = useState(Data.clients);
  const [dataAllClients, setDataAllClients] = useState(Data.allClients);

  React.useEffect(() => {
    navigation.addListener("focus", () => {
      Data.updateClients(indicator).then((users) => {
        users[0] ? setDataClients(users[0]) : null;
        users[1] ? setDataAllClients(users[1]) : null;
      });
    });
  }, [indicator]);

  const content = {
    pending: (
      <>
        {(() => {
          return dataAllClients.filter(
            (cli: user) => cli.parent === "ND" || cli.state === "pending"
          ).length > 0 ? (
            dataAllClients
              .filter(
                (cli: user) => cli.parent === "ND" || cli.state === "pending"
              )
              .map((cli: user) => {
                return (
                  <ClientList
                    key={cli.indicator}
                    client={cli}
                    parentID={indicator}
                    state="pending"
                    onPress={(state, parent) => {
                      navigation.navigate("ClientProfile", {
                        user: Object(cli),
                        state,
                        parent,
                      });
                    }}
                  />
                );
              })
          ) : (
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              No Pending Clients
            </Text>
          );
        })()}
      </>
    ),
    active: (
      <>
        {(() => {
          return dataClients.filter((cli: user) => cli.state === "active")
            .length > 0 ? (
            dataClients
              .filter((cli: user) => cli.state === "active")
              .map((cli: user) => {
                return (
                  <ClientList
                    key={cli.indicator}
                    client={cli}
                    parentID={indicator}
                    state="active"
                    onPress={(state, parent) => {
                      navigation.navigate("ClientReqList", {
                        user: cli,
                        state,
                        parent,
                      });
                    }}
                  />
                );
              })
          ) : (
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              No Active Clients
            </Text>
          );
        })()}
      </>
    ),
    reject: (
      <>
        {(() => {
          return dataClients.filter((cli: user) => cli.state === "reject")
            .length > 0 ? (
            dataClients
              .filter((cli: user) => cli.state === "reject")
              .map((cli: user) => {
                return (
                  <ClientList
                    key={cli.indicator}
                    client={cli}
                    parentID={indicator}
                    state="reject"
                    onPress={(state, parent) => {
                      navigation.navigate("ClientProfile", {
                        user: cli,
                        state,
                        parent,
                      });
                    }}
                  />
                );
              })
          ) : (
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              No Reject Clients
            </Text>
          );
        })()}
      </>
    ),
    deactive: (
      <>
        {(() => {
          return dataClients.filter((cli: user) => cli.state === "deactive")
            .length > 0 ? (
            dataClients
              .filter((cli: user) => cli.state === "deactive")
              .map((cli: user) => {
                return (
                  <ClientList
                    key={cli.indicator}
                    client={cli}
                    parentID={indicator}
                    state="deactive"
                    onPress={(state, parent) => {
                      navigation.navigate("ClientProfile", {
                        user: cli,
                        state,
                        parent,
                      });
                    }}
                  />
                );
              })
          ) : (
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              No Deactivated Clients
            </Text>
          );
        })()}
      </>
    ),
  };

  const [currentTab, setCurrentTab] = useState("pending" as tabheader);

  return (
    <View>
      <Avatar
        img={require("imgs/avatar.jpg")}
        name={nameOfUser}
        cb={() => {
          navigation.navigate(
            "Profile" as never,
            {
              details: route.params.details,
            } as never
          );
        }}
      />

      <View style={styles.clientlistview}>
        <Text style={styles.clientlisttext}>Client List</Text>
      </View>

      <View style={styles.tabs}>
        <Tab
          state="pending"
          color="#FFB800"
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        <Tab
          state="active"
          color="#2DC897"
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        <Tab
          state="reject"
          color="#F25475"
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        <Tab
          state="deactive"
          color="#2F394E"
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
      </View>

      <ScrollView style={styles.tabcontent}>
        {currentTab === "pending"
          ? content.pending
          : currentTab === "active"
          ? content.active
          : currentTab === "deactive"
          ? content.deactive
          : content.reject}
      </ScrollView>

      <View style={styles.bottomNav}>
        <Divider style={styles.div} />
        <SmallTextButton
          textStyle={styles.goback}
          onPress={() => {
            navigation.navigate(
              "Dashboard" as never,
              {
                details: route.params.details,
              } as never
            );
          }}
        >
          Go back
        </SmallTextButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chipview: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  chip: {
    margin: 20,
  },
  clientlistview: {
    flexDirection: "row",
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20,
  },
  clientlisttext: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "black",
    textAlign: "left",
    flex: 1,
  },
  clientlistrefresh: {
    marginRight: 5,
    flex: 1,
  },

  tabs: {
    flexDirection: "row",
    marginRight: 20,
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  tabcontent: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 20,
    paddingRight: 10,
    height: "60%",
  },
  bottomNav: {
    marginRight: 20,
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  div: {
    height: 1,
    width: "100%",
    marginTop: 19,
  },
  goback: {
    fontFamily: "Poppins-Regular",
    color: "#B9BAC8",
    marginTop: 19,
  },
});
