// src/components/CreatePlaylistModal.tsx
import { useState, useRef } from 'react'
import { usePlaylists } from '../hooks/usePlaylists'
import type { Playlist } from '../types/api'
import { Camera, MoreHorizontal, Music } from 'lucide-react'

export default function CreatePlaylistModal({ onCreated }: {
    onCreated: (playlist: Playlist) => void
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isArtMenuOpen, setIsArtMenuOpen] = useState(false);
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [type, setType] = useState<'Album' | 'Mix' | 'Playlist' | 'Folder'>('Playlist')
    const { create, loading, error, fieldErrors } = usePlaylists()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const playlist = await create({ name, description, file: selectedFile, type })
        if (playlist) onCreated(playlist)
    }

    // Handler when user selects a file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Generate a temporary local URL to show the image in the UI
            const localUrl = URL.createObjectURL(file);
            setPreviewUrl(localUrl);
            setSelectedFile(file); // 
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
                
                {/* Image upload wrapper */}
                <div 
                    onClick={triggerFileSelect}
                    className="relative w-36 h-36 md:w-44 md:h-44 shrink-0 group cursor-pointer select-none"
                >
                    {/* 1. Hidden Native File Input */}
                    <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    
                    {/* 2. Artwork Frame */}
                    <div className="w-full h-full bg-slate-800 rounded-xl shadow-2xl flex items-center justify-center border border-slate-700 overflow-hidden transition-all group-hover:border-slate-500">
                        {previewUrl ? (
                            <img 
                                src={previewUrl} 
                                alt="Playlist Cover" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Music className="w-16 h-16 text-emerald-400 transition-all duration-300 group-hover:scale-90 group-hover:opacity-20" />
                        )}
                    </div>

                    {/* 3. Hover Overlay Mask */}
                    <div className="absolute inset-0 bg-slate-950/60 rounded-xl flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-emerald-500/20 backdrop-blur-[2px]">
                        <Camera className="w-7 h-7 text-emerald-400 animate-in fade-in zoom-in-75 duration-150" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                            Upload Cover
                        </span>
                    </div>

                    {/* 4. Dropdown Action Trigger */}
                    <div 
                        className="absolute top-2 right-2 z-10"
                        onClick={(e) => e.stopPropagation()} // 🛡️ Prevents triggerFileSelect from catching this click
                    >
                        <button
                            type="button"
                            onClick={() => setIsArtMenuOpen(!isArtMenuOpen)}
                            className={`p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all shadow-lg ${
                                isArtMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {isArtMenuOpen && (
                            <>
                                {/* Backdrop to close dropdown */}
                                <div 
                                    className="fixed inset-0 z-40 cursor-default" 
                                    onClick={() => setIsArtMenuOpen(false)} 
                                />

                                {/* Dropdown Card */}
                                <div className="absolute right-0 top-full mt-1 w-40 bg-slate-950 border border-slate-850 rounded-lg p-1 shadow-2xl z-50 text-left animate-in fade-in slide-in-from-top-1 duration-100">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsArtMenuOpen(false);
                                            triggerFileSelect();
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded transition-colors text-left"
                                    >
                                        Change Image
                                    </button>
                                    
                                    {previewUrl && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsArtMenuOpen(false);
                                                setPreviewUrl(null);
                                                setSelectedFile(null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors text-left"
                                        >
                                            Remove Image
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* 📝 FORM INPUTS WRAPPER */}
                <div className="flex-1 w-full space-y-4">
                    <div>
                        <label className="text-gray-400 text-sm block mb-1">
                            Name
                        </label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className={`w-full bg-navy-800 text-white rounded px-3 py-2 border 
                                ${fieldErrors.name 
                                    ? 'border-red-500' 
                                    : 'border-gray-700'}`}
                        />
                        {fieldErrors.name && (
                            <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm block mb-1">
                            Description
                        </label>
                        <input
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className={`w-full bg-navy-800 text-white rounded px-3 py-2 border 
                                ${fieldErrors.description 
                                    ? 'border-red-500' 
                                    : 'border-gray-700'}`}
                        />
                        {fieldErrors.description && (
                            <p className="text-red-400 text-xs mt-1">{fieldErrors.description}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm block mb-1">
                            Type
                        </label>
                        <select
                            value={type}
                            onChange={e => setType(e.target.value as any)}
                            className={`w-full bg-navy-800 text-white rounded px-3 py-2 border
                                ${fieldErrors.type 
                                    ? 'border-red-500' 
                                    : 'border-gray-700'}`}
                        >
                            <option value="Playlist">Playlist</option>
                            <option value="Album">Album</option>
                            <option value="Mix">Mix</option>
                            <option value="Folder">Folder</option>
                        </select>
                        {fieldErrors.type && (
                            <p className="text-red-400 text-xs mt-1">{fieldErrors.type}</p>
                        )}
                    </div>
                </div>
            </div>

            {error && !Object.keys(fieldErrors).length && (
                <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 text-white py-2 rounded disabled:opacity-50"
            >
                {loading ? 'Creating...' : 'Create playlist'}
            </button>
        </form>
    )
}