import {FC} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';

interface IPassedProps {
  onPress: () => void;
  isValid: boolean;
}

const SubmitUserInfoButton: FC<IPassedProps> = ({onPress, isValid}) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        style={
          isValid
            ? styles.submitTouchable
            : [styles.submitTouchable, {backgroundColor: '#e7b6cc50'}]
        }
        disabled={!isValid}>
        <Text
          style={
            isValid
              ? styles.submitText
              : [styles.submitText, {color: '#0c0b0950'}]
          }>
          {'Submit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubmitUserInfoButton;
