import React from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import RootNavigator from './navigation';
import MessagesListener from './components/MessagesListener';
import {Provider} from 'react-redux';
import store from './store';
import CalenderListener from './components/CalenderListener';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <Provider store={store}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <RootNavigator />
        <MessagesListener />
        <CalenderListener />
      </SafeAreaView>
    </Provider>
  );
}

export default App;
