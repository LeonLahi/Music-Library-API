// src/pages/PlaylistTracksPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlaylistById } from '../api/playlists';
import { Music, Clock, Ellipsis, Play } from 'lucide-react';
import type { Playlist } from '../types/api';

export default function PlaylistTracksPage() {
    // Extract ":playlistId" parameter defined in App.tsx route
    const { playlistId } = useParams<{ playlistId: string }>();
    
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch new data every time the playlistId changes
    useEffect(() => {
        if (!playlistId) return;
        
        setLoading(true);
        setError(null);

        getPlaylistById(playlistId)
            .then(setPlaylist)
            .catch((err) => {
                console.error(err);
                setError("Could not find this playlist.");
            })
            .finally(() => setLoading(false));
            
    }, [playlistId]); // id refreshes when new playlist is clicked

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-slate-400 animate-pulse text-lg">Loading playlist...</p>
            </div>
        );
    }

    if (error || !playlist) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-rose-400 text-lg">{error || "Playlist not found."}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            
            {/* Playlist header */}
            <div className="relative flex flex-col sm:flex-row items-end gap-6 pb-6 border-b border-slate-800 bg-gradient-to-b from-emerald-500/10 to-transparent -mx-6 md:-mx-8 p-6 md:p-8 -mt-6 md:-mt-8">
                
                <div className="w-36 h-36 md:w-44 md:h-44 bg-slate-800 rounded-xl shadow-2xl flex items-center justify-center shrink-0 border border-slate-700">
                <Music className="w-16 h-16 text-emerald-400" />
                </div>

                <div className="flex-1 space-y-2 flex flex-col justify-end">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                    Playlist
                </span>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none pb-1">
                    {playlist.name}
                </h1>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-slate-400 font-medium w-full pt-1">
                    
                    <div className="flex items-center gap-2 h-6 my-auto">
                        <span className="leading-none">Your Library</span>
                        <span className="text-slate-600 flex items-center justify-center leading-none">•</span>
                        <span className="text-slate-200 leading-none">{playlist.tracks.length} songs</span>
                        </div>

                        <button className="flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer h-6 w-6 sm:-mr-1">
                        <Ellipsis className="w-6 h-6 block" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Track list columns header */}
            <div className="flex items-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-800/60">
                <span className="w-8 text-center">#</span>
                <span className="flex-1 pl-4">Title</span>
                <span className="hidden sm:block w-48 pl-2">Artist</span>
                <span className="w-12 text-right"><Clock className="w-4 h-4 ml-auto" /></span>
            </div>

            {/* Track list */}
            <div className="space-y-1">
                {playlist.tracks.map((track, index) => (
                    <div 
                        key={track.id} 
                        className="flex items-center px-4 py-3 hover:bg-slate-900/60 border border-transparent hover:border-slate-800/40 transition-all group cursor-pointer"
                    >
                        <div className="w-8 flex items-center justify-center shrink-0 font-mono text-slate-500 text-s h-6">
                                
                            {/* Show by default */}
                            <span className="block group-hover:hidden">
                            {index + 1}
                            </span>

                            {/* 2. Hide by default, show on group-hover */}
                            <button 
                            onClick={(e) => {
                                e.stopPropagation(); // Prevents the row click event from firing twice
                                console.log("Play track:", track.id);
                            }}
                            className="hidden group-hover:flex items-center justify-center text-emerald-400 hover:text-emerald-300 hover:scale-110 transition-transform"
                            >

                            <Play className="w-4 h-4 hover:fill-emerald-300" />
                            </button>

                        </div>

                        <div className="flex-1 pl-4 min-w-0">
                            <p className="font-semibold text-slate-200 group-hover:text-white truncate">
                                {track.title}
                            </p>
                            <p className="text-sm text-slate-400 truncate sm:hidden">
                                {track.artist}
                            </p>
                        </div>

                        <div className="hidden sm:block w-48 pl-2 text-sm text-slate-400 group-hover:text-slate-300 truncate">
                            {track.artist}
                        </div>

                        <div className="w-12 text-right text-sm font-medium text-slate-500 group-hover:text-slate-400">
                            3:45
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}