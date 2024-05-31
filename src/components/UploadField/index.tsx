import {FC, useRef} from 'react';
import {
  Animated,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';

interface IPassedProps {
  source: ImageSourcePropType;
  label: string;
  translateX: Animated.Value;
  marginLeft?: number;
}

const UploadField: FC<IPassedProps> = ({
  source,
  label,
  translateX,
  marginLeft,
}) => {
  return (
    <View style={styles.containerView}>
      <Text style={styles.labelText}>{label}</Text>
      <TouchableOpacity onPress={() => console.log('pressed')}>
        <Animated.Image
          style={[
            styles.animatedStyle,
            {
              marginLeft: marginLeft,
              transform: [{translateX}],
            },
          ]}
          source={source}></Animated.Image>
      </TouchableOpacity>
    </View>
  );
};

export default UploadField;
