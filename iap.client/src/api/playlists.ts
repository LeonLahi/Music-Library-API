import { api } from './client';
import { type Playlist } from '../types/api'
import { type ApiResult } from '../types/api';

export interface CreatePlaylistRequest {
    name: string
    description?: string
    type: 'Album' | 'Mix' | 'Playlist' | 'Folder'
    file?: File | null
    parentId?: number
}

export const getPlaylists = async (): Promise<Playlist[]> => {
    const response = await api.get<Playlist[]>('/playlists')
    return response.data
}

export const getPlaylistById = async (id: string): Promise<Playlist> => {
    const response = await api.get<Playlist>(`/playlists/${id}`)
    return response.data
}

export const createPlaylist = async (
    data: CreatePlaylistRequest
): Promise<ApiResult<Playlist>> => {
    try {
        const response = await api.post<Playlist>('/playlists', data)
        return { data: response.data, error: null }
    } catch (err: any) {
        const status = err.response?.status ?? 500
        const responseData = err.response?.data

        // FluentValidation returns errors object
        if (status === 400 && responseData?.errors) {
            return {
                data: null,
                error: {
                    message: 'Please fix the errors below.',
                    statusCode: 400,
                    validationErrors: responseData.errors
                }
            }
        }

        return {
            data: null,
            error: {
                message: responseData?.message ?? 'Something went wrong.',
                statusCode: status
            }
        }
    }
}
