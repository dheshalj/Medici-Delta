/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useColorScheme, View } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";

import { Colors } from "react-native/Libraries/NewAppScreen";

import UserInactivity from "react-native-user-inactivity";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { navigationRef } from "./helpers/RootNavigation";

// Screens
import { LoginScreen } from "./pages/LoginScreen";
import { RegisterScreen } from "./pages/RegisterScreen";
import { DashboardScreen } from "./pages/DashboardScreen";
import { ProfileScreen } from "./pages/ProfileScreen";
import { RequestHistoryScreen } from "./pages/RequestHistoryScreen";
import { AllAgentsScreen } from "./pages/AllAgentsScreen";
import { ClientListScreen } from "./pages/ClientListScreen";
import { ClientProfileScreen } from "./pages/ClientProfile";
import { ClientReqListScreen } from "./pages/ClientReqList";
import { AgentAddScreen } from "./pages/AgentAdd";

import vars, { getIsLoggingInGlobalValue } from "../../vars";
import { PopUp } from "../../ui/Popups";
import { Utils } from "../../utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { AgentDashboardScreen } from "./pages/AgentDashboardScreen";
import { AllClientsScreen } from "./pages/AllClientsScreen";
import { ClientDashboardScreen } from "./pages/ClientDashboardScreen";
import { AllRequestsScreen } from "./pages/AllRequestsScreen";

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "gray",
    secondary: "yellow",
    light: "white",
    background: "white",
  },
};

export function AdminScreen() {
  (async () => {
    await Utils.getExRates(
      new Date(new Date().getTime() - 6 * 864e5),
      new Date()
    );
  })();

  const [active, setActive] = useState(true);
  const [timer, setTimer] = useState(vars.TimeOutDur);

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : "white", // Colors.lighter,
  };

  const [loaded] = useFonts({
    "Poppins-Bold": require("../../../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../../../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../../../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../../../assets/fonts/Poppins-SemiBold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, ...backgroundStyle }}>
          <UserInactivity
            isActive={active}
            timeForInactivity={timer}
            onAction={(isActive) => {
              setActive(isActive);
            }}
            style={{ flex: 1, ...backgroundStyle }}
          >
            <NavigationContainer
              theme={theme as any}
              independent={true}
              ref={navigationRef}
            >
              <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Register"
                  component={RegisterScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Dashboard"
                  component={DashboardScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AgentDashboard"
                  component={AgentDashboardScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ClientDashboard"
                  component={ClientDashboardScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Profile"
                  component={ProfileScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="RequestHistory"
                  component={RequestHistoryScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AllAgents"
                  component={AllAgentsScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AllClients"
                  component={AllClientsScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AllRequests"
                  component={AllRequestsScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ClientList"
                  component={ClientListScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ClientProfile"
                  component={ClientProfileScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ClientReqList"
                  component={ClientReqListScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AgentAdd"
                  component={AgentAddScreen}
                  options={{ headerShown: false }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </UserInactivity>
          <PopUp.Info
            type="info"
            title="Session Timeout !"
            body="6 mins of inactivity elapsed"
            button={{
              text: "Login",
              onPress: () =>
                navigationRef.navigate("Login" as never, {} as never),
            }}
            exception={!getIsLoggingInGlobalValue()}
            active={[!active, setActive]}
          />
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}
