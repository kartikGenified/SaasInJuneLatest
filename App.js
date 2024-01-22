import React,{useEffect} from 'react';
import {View, StyleSheet, SafeAreaView,Alert} from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import { store } from './redux/store';
import { Provider } from 'react-redux'
import messaging from '@react-native-firebase/messaging';    
import PushNotification from 'react-native-push-notification';

const App = () => {
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
          Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        });
        
        return unsubscribe;
      }, []);

      
        useEffect(() => {
          // Check if the app has notification permission
          PushNotification.checkPermissions((permissions) => {
            if (permissions.alert) {
              console.log('Notification permission already granted.');
            }
            else {
              requestNotificationPermission()
            }
          });
        }, []);
      

        const requestNotificationPermission = () => {
          // Request notification permission
          try {
            PushNotification.requestPermissions();
            console.log('Notification permission granted.');
            // You can now handle notifications
          } catch (error) {
            console.log('Notification permission denied.');
            Alert.alert(
              'Notification Permission',
              'You need to enable notification permissions in order to receive notifications.'
            );
          }
        };
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
