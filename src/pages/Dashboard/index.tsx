import React, { useCallback, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'

import { useAuth } from '../../hooks/auth'
import api from '../../services/api'

import {
  Container,
  HeaderTitle,
  UserName,
  Header,
  ProfileButton,
  UserAvatar,
  ProvidersList,
  ProviderName,
  ProviderAvatar,
  ProviderMetaText,
  ProviderInfo,
  ProviderMeta,
  ProviderContainer,
  ProvidersListTitle,
} from './styles'

export interface Provider {
  id: string
  name: string
  email: string
  avatar_url: string
}

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const { navigate } = useNavigation()

  const [providers, setProviders] = useState<Provider[]>([])

  const navigateToProfile = useCallback(() => {
    signOut()
  }, [signOut])

  const navigateToCreateAppointment = useCallback(
    (providerId: string) => {
      navigate('CreateAppointment', { providerId })
    },
    [navigate],
  )

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
        <HeaderTitle>
          Welcome {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{ uri: user.avatar_url }} />
        </ProfileButton>
      </Header>

      <ProvidersList
        ListHeaderComponent={
          <ProvidersListTitle>Hairstyles</ProvidersListTitle>
        }
        data={providers}
        keyExtractor={(provider) => provider.id}
        renderItem={({ item: provider }) => (
          <ProviderContainer
            onPress={() => navigateToCreateAppointment(provider.id)}
          >
            <ProviderAvatar source={{ uri: provider.avatar_url }} />

            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>

              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText>Monday through Friday</ProviderMetaText>
              </ProviderMeta>

              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText>From 8 a.m. to 6 p.m.</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  )
}

export default Dashboard
