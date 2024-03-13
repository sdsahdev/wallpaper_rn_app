import React from "react";
import LottieView from "lottie-react-native";
import Nowwww from './assets/downloadAni.json'
export default function Animation() {
  return (
    <LottieView
      source={require('./assets/downloadAni.json')}
      style={{width: "100%", height: "100%", backgroundColor:'red'}}
      onAnimationFailure={(ee) => console.log(ee, "===ee")}
      autoPlay
      loop
    />
  );
}