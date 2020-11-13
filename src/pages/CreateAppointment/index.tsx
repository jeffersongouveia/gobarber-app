import React, { useCallback } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'

import { useAuth } from '../../hooks/auth'

import {
  BackButton,
  Container,
  Header,
  HeaderTitle,
  UserAvatar,
} from './styles'

interface RouteParams {
  providerId: string
}

const index: React.FC = () => {
  const { user } = useAuth()

  const { goBack } = useNavigation()

  const route = useRoute()
  const routeParams = route.params as RouteParams

  return (
    <Container>
      <Header>
        <BackButton onPress={goBack}>
          <Icon name="chevron-left" size={24} color="999591" />
        </BackButton>

        <HeaderTitle>Hair Stylists</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>
    </Container>
  )
}

export default index
