import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NativeBaseProvider } from "native-base";
import OnBoardingPage from './pages/OnBoardingPage';
import OnBoardingStatus from './pages/OnBoardingStatus';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import Pin from './pages/Pin';
import Name from './pages/Name';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import MarketPlace from './pages/MarketPlace';
import {UserList} from './UserList'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeScreen({users, setUsers}) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#ffffff", }}>
      <Feed users={users} setUsers={setUsers}/>
    </View>
  );
}

function SettingsScreen({ mobileNumber, users, setUsers }) {
  return (
    <View style={{ backgroundColor: "#ffffff" }}>
      <Profile mobileNumber={mobileNumber} users={users} setUsers={setUsers}/>
    </View>
  );
}

function MarketPlaceCollection({ mobileNumber }) {
  return (
    <View style={{ backgroundColor: "#ffffff" }}>
      <MarketPlace mobileNumber={mobileNumber} />
    </View>
  )
}

export default function App() {
  const [auth, setAuth] = React.useState(false);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [mobileNumber, setMobileNumber] = React.useState('8830921400');
  const [passcode, setpasscode] = React.useState('');
  const [login, setLogin] = React.useState(false);
  const [users,setUsers] = React.useState(UserList)

  React.useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@storage_Key')
        if (value !== null) {
          setLogin(true);
        }
      } catch (e) {
        // error reading value
      }
    }
    getData();
  }, [])
  if (!auth && !login) {
    return (
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Name">
            <Stack.Screen name="Name">
              {props => <Name {...props} setFirstName={setFirstName} setLastName={setLastName} />}
            </Stack.Screen>
            <Stack.Screen name="OnBoardingPage">
              {props => <OnBoardingPage {...props} setMobileNumber={setMobileNumber} />}
            </Stack.Screen>
            <Stack.Screen name="Pin">
              {props => <Pin {...props} auth={auth} setAuth={setAuth} setpasscode={setpasscode} firstName={firstName} lastName={lastName} mobileNumber={mobileNumber} passcode={passcode} />}
            </Stack.Screen>
            {/* <Stack.Screen name="OnBoardingStatus" component={()=><OnBoardingStatus setAuth={setAuth}/>} /> */}
            <Stack.Screen name="OnBoardingStatus">
              {props => <OnBoardingStatus {...props} setAuth={setAuth} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    )
  } else if (login && !auth) {
    return (
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Name">
            <Stack.Screen name="Pin">
              {props => <Pin {...props} auth={auth} login={login} setAuth={setAuth} setpasscode={setpasscode} passcode={passcode} />}
            </Stack.Screen>
            {/* <Stack.Screen name="OnBoardingStatus" component={()=><OnBoardingStatus setAuth={setAuth}/>} /> */}
            {/* <Stack.Screen name="OnBoardingStatus">
              {props => <OnBoardingStatus {...props} setAuth={setAuth} />}
            </Stack.Screen> */}
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    )
  } else {
    return (
      <NativeBaseProvider>
        <NavigationContainer>
          <Tab.Navigator screenOptions={{
            activeTintColor: '#e91e63',
            activeBackgroundColor: "#ffffff",
            inactiveBackgroundColor: "#ffffff"
          }}
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                if (route.name === 'Feed') {
                  return (
                    <MaterialIcons name="dynamic-feed" size={24} color="black" />
                  );
                } else if (route.name === 'Profile') {
                  return (
                    <MaterialIcons name="home" size={24} color="black" />
                  );
                } else if (route.name === "Marketplace") {
                  return (
                    <AntDesign name="shoppingcart" size={24} color="black" />
                  )
                }
              },
              tabBarInactiveTintColor: 'gray',
              tabBarActiveTintColor: 'tomato',
            })}
          >
            <Tab.Screen name="Feed">
            {props => <HomeScreen {...props} users={users} setUsers={setUsers}/>}
            </Tab.Screen>
            <Tab.Screen name="Marketplace">
              {props => <MarketPlaceCollection {...props} mobileNumber={mobileNumber} />}
            </Tab.Screen>
            <Tab.Screen name="Profile">
              {props => <SettingsScreen {...props} mobileNumber={mobileNumber} users={users} setUsers={setUsers}/>}
            </Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    )
  }
}