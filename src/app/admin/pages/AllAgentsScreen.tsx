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
import { SmallTextButton } from "../../../ui";
import { flushreq } from "../../../types";
import { Utils } from "../../../utils";
import { Backend } from "../../../backend";
import { Cards } from "../../../ui/Cards";
import { Avatar } from "../../../ui/Avatar";
import { AgentList } from "../../../ui/AgentList";

export function AllAgentsScreen({ route, navigation }: any) {
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
  const [dataAgents, setDataAgents] = useState(Data.agents);

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
          dataAgents[0]
            ? dataAgents
                .map((client) => client.$balance)
                .reduce((acc, cur) => (acc ? acc : 0) + (cur ? cur : 0))
            : 0
        }
        රුbalance={
          dataAgents[0]
            ? dataAgents
                .map((client) => client.රුbalance)
                .reduce((acc, cur) => (acc ? acc : 0) + (cur ? cur : 0))
            : 0
        }
      />

      <View style={styles.flushview}>
        <Text style={styles.flushhistext}>All Agents</Text>

        <View>
          <TouchableOpacity
            style={styles.flushreload}
            onPress={() => {
              Data.updateAgents(indicator).then((req) => {
                req ? setDataAgents(req) : null;
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
              dataAgents.map((client) => client) as any
            );
            return arr.length > 0 ? (
              arr
                .map((req: any) => {
                  return (
                    <AgentList
                      client={req}
                      parentID={indicator}
                      onPress={() => {
                        navigation.navigate(
                          'AgentDashboard' as never,
                          {
                            details: route.params.details,
                            agent: req
                          } as never,
                        );
                      }}
                    />
                  );
                })
            ) : (
              <Text
                style={{ textAlign: "center", marginTop: 70, marginBottom: 70 }}
              >
                No Agents
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
