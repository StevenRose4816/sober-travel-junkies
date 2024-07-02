import {FC} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';

interface IPassedProps {
  onPress: () => void;
}

const HomeScreenEditButton: FC<IPassedProps> = ({onPress}) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress} style={styles.touchable}>
        <Text style={styles.editText}>{'Edit'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreenEditButton;
