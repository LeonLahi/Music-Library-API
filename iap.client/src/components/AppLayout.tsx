// src/layouts/AppLayout.tsx
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Home, 
  Library, 
  Music, 
  LogOut, 
  User, 
  Settings, 
  ChevronUp, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  ListMusic, 
  Folder 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPlaylists } from '../api/playlists'; 
import { type Playlist } from '../types/api';
import CreatePlaylistModal from './CreatePlaylistModal';

export const AppLayout: React.FC = () => {
  const { logoutUser, user } = useAuth();
  const location = useLocation();
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [openFolders, setOpenFolders] = useState<Record<number, boolean>>({});

  const toggleFolder = (folderId: number) => {
    setOpenFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  useEffect(() => {
    getPlaylists()
      .then(setPlaylists)
      .catch((err) => console.error("Failed to load playlists", err))
      .finally(() => setLoadingPlaylists(false));
  }, []);

  const rootPlaylists = playlists.filter(p => p.parentId === null || p.parentId === undefined);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      
      {/* Side nav bar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0">
        
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
          <span className="text-lg font-bold tracking-wider text-emerald-400">STREAM_APP</span>
        </div>
        
        {/* Static links */}
        <div className="p-4 space-y-1 shrink-0">
          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '#' 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
            }`}
          >
            <Home className="w-4 h-4 text-emerald-400" />
            <span>Home</span>
          </Link>

          <Link
            to="/library"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/library'
                ? 'bg-slate-800 text-white' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
            }`}
          >
            <Library className="w-4 h-4 text-emerald-400" />
            <span>Your Library</span>
          </Link>
        </div>

        {/*  Divider line */}
        <div className="h-px bg-slate-800 mx-4 shrink-0" />

        {/* Dynamic collections list */}
        <div className="flex-1 flex flex-col min-h-0">
          
          {/* Section heading label */}
          <div className="flex items-center justify-between px-6 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Collections</span>

            {/* Add collection button */}
            <button 
              onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
              className={`text-slate-500 hover:text-emerald-400 transition-colors p-1 rounded hover:bg-slate-800 cursor-pointer ${
              isAddMenuOpen ? 'text-emerald-400 bg-slate-800' : ''
              }`}
            >

              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add collection dropdown */}
          {isAddMenuOpen && (
            <>
              {/* Closes when click outside menu */}
              <div
                className="fixed inset-0 z-40 cursor-defaukt"
                onClick={() => setIsAddMenuOpen(false)}
              />

              {/* Dropdown menu */}
              <div className="absolute right-0 mt-1 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                <button 
                  onClick={() => {
                    setIsAddMenuOpen(false);
                    console.log("Uploads tracks action");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-left font-medium"    
                >
                <ListMusic className="w-4 h-4 text-slate-500" />
                Upload Tracks
                </button>
                <button 
                  onClick={() => {
                    setIsAddMenuOpen(false)
                    setIsCreateModalOpen(true);
                    console.log("Create new playlist action");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-left font-medium"    
                >
                <ListMusic className="w-4 h-4 text-slate-500" />
                Create New Playlist
                </button>
                <button 
                  onClick={() => {
                    setIsAddMenuOpen(false);
                    console.log("Create new folder action");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-left font-medium"    
                >
                <ListMusic className="w-4 h-4 text-slate-500" />
                Create New Folder
                </button>

              </div>
            </>
          )}

          {/* Scroll navigation body */}
          <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-0.5 scrollbar-thin">
            {loadingPlaylists ? (
              <p className="text-xs text-slate-500 px-4 py-2 animate-pulse">Loading items...</p>
            ) : playlists.length === 0 ? (
              <p className="text-xs text-slate-600 px-4 py-2 italic">No playlists found</p>
            ) : (
              rootPlaylists.map((item) => {
                
                // Regular playlists 
                if (item.type !== 'Folder') {
                  const playlistPath = `/playlist/${item.id}`;
                  const isActive = location.pathname === playlistPath;

                  return (
                    <Link
                      key={item.id}
                      to={playlistPath}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors group ${
                        isActive
                          ? 'text-emerald-400 font-semibold bg-emerald-500/5'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <ListMusic className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                }

                // Playlists that are folders
                const isFolderOpen = !!openFolders[item.id];
                const childPlaylists = playlists.filter(p => p.parentId === item.id);

                return (
                  <div key={item.id} className="space-y-0.5">
                    <button
                      onClick={() => toggleFolder(item.id)}
                      className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-colors text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 text-left group"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Folder className={`w-4 h-4 shrink-0 transition-colors ${isFolderOpen ? 'text-amber-500' : 'text-slate-500 group-hover:text-slate-400'}`} />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {isFolderOpen ? (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      )}
                    </button>

                    {isFolderOpen && (
                      <div className="pl-4 border-l border-slate-800 ml-6 my-0.5 space-y-0.5">
                        {childPlaylists.length === 0 ? (
                          <p className="text-xs text-slate-600 italic py-1 pl-3">Empty folder</p>
                        ) : (
                          childPlaylists.map((child) => {
                            const childPath = `/playlist/${child.id}`;
                            const isChildActive = location.pathname === childPath;

                            return (
                              <Link
                                key={child.id}
                                to={childPath}
                                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors group ${
                                  isChildActive 
                                    ? 'text-emerald-400 font-semibold bg-emerald-500/5' 
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/20'
                                }`}
                              >
                                <Music className="w-3.5 h-3.5 shrink-0 text-slate-600 group-hover:text-slate-500" />
                                <span className="truncate">{child.name}</span>
                              </Link>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </nav>
        </div>

        {/* User profile */}
        <div className="p-4 border-t border-slate-800 relative shrink-0">
          {isProfileOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl z-50 space-y-0.5">
              <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors group">
                <User className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" /> My Profile
              </Link>
              <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors group">
                <Settings className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" /> Settings
              </Link>
              <div className="h-px bg-slate-800 my-1 mx-1" />
              <button onClick={() => { setIsProfileOpen(false); logoutUser(); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-lg transition-colors group text-left">
                <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-400" /> Sign Out
              </button>
            </div>
          )}

          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all border text-left group ${isProfileOpen ? 'bg-slate-800 border-slate-700' : 'border-transparent hover:bg-slate-800/50'}`}>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
              {user?.displayName ? user.displayName.substring(0, 2) : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate">{user?.displayName || user?.username || 'Account'}</p>
              <p className="text-xs text-slate-500 truncate group-hover:text-slate-400 transition-colors">{user?.email || 'Premium Member'}</p>
            </div>
            <ChevronUp className={`w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

      </aside>

      {/* Main page area layout */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {/* Injects opened page into main page area */}
          <Outlet />
        </main>
      </div>

      {/* ========================================== */}
      {/* 🖼️ POP-UP MODAL ENGINE                     */}
      {/* ========================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* 1. Dark Blur Backdrop Shield */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm cursor-default"
            onClick={() => setIsCreateModalOpen(false)} // Close when clicking outside form canvas
          />

          {/* 2. Modal Card Frame Container */}
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header row with a simple Cancel button */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Create New Playlist</h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* 3. Your Imported Form Component */}
            <CreatePlaylistModal 
              onCreated={(newPlaylist) => {
                // 🎉 Success Callback Loop:
                setPlaylists((prev) => [...prev, newPlaylist]); // Append to sidebar track layout instantly
                setIsCreateModalOpen(false);                    // Close modal
              }} 
            />
            
          </div>
        </div>
      )}

    </div>
  );
};