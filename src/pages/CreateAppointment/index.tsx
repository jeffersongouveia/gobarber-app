import React, { useCallback, useEffect, useState } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'

import { useAuth } from '../../hooks/auth'

import api from '../../services/api'

import {
  BackButton,
  Container,
  Header,
  HeaderTitle,
  ProviderAvatar,
  ProviderContainer,
  ProviderName,
  ProvidersList,
  ProvidersListContainer,
  UserAvatar,
} from './styles'

import { Provider } from '../Dashboard'

interface RouteParams {
  providerId: string
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth()

  const { goBack } = useNavigation()
  const route = useRoute()
  const routerParams = route.params as RouteParams

  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState(
    routerParams.providerId,
  )

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId)
  }, [])

  useEffect(() => {
    api
      .get<Provider[]>('/providers')
      .then(({ data }) => {
        setProviders(data)
      })
      .catch(console.error)
  }, [])

  return (
    <Container>
      <Header>
        <BackButton onPress={goBack}>
          <Icon name="chevron-left" size={24} color="#f5ede8" />
        </BackButton>

        <HeaderTitle>Hair Stylists</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <ProvidersListContainer>
        <ProvidersList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={providers}
          keyExtractor={(provider) => provider.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer
              selected={provider.id === selectedProvider}
              onPress={() => handleSelectProvider(provider.id)}
            >
              <ProviderAvatar source={{ uri: provider.avatar_url }} />
              <ProviderName selected={provider.id === selectedProvider}>
                {provider.name}
              </ProviderName>
            </ProviderContainer>
          )}
        />
      </ProvidersListContainer>
    </Container>
  )
}

export default CreateAppointment
