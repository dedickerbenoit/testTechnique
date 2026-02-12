import api from './api'

export const registerUser = async (data) => {
  const response = await api.post('/users', data)
  return response.data
}

export const checkPseudoAvailability = async (pseudo) => {
  const response = await api.get(`/users/check-pseudo/${pseudo}`)
  return response.data
}
