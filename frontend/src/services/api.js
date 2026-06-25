import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  headers: { 'Content-Type': 'application/json' },
})

export async function analyzeWeather(location, activity, date) {
  const { data } = await api.post('/api/analyze', { location, activity, date })
  return data
}

export async function compareLocations(locations, activity, date) {
  const { data } = await api.post('/api/compare', { locations, activity, date })
  return data
}

export async function followUp(question, context) {
  const { data } = await api.post('/api/follow-up', {
    question,
    location: context.location,
    activity: context.activity,
    date: context.date,
  })
  return data
}
