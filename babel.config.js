module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    ['module:react-native-dotenv'],
    ["react-native-worklets-core/plugin"]
  ],
  env: {
    production: {
      plugins:[
        ['react-native-paper/babel'],
     
    ],
    },
  },
};
