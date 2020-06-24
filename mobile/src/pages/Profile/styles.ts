import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  /* justify-content: center; */
  padding: 0 30px ${Platform.OS === 'android' ? 160 : 40}px;
  position: relative;
`;

export const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 32px;
  left: 24px;
`;

export const LogoutButton = styled.TouchableOpacity`
  position: absolute;
  top: 32px;
  right: 24px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: 32px;
  align-self: center;
  width: 186px;
`;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
`;
