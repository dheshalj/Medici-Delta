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
import { Chip, Surface, Card, Title, Paragraph } from "react-native-paper";
import vars, { useIsLoggingInGlobal } from "src/vars";

import {
  LargeTextButton,
  SmallTextButton,
  Charts,
  InputBox,
  PopUp,
} from "src/ui";

import { Format, Utils } from "src/utils";

import { Backend } from "src/backend";
import { Data } from "../helpers/Data";
import { Cards } from "src/ui/Cards";
import { Avatar } from "src/ui/Avatar";

import Moment from "moment";
Moment.locale("en");

export function DashboardScreen({ route, navigation }: any) {
  const {
    nameOfUser,
    NIC,
    businessName,
    BRNumber,
    mobileNumber,
    domain,
    indicator,
    syndicate,
    $balance,
    රුbalance,
  } = JSON.parse(route.params.details);

  React.useEffect(() => {
    (async () => {
      await Data.updateReqs(indicator);
    })();
  }, [indicator]);

  const [getAmountInUSD, setAmountInUSD] = useState("");
  const [getAmountInLKR, setAmountInLKR] = useState("");
  const [getAmountCur, setAmountInCur] = useState("USD" as "USD" | "LKR");

  const todaysDate = new Date();

  const [getDate, setDate] = useState(
    new Date(todaysDate.getTime() + 3 * 24 * 60 * 60 * 1000)
  );
  const [open, setOpen] = useState(false);

  const [isReqLoading, setReqLoading] = useState(false);

  const [exRates, setExRates] = useState(Utils.exRates);

  return (
    <ScrollView
      alwaysBounceHorizontal={false}
      alwaysBounceVertical={false}
      bounces={false}
    >
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

        <Cards.CurrentBalance $balance={$balance} රුbalance={රුbalance} />

        <Card style={styles.exchangerate}>
          <Card.Content>
            <Paragraph style={styles.exchangeratepara}>
              {`Exchange Rate as of ${Moment(todaysDate).format("Do")} ${Moment(
                todaysDate
              ).format("MMM")} - ${parseFloat(
                exRates[exRates.length - 1].rate.toFixed(2)
              )}LKR`}
            </Paragraph>
          </Card.Content>
        </Card>

        <Charts
          labels={exRates.map((rt: any) => {
            return Utils.nth(parseInt(rt.date.split("-")[2], 10));
          })}
          datasets={[
            {
              data: exRates.map((rt: any) => parseFloat(rt.rate.toFixed(2))),
            },
          ]}
        />

        <View style={styles.flushview}>
          <Text style={styles.flushreq}>Flush Request</Text>
          <SmallTextButton
            textStyle={styles.flushhis}
            onPress={() => {
              navigation.navigate(
                "FlushHistory" as never,
                {
                  details: route.params.details,
                } as never
              );
            }}
          >
            Flush History
          </SmallTextButton>
        </View>

        <Surface style={styles.flushreqsurface}>
          <View style={styles.flushreqview}>
            <View style={styles.flushreq_1}>
              <InputBox
                title="Amount in USD"
                placeholder="2 000"
                disabled={getAmountCur === "USD" ? false : true}
                value={getAmountInUSD}
                onChangeText={(t: any) =>
                  setAmountInUSD(Format.Amount(t, " ", 2500))
                }
                style={styles.flushreqinput}
              />
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  backgroundColor: "#E7F3FF",
                  marginTop: 8,
                  marginLeft: 10,
                  marginRight: 10,
                  justifyContent: "center",
                  height: 35,
                  width: 35,
                  borderRadius: 7,
                }}
                onPress={() => {
                  setAmountInCur(getAmountCur === "USD" ? "LKR" : "USD");
                }}
              >
                <Text>{getAmountCur === "USD" ? "$" : "රු"}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.flushreq_2}>
              <InputBox
                title="Amount in LKR"
                placeholder="2 000"
                disabled={getAmountCur === "LKR" ? false : true}
                value={getAmountInLKR}
                onChangeText={(t: any) =>
                  setAmountInLKR(Format.Amount(t, " ", 2500*350))
                }
                style={styles.flushreqinput}
              />
            </View>
          </View>

          <InputBox
            title="Date to be flushed"
            disabled
            right={{
              color: "#595959",
              onPress: () => setOpen(true),
              name: "calendar-range",
            }}
            value={dateFormat(getDate)}
            style={styles.flushreqinput}
          />
          <LargeTextButton
            title="Request"
            isLoading={isReqLoading}
            style={styles.reqbutton}
            onPress={() => {
              setReqLoading(true);

              if (
                (getAmountCur === "USD" ? $balance : රුbalance) <
                (getAmountCur === "USD" ? 10 : 3500)
              ) {
                console.error("Too Low funds");
                setReqLoading(false);
                return;
              }

              if (
                (getAmountCur === "USD" ? $balance - 99 : රුbalance - 35000) <
                parseFloat(
                  getAmountCur === "USD" ? getAmountInUSD : getAmountInLKR
                )
              ) {
                console.error("Insufficient funds");
                setReqLoading(false);
                return;
              }

              Backend.Client.addReq(
                parseInt(
                  (getAmountCur === "USD"
                    ? getAmountInUSD
                    : getAmountInLKR
                  ).replace(" ", ""),
                  10
                ),
                getAmountCur,
                Date.now(),
                getDate,
                indicator,
                (err: any) => {
                  if (err) {
                    console.error("error sending req");
                    return;
                  }
                  console.warn("Successfully lodged !");
                }
              );
              setReqLoading(false);
            }}
          />
        </Surface>

        <PopUp.DatePickerModal
          methods={[open, setOpen, getDate, setDate]}
          minimumDate={getDate}
        />
      </View>
    </ScrollView>
  );
}

function dateFormat(date: Date): string {
  let da = Moment(date).format("DD")
  let mo = Moment(date).format("MM")
  let ye = Moment(date).format("YYYY")
  return `${da} - ${mo} - ${ye}`;
}

const styles = StyleSheet.create({
  linechartview: {
    paddingVertical: 30,
    paddingRight: 20,
    width: "100%",
  },

  exchangerate: {
    alignItems: "center",
    justifyContent: "center",
    elevation: 0,
    borderRadius: 20,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
  },
  exchangeratepara: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
  },
  flushview: {
    flexDirection: "row",
    marginRight: 30,
    marginLeft: 30,
    marginTop: 10,
    marginBottom: 15,
  },
  flushreq: {
    fontFamily: "Poppins-Medium",
    color: "#4251DE",
    fontSize: 14,
    textAlign: "left",
    flex: 1,
  },
  flushhis: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    textAlign: "right",
    flex: 1,
    textDecorationLine: "underline",
  },
  flushreqsurface: {
    elevation: 4,
    borderRadius: 15,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 15,
  },
  flushreqinput: {
    width: "100%",
  },

  flushreqview: {
    flexDirection: "row",
    marginTop: 10,
  },
  flushreq_1: {
    fontFamily: "Poppins-Medium",
    color: "#4251DE",
    fontSize: 14,
    textAlign: "left",
    flex: 1,
  },
  flushreq_2: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    textAlign: "right",
    flex: 1,
    textDecorationLine: "underline",
  },

  reqbutton: {
    marginBottom: 0,
  },
});
