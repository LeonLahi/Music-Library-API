// src/pages/LibraryPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // 🎯 1. Import Link from react-router-dom
import { getPlaylists } from '../api/playlists';
import { Music } from 'lucide-react';
import type { Playlist } from '../types/api';

export default function LibraryPage() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loadingPlaylists, setLoadingPlaylists] = useState(true);

    useEffect(() => {
        getPlaylists()
            .then(setPlaylists)
            .finally(() => setLoadingPlaylists(false))
    }, [])

    if (loadingPlaylists) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-slate-400 animate-pulse text-lg">Loading Collections...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6" >
            
            {/* Playlist header */}
            <div className="relative flex flex-col sm:flex-row items-end gap-6 pb-6 border-b border-slate-800 bg-gradient-to-b from-emerald-500/10 to-transparent -mx-6 md:-mx-8 p-6 md:p-8 -mt-6 md:-mt-8">
                <div className="flex-1 space-y-2">
                    <h1 className="text-1xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                        Library
                    </h1>
                </div>
            </div>

            {/* Tracks list */}
            <div className="w-full"> 
                {/* Grid wrapper */}
                <div className="grid grid-cols sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {playlists.map((playlist) => (
                        
                        
                        <Link className = "hover:underline"
                            key={playlist.id} 
                            to={`/playlist/${playlist.id}`} // Constructs the path pointing to App.tsx parameter layout
                            
                        >
                            <div                      
                            className="w-full aspect-square bg-slate-800 shadow-2xl flex items-center justify-center border border-slate-700 hover:border-emerald-500/50 transition-all group cursor-pointer overflow-hidden relative">

                                {playlist.coverArtUrl ? (
                                    <img 
                                        src={playlist.coverArtUrl} 
                                        alt={`${playlist.name} cover art`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    /* Icon if no cover art url provided */
                                    <Music className="w-12 h-12 md:w-16 md:h-16 text-emerald-400 group-hover:scale-110 transition-transform" />
                                )}
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                                    {playlist.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}