/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Divider } from "react-native-paper";

import { Data } from "../helpers/Data";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ClientList, SmallTextButton } from "../../../ui";
import { flushreq, user } from "../../../types";
import { Utils } from "../../../utils";
import { Backend } from "../../../backend";
import { Cards } from "../../../ui/Cards";
import { Avatar } from "../../../ui/Avatar";

export function AllClientsScreen({ route, navigation }: any) {
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

  const agent = route.params.agent;

  const [isLoading, setisLoading] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setisLoading(true)
      setDataClients([] as unknown as [any])
      Data.updateClients(agent.indicator).then((req) => {
        setisLoading(false)
        req ? setDataClients(req[0]) : null;
      });
      console.log(dataClients);
    });
    return unsubscribe;
  }, [navigation, indicator]);

  const [exRates, setExRates] = useState(Utils.exRates);
  const [dataClients, setDataClients] = useState(Data.clients);

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

      <Cards.CurrentBalance
        greenview
        $balance={
          dataClients[0]
            ? dataClients
                .map((client) => client.$balance)
                .reduce((acc, cur) => (acc ? acc : 0) + (cur ? cur : 0))
            : 0
        }
        රුbalance={
          dataClients[0]
            ? dataClients
                .map((client) => client.රුbalance)
                .reduce((acc, cur) => (acc ? acc : 0) + (cur ? cur : 0))
            : 0
        }
      />

      <View style={styles.flushview}>
        <Text style={styles.flushhistext}>All Clients</Text>

        <View>
          <TouchableOpacity
            style={styles.flushreload}
            onPress={() => {
              Data.updateAgents(indicator).then((req) => {
                req ? setDataClients(req) : null;
              });
            }}
          >
            <Icon name="reload" color="#8A8A8A" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.history}>
        {(() => {
          let arr = [].concat.apply(
            [],
            dataClients.map((client) => client) as any
          );

          return isLoading ? (
            <Text
              style={{ textAlign: "center", marginTop: 70, marginBottom: 70 }}
            >
              Loading...
            </Text>
          ) : arr.length > 0 ? (
            arr
              // .slice(0, 2) // TODO: CHANGE THIS VALUE
              .map((cli: user) => {
                return (
                  <ClientList
                    key={cli.indicator}
                    client={cli}
                    parentID={indicator}
                    state={cli.state}
                    onPress={(state, parent) => {
                      navigation.navigate(
                        "ClientDashboard" as never,
                        {
                          details: route.params.details,
                          client: cli,
                        } as never
                      );
                    }}
                  />
                );
              })
          ) : (
            <Text
              style={{ textAlign: "center", marginTop: 70, marginBottom: 70 }}
            >
              No Clients
            </Text>
          );
        })()}
      </ScrollView>
      <View style={styles.bottomNav}>
        <Divider style={styles.div} />
        <SmallTextButton
          textStyle={styles.gbth}
          onPress={() => {
            navigation.goBack();
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
  currentbalancecard: {
    backgroundColor: "#ECFAF6",
    elevation: 0,
    borderRadius: 20,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20,
  },
  currentbalancecardcontent: {
    alignItems: "center",
    justifyContent: "center",
  },
  currentbalanceheading: {
    fontFamily: "Poppins-Medium",
    color: "#2DC897",
  },
  currentbalancebalanceInLKR: {
    fontFamily: "Poppins-SemiBold",
    color: "#2DC897",
    fontSize: 40,
    paddingTop: 25,
  },
  currentbalancebalanceIn$: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: "#8A8A8A",
  },
  history: {
    marginRight: 20,
    marginLeft: 20,
    height: "50%",
  },
  bottomNav: {
    marginRight: 20,
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  flushview: {
    flexDirection: "row",
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20,
  },
  flushhistext: {
    fontFamily: "Poppins-SemiBold",
    color: "black",
    textAlign: "left",
    flex: 1,
  },
  flushreload: {
    marginRight: 5,
    flex: 1,
  },
  div: {
    height: 1,
    width: "100%",
    marginTop: 15,
  },
  gbth: {
    fontFamily: "Poppins-Regular",
    color: "#B9BAC8",
    marginTop: 15,
  },
});
