import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Alert, Platform } from 'react-native'
import { format } from 'date-fns'

import Icon from 'react-native-vector-icons/Feather'
import DateTimePicker from '@react-native-community/datetimepicker'

import { useAuth } from '../../hooks/auth'

import api from '../../services/api'

import {
  BackButton,
  Calendar,
  Container,
  Content,
  Header,
  HeaderTitle,
  Hour,
  HourText,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  ProviderAvatar,
  ProviderContainer,
  ProviderName,
  ProvidersList,
  ProvidersListContainer,
  Schedule,
  Section,
  SectionContent,
  SectionTitle,
  Title,
  UserAvatar,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles'

import { Provider } from '../Dashboard'

interface RouteParams {
  providerId: string
}

interface DayAvailabilityProps {
  hour: number
  available: boolean
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth()

  const { goBack, navigate } = useNavigation()
  const route = useRoute()
  const routerParams = route.params as RouteParams

  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState(routerParams.providerId)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedHour, setSelectedHour] = useState(0)
  const [dayAvailability, setDayAvailability] = useState<DayAvailabilityProps[]>([])

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId)
  }, [])

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((state) => !state)
  }, [])

  const handleDateChanged = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }

    if (date) {
      setSelectedDate(date)
    }
  }, [])

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour)
  }, [])

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate)
      date.setHours(selectedHour)
      date.setMinutes(0)

      const params = {
        provider_id: selectedProvider,
        date,
      }

      await api.post('/appointments', params)
      navigate('AppointmentCreated', { date: date.getTime() })
    } catch (e) {
      Alert.alert('Failed', 'Something goes wrong, try again')
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider])

  useEffect(() => {
    api
      .get<Provider[]>('/providers')
      .then(({ data }) => {
        setProviders(data)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    api
      .get<DayAvailabilityProps[]>(`/providers/availability-day/${selectedProvider}`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(({ data }) => {
        setDayAvailability(data)
      })
  }, [selectedDate, selectedProvider])

  const morningAvailability = useMemo(() => {
    return dayAvailability
      .filter(({ hour }) => hour < 12)
      .map((availability) => ({
        ...availability,
        hourFormatted: format(new Date().setHours(availability.hour), 'h bbbb'),
      }))
  }, [dayAvailability])

  const afternoonAvailability = useMemo(() => {
    return dayAvailability
      .filter(({ hour }) => hour >= 12)
      .map((availability) => ({
        ...availability,
        hourFormatted: format(new Date().setHours(availability.hour), 'h bbbb'),
      }))
  }, [dayAvailability])

  return (
    <Container>
      <Header>
        <BackButton onPress={goBack}>
          <Icon name="chevron-left" size={24} color="#f5ede8" />
        </BackButton>

        <HeaderTitle>Hair Stylists</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <Content>
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
                <ProviderName selected={provider.id === selectedProvider}>{provider.name}</ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>Choose Date</Title>

          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>{showDatePicker ? 'Hide' : 'Show'} Calendar</OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="spinner"
              textColor="#f4ede8"
              value={selectedDate}
              onChange={handleDateChanged}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Choose Time</Title>

          <Section>
            <SectionTitle>Morning</SectionTitle>

            <SectionContent>
              {morningAvailability.map((availability) => (
                <Hour
                  key={availability.hour}
                  enabled={availability.available}
                  available={availability.available}
                  selected={availability.hour === selectedHour}
                  onPress={() => handleSelectHour(availability.hour)}
                >
                  <HourText selected={availability.hour === selectedHour}>{availability.hourFormatted}</HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Afternoon</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map((availability) => (
                <Hour
                  key={availability.hour}
                  enabled={availability.available}
                  available={availability.available}
                  selected={availability.hour === selectedHour}
                  onPress={() => handleSelectHour(availability.hour)}
                >
                  <HourText selected={availability.hour === selectedHour}>{availability.hourFormatted}</HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Make Appointment</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  )
}

export default CreateAppointment
