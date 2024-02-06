import React,{useEffect} from 'react';
import {View, StyleSheet, SafeAreaView,Alert,Linking, Platform} from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import { store } from './redux/store';
import { Provider } from 'react-redux'
import messaging from '@react-native-firebase/messaging';    
import VersionCheck from 'react-native-version-check';

const App = () => {
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
          Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        });
        
        return unsubscribe;
      }, []);

      useEffect(() => {
        const checkAppVersion = async () => {
          try {
    const latestVersion = Platform.OS === 'ios'? await fetch(`https://itunes.apple.com/in/lookup?bundleId=com.ozoneoverseas`)
                    .then(r => r.json())
                    .then((res) => { return res?.results[0]?.version })
                    : await VersionCheck.getLatestVersion({
                        provider: 'playStore',
                        packageName: 'com.ozoneoverseas',
                        ignoreErrors: true,
                    });
    
            const currentVersion = VersionCheck.getCurrentVersion();
    
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
                          ? VersionCheck.getAppStoreUrl({ appID: 'com.ozoneoverseas' })
                          : VersionCheck.getPlayStoreUrl({ packageName: 'com.ozoneoverseas' })
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
