import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { TextInputProps } from 'react-native'
import { useField } from '@unform/core'

import { Container, TextIcon, TextInput } from './styles'

interface InputProps extends TextInputProps {
  name: string
  icon: string
}

interface InputValueReference {
  value: string
}

interface InputRef {
  focus(): void
}

const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = (
  { name, icon, ...props },
  ref,
) => {
  const field = useField(name)

  const inputElementRef = useRef<any>(null)
  const inputValueRef = useRef<InputValueReference>({
    value: field.defaultValue || '',
  })

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus()
    },
  }))

  useEffect(() => {
    field.registerField({
      name: field.fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(_: any, value: string) {
        inputValueRef.current.value = value
        inputElementRef.current.setNativeProps({ text: value })
      },
      clearValue() {
        inputValueRef.current.value = ''
        inputElementRef.current.clear()
      },
    })
  }, [field])

  return (
    <Container>
      <TextIcon name={icon} size={20} color="#666360" />

      <TextInput
        ref={inputElementRef}
        defaultValue={field.defaultValue}
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        onChangeText={(value) => (inputValueRef.current.value = value)}
        {...props}
      />
    </Container>
  )
}

export default forwardRef(Input)
