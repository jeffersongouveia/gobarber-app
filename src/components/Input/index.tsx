import React from 'react'
import { TextInputProps } from 'react-native'

import { Container, TextIcon, TextInput } from './styles'

interface InputProps extends TextInputProps {
  name: string
  icon: string
}

const Input: React.FC<InputProps> = ({ name, icon, ...props }) => {
  return (
    <Container>
      <TextIcon name={icon} size={20} color="#666360" />

      <TextInput
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        {...props}
      />
    </Container>
  )
}

export default Input
