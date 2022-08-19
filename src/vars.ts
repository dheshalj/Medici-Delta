const myInitObject = {
  IsLoggingIn: true,
  TimeOutDur: 1000000,
  overideNoGoBack: true,
  loginDetails: {},
  tokens: {
    accessToken: '',
    refreshToken: ''
  }
};
export default myInitObject;

import GlobalStore from 'react-native-global-state-hooks';
const IsLoggingInStore = new GlobalStore(false);
export const useIsLoggingInGlobal = IsLoggingInStore.getHook();
export const [getIsLoggingInGlobalValue, setIsLoggingInGlobalValue] = IsLoggingInStore.getHookDecoupled();