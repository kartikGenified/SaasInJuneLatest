import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import { store } from './redux/store';
import { Provider } from 'react-redux'

    

const App = () => {
    
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
