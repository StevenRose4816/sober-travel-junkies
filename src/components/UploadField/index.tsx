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
  onPress?: () => void;
}

const UploadField: FC<IPassedProps> = ({
  source,
  label,
  translateX,
  marginLeft,
  onPress,
}) => {
  return (
    <View style={styles.containerView}>
      <Text style={styles.labelText}>{label}</Text>
      <TouchableOpacity onPress={onPress}>
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
