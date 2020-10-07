import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/Feather'

export const Container = styled.View`
  width: 100%;
  height: 60px;
  padding: 0 16px;
  background: #232129;
  border-radius: 10px;
  margin-bottom: 8px;

  flex-direction: row;
  align-items: center;
`

export const TextIcon = styled(Icon)`
  margin-right: 18px;
`

export const TextInput = styled.TextInput`
  flex: 1;
  color: #fff;
  font-size: 16px;
  font-family: 'RobotoSlab-Regular';
`
