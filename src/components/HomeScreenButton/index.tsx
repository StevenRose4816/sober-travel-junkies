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
}

const HomeScreenButton: React.FC<IPassedProps> = ({title, onPress}) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress} style={styles.touchable}>
        <Text style={styles.touchableText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreenButton;
