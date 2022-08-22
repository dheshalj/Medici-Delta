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
import { PendReq, PopUp, SmallTextButton } from "../../../ui";
import { flushreq } from "../../../types";
import { Utils } from "../../../utils";
import { Backend } from "../../../backend";
import { Cards } from "../../../ui/Cards";
import { Avatar } from "../../../ui/Avatar";

export function PendingRequestScreen({ route, navigation }: any) {
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

  // Popups
  const [popup_Key, setPopup_Key] = React.useState<[boolean, any]>([
    false,
    undefined,
  ]);
  const [popup_ErrorSyn, setPopup_ErrorSyn] = React.useState<[boolean, any]>([
    false,
    undefined,
  ]);
  const [popup_Reason, setPopup_Reason] = React.useState<[boolean, any]>([
    false,
    undefined,
  ]);
  const [textInput_Syndicate, textInput_Syndicate_] = React.useState("");
  const [textInput_Reason, textInput_Reason_] = React.useState<
    "Insufficient Balance" | "SWIFT Delay" | "CEFT Delay"
  >("Insufficient Balance");
  const [popup_Success, setPopup_Success] = React.useState(false);
  const [popup_Declined, setPopup_Declined] = React.useState(false);
  const [popup_Error, setPopup_Error] = React.useState(false);

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
        <Text style={styles.flushhistext}>Pending Requests</Text>

        <View>
          <TouchableOpacity
            style={styles.flushreload}
            onPress={() => {
              Data.updateClients(indicator).then((req) => {
                req ? setDataClients(req[0]) : null;
              });
            }}
          >
            <Icon name="reload" color="#8A8A8A" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.history}>
        {(() => {
          let clientstates = Object.fromEntries(
            dataClients.map((client) => [client.indicator, client.state])
          );
          let arr = [].concat
            .apply([], dataClients.map((client) => client.reqs) as any)
            .filter((req: flushreq) => clientstates[req.parentId] === "active")
            .filter((req: flushreq) => req.status === "In progress");
          return arr.length > 0 ? (
            arr
              .sort((a: any, b: any) => a.lodgedDate - b.lodgedDate)
              .map((req: flushreq) => {
                return (
                  <PendReq
                    key={req.id + Math.floor(Math.random() * 1000).toString()}
                    id={req.id}
                    value={{
                      valIn$: req.amountInUSD,
                      valInLKR: req.amountInLKR,
                    }}
                    lgdtime={new Date(req.lodgedDate)}
                    tbdtime={new Date(req.tobeflushedDate)}
                    onAccept={() => {
                      textInput_Syndicate_('')
                      setPopup_Key([true, req]);
                    }}
                    onDecline={() => {
                      setPopup_Reason([true, req]);
                    }}
                  />
                );
              })
          ) : (
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              No Pending Requests
            </Text>
          );
        })()}
      </ScrollView>
      <View style={styles.bottomNav}>
        <Divider style={styles.div} />
        <SmallTextButton
          textStyle={styles.gbth}
          onPress={() => {
            navigation.navigate(
              "Dashboard" as never,
              {
                details: route.params.details,
              } as never
            );
          }}
        >
          Go back to Home
        </SmallTextButton>
      </View>

      <PopUp.Key
        syndicate={syndicate}
        onSuccess={(req) => {
          Backend.Client.updateReq(
            req.id,
            req.parentId,
            {
              status: "Accepted",
              changedDate: new Date().getTime(),
            },
            (err) => {
              if (err) {
                console.log("Error at PendingRequestScreen.tsx:136", err);
                setPopup_Error(true);
                return;
              }
              setPopup_Success(true);
              Data.updateClients(indicator).then((users) => {
                return users ? setDataClients(users[0]) : null;
              });
            }
          );
        }}
        onDismiss={() => {}}
        active={[popup_Key, setPopup_Key]}
        error={[popup_ErrorSyn, setPopup_ErrorSyn]}
        txt={[textInput_Syndicate, textInput_Syndicate_]}
      />

      <PopUp.Reason
        onComplete={(res, req) => {
          console.log(res, req);
          Backend.Client.updateReq(
            req.id,
            req.parentId,
            {
              status: "Declined",
              changedDate: new Date().getTime(),
              reason: res,
            },
            (err) => {
              if (err) {
                console.log("Error at PendingRequestScreen.tsx:156", err);
                setPopup_Error(true);
                return;
              }
              setPopup_Declined(true);
              Data.updateClients(indicator).then((users) => {
                return users ? setDataClients(users[0]) : null;
              });
            }
          );
        }}
        onDismiss={() => {}}
        active={[popup_Reason, setPopup_Reason]}
        res={[textInput_Reason, textInput_Reason_]}
      />

      <PopUp.TryAgain
        onTryAgain={(req) => {
          textInput_Syndicate_('')
          setPopup_Key([true, req]);
        }}
        onDismiss={() => {}}
        active={[popup_ErrorSyn, setPopup_ErrorSyn]}
      />

      <PopUp.Info
        type="success"
        title="Request has been Flushed !"
        button={{
          text: "Go Back",
          onPress: () => {
            setPopup_Success(false);
          },
        }}
        exception={true}
        active={[popup_Success, setPopup_Success]}
      />

      <PopUp.Info
        type="error"
        title="Flush Request Declined !"
        button={{
          text: "Go Back",
          onPress: () => {
            setPopup_Declined(false);
          },
        }}
        exception={true}
        active={[popup_Declined, setPopup_Declined]}
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
    paddingRight: 10,
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
