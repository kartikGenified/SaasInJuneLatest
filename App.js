import React,{useEffect} from 'react';
import {View, StyleSheet, SafeAreaView,Alert,Linking, Platform} from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import { store } from './redux/store';
import { Provider } from 'react-redux'
import messaging from '@react-native-firebase/messaging';    
import VersionCheck from 'react-native-version-check';

const App = () => {
  console.log("Version check",JSON.stringify(VersionCheck.getPlayStoreUrl({ packageName: 'com.netcarrots.ozone' })))
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
          Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        });
        
        return unsubscribe;
      }, []);

      useEffect(() => {
        const checkAppVersion = async () => {
          try {
    const latestVersion = Platform.OS === 'ios'? await fetch(`https://itunes.apple.com/in/lookup?bundleId=com.netcarrots.ozone`)
                    .then(r => r.json())
                    .then((res) => { return res?.results[0]?.version })
                    : await VersionCheck.getLatestVersion({
                        provider: 'playStore',
                        forceUpdate: true,
                       
                    });
    
            const currentVersion = VersionCheck.getCurrentVersion();
    
            console.log("current verison and new version,",currentVersion, latestVersion)
            if (latestVersion > currentVersion) {
              Alert.alert(
                'Update Required',
    'A new version of the app is available. Please update to continue using the app.',
                [
                  {
                    text: 'Update Now',
                    onPress: () => {
                      Linking.openURL(
                        Platform.OS === 'ios'
                          ? 'https://apps.apple.com/in/app/ozostars-%E0%A4%8F%E0%A4%95-%E0%A4%AA%E0%A4%B9%E0%A4%B2-%E0%A4%85%E0%A4%AA%E0%A4%A8-%E0%A4%95-%E0%A4%B8-%E0%A4%A5/id1554075490'
                          : "https://play.google.com/store/apps/details?id=com.netcarrots.ozone"
                      );
                    },
                  },
                ],
                { cancelable: false }
              );
            } else {
              // App is up-to-date; proceed with the app
            }
          } catch (error) {
            // Handle error while checking app version
            console.error('Error checking app version:', error);
          }
        };
    
        checkAppVersion();
      }, []);
        

        
    return (
        <Provider store={store}>
        <SafeAreaView style={{flex:1}}>
            <StackNavigator></StackNavigator>
        </SafeAreaView>
        </Provider>
    );
}

const styles = StyleSheet.create({})

export default App;
