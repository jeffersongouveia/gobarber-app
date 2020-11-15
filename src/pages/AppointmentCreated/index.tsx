import React, { useCallback, useMemo } from 'react'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation, useRoute } from '@react-navigation/native'
import { format } from 'date-fns'

import { Container, Description, OkButton, OkButtonText, Title } from './styles'

interface RouteParams {
  date: number
}

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation()
  const route = useRoute()
  const params = route.params as RouteParams

  const handleOkButtonPressed = useCallback(() => {
    reset({
      routes: [{ name: 'Dashboard' }],
      index: 0,
    })
  }, [reset])

  const selectedDateFormatted = useMemo(() => {
    const selectedDate = new Date(params.date)
    return format(selectedDate, "EEEE',' LLLL dd',' uu 'at' h aaaa")
  }, [params.date])

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Appointment done</Title>
      <Description>{selectedDateFormatted}</Description>

      <OkButton onPress={handleOkButtonPressed}>
        <OkButtonText>OK</OkButtonText>
      </OkButton>
    </Container>
  )
}

export default AppointmentCreated
