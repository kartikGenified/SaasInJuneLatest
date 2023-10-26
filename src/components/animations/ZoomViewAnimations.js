import React,{useRef,useEffect} from 'react';
import {View, StyleSheet,Animated} from 'react-native';
const ZoomViewAnimations = (props) => {
    
    const zoomAnimations = useRef(new Animated.Value(0)).current;
    const duration = props.duration
    const zoom = props.zoom
    useEffect(() => {
       
            Animated.timing(zoomAnimations, { toValue: zoom, duration: duration, useNativeDriver: true }).start();
          
      }, [zoomAnimations]);

    return (
        <Animated.View style={{height:zoomAnimations,width:zoomAnimations, ...props.style}}>
            {<props.comp></props.comp>}
        </Animated.View>
    );
}

const styles = StyleSheet.create({})

export default ZoomViewAnimations;
