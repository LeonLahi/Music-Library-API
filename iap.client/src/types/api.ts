export interface Track {
    id: number
    title: string
    artist: string | null
    albumName: string | null
    durationSeconds: number
    coverArtUrl: string | null
    blobUrl: string
    uploadedAt: string
    updatedAt: string | null
    isDeleted: boolean
    deletedAt: string | null
    originalTitle: string | null
    originalArtist: string | null
    originalAlbumName: string | null
    originalCoverArtUrl: string | null
}

export interface PlaylistTrack {
    // trackId: number
    order: number
    addedAt: string
    track: Track
}

export interface Playlist {
    id: number
    name: string
    description: string | null
    coverArtUrl: string | null
    isDefault: boolean
    type: 'Album' | 'Mix' | 'Playlist' | 'Folder'
    createdAt: string
    updatedAt: string | null
    isDeleted: boolean
    deletedAt: string | null
    parentId: number | null
    tracks: PlaylistTrack[]
    user: User
}

export interface User {
    id: number
    username: string
    displayName: string | null
}

export interface AuthResponse {
    token: string
    username: string
    displayName: string | null
    email: string
}

export interface ApiError {
    message: string
    statusCode: number
    validationErrors?: Record<string, string[]>
}

export interface ApiResult<T> {
    data: T | null
    error: ApiError | null
}