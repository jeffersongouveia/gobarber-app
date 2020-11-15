import React, { useCallback, useRef } from 'react'
import { Platform, KeyboardAvoidingView, ScrollView, View, Image, TextInput, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import Icon from 'react-native-vector-icons/Feather'
import * as Yup from 'yup'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { useAuth } from '../../hooks/auth'

import getValidationsErrors from '../../utils/getValidationsErrors'

import logo from '../../assets/images/logo.png'
import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAccount, CreateAccountText } from './styles'

interface FormProps {
  email: string
  password: string
}

const SignIn: React.FC = () => {
  const navigation = useNavigation()
  const { signIn } = useAuth()

  const formRef = useRef<FormHandles>(null)
  const passwordRef = useRef<TextInput>(null)

  const handleSignIn = useCallback(
    async (data: FormProps) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          email: Yup.string().required('Email required').email('Use an valid email'),
          password: Yup.string().required('Password required'),
        })

        await schema.validate(data, { abortEarly: false })
        await signIn({
          email: data.email,
          password: data.password,
        })
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationsErrors(error)
          formRef.current?.setErrors(errors)
          return
        }

        Alert.alert('Failed', 'Something went wrong while trying to sign in.')
      }
    },
    [signIn],
  )

  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flex: 1 }}>
          <Container>
            <Image source={logo} />

            <View>
              <Title>Sign In</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignIn} style={{ width: '100%' }}>
              <Input
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
                returnKeyType="send"
                secureTextEntry
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>Sign In</Button>
            </Form>

            <ForgotPassword onPress={() => console.log('pressed')}>
              <ForgotPasswordText>Forgot My Password</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccount onPress={() => navigation.navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountText>Sign Up</CreateAccountText>
      </CreateAccount>
    </>
  )
}

export default SignIn
