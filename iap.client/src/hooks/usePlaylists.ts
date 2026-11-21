import { useState } from 'react'
import { type Playlist } from '../types/api'
import { createPlaylist, type CreatePlaylistRequest } from '../api/playlists'

export function usePlaylists() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const create = async (data: CreatePlaylistRequest): Promise<Playlist | null> => {
        setLoading(true)
        setError(null)
        setFieldErrors({})

        const result = await createPlaylist(data)
        setLoading(false)

        if (result.error) {
            setError(result.error.message)

            // Flatten validation errors to first message per field
            if (result.error.validationErrors) {
                const flattened: Record<string, string> = {}
                Object.entries(result.error.validationErrors).forEach(([field, messages]) => {
                    // Field names come back as PascalCase from C# — convert to camelCase
                    const key = field.charAt(0).toLowerCase() + field.slice(1)
                    flattened[key] = messages[0]
                })
                setFieldErrors(flattened)
            }

            return null
        }

        return result.data
    }

    return { create, loading, error, fieldErrors }
}