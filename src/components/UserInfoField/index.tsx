import {FC} from 'react';
import {Image, ImageSourcePropType, Text, View} from 'react-native';
import styles from './styles';

interface IPassedProps {
  label: string;
  value: string;
  uri: ImageSourcePropType;
}

const UserInfoField: FC<IPassedProps> = ({label, value, uri}) => {
  return (
    <View style={styles.containerView}>
      <Image style={styles.homeIcon} source={uri} />
      <Text style={styles.labelText}>
        {label + ': '}
        <Text style={styles.valueText}>{value}</Text>
      </Text>
    </View>
  );
};

export default UserInfoField;
