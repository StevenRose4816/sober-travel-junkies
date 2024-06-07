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
        <Text
          style={{
            color: '#0c0b09',
            fontSize: 12,
            fontWeight: '600',
            margin: 10,
            textAlign: 'center',
            fontFamily: 'HighTide-Sans',
          }}>
          {'Edit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreenEditButton;
