import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';

interface IPassedProps {
  title: string;
  onPress: () => void;
  overRiddenWidth?: number;
}

const HomeScreenButton: React.FC<IPassedProps> = ({
  title,
  onPress,
  overRiddenWidth,
}) => {
  const screenWidth = Dimensions.get('window').width;
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        style={
          !overRiddenWidth
            ? styles.touchable
            : [styles.touchable, {width: screenWidth * overRiddenWidth}]
        }>
        <Text style={styles.touchableText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreenButton;
