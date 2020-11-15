import React, { useRef, useCallback } from 'react'
import { Platform, KeyboardAvoidingView, ScrollView, View, Image, TextInput, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import Icon from 'react-native-vector-icons/Feather'
import * as Yup from 'yup'

import api from '../../services/api'
import getValidationsErrors from '../../utils/getValidationsErrors'

import Input from '../../components/Input'
import Button from '../../components/Button'

import logo from '../../assets/images/logo.png'
import { Container, Title, BackToSignIn, BackToSignInText } from './styles'

interface SignUpFormData {
  name: string
  email: string
  password: string
}

const SignUp: React.FC = () => {
  const navigation = useNavigation()

  const formRef = useRef<FormHandles>(null)
  const emailRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string().required('Email required').email('Use an valid email'),
          password: Yup.string().min(6, 'At minimum of 6 characters'),
        })

        await schema.validate(data, { abortEarly: false })
        await api.post('/users', data)

        Alert.alert('Done', 'You can now login')
        navigation.goBack()
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationsErrors(error)
          formRef.current?.setErrors(errors)
          return
        }

        Alert.alert('Failed', 'Something went wrong while trying to sign up.')
      }
    },
    [navigation],
  )

  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flex: 1 }}>
          <Container>
            <Image source={logo} />

            <View>
              <Title>Sign Up</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Input
                name="name"
                icon="user"
                placeholder="Name"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />

              <Input
                ref={emailRef}
                name="email"
                icon="mail"
                placeholder="Email"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />

              <Input
                ref={passwordRef}
                name="password"
                icon="lock"
                placeholder="Password"
                textContentType="newPassword"
                returnKeyType="send"
                secureTextEntry
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>Sign Up</Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInText>Back to Sign In</BackToSignInText>
      </BackToSignIn>
    </>
  )
}

export default SignUp
