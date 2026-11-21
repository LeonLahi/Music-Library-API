import { api } from './client';
import { type Playlist } from '../types/api'

export const getPlaylists = async (): Promise<Playlist[]> => {
    const response = await api.get<Playlist[]>('/playlists')
    return response.data
}

export const getPlaylistById = async (id: string): Promise<Playlist> => {
    const response = await api.get<Playlist>(`/playlists/${id}`)
    return response.data
}
