import { api } from './client';
import { type Track } from '../types/api'

export const getTracks = async (): Promise<Track[]> => {
    const response = await api.get<Track[]>('/tracks')
    return response.data
}