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

// import {
//   useState,
//   type CSSProperties,
//   type KeyboardEvent,
//   type PointerEvent,
// } from "react";

// /**
//  * Realistic 3D jewel case (CD) built with real CSS 3D transforms.
//  *
//  * Real-world proportions: 142 x 125 x 10 mm case, 120 mm disc, 15 mm hole.
//  * Everything is sized from a single CSS variable (--mm), so one `width` prop
//  * scales the whole thing.
//  *
//  * Gotcha: never put `overflow`, `filter`, `opacity < 1`, `mask` or `clip-path`
//  * on an ancestor of the 3D scene. They flatten `preserve-3d` and the case
//  * collapses into a flat card.
//  */

// export interface CdCaseProps {
//   title: string;
//   artist: string;
//   tracks?: string[];
//   /** Front cover image URL. Falls back to generated art. */
//   coverSrc?: string;
//   /** Printed colour of the disc label (also tints the fallback cover). */
//   discColor?: string;
//   /** Background colour of the spine strip. */
//   spineColor?: string;
//   /** Case width in px. Height follows the real 142:125 ratio. */
//   width?: number;
//   defaultOpen?: boolean;
//   onToggle?: (open: boolean) => void;
//   className?: string;
// }

// // Real dimensions in millimetres
// const W = 142;
// const H = 125;
// const D = 10;
// const ART = 120;
// const ART_LEFT = 14;
// const ART_TOP = 2.5;
// const CX = ART_LEFT + ART / 2; // disc centre x
// const CY = ART_TOP + ART / 2; // disc centre y
// const OPEN_ANGLE = -158;
// const OPEN_SHIFT = 62; // keeps the open case roughly centred

// const mm = (n: number) => `calc(var(--mm) * ${n})`;

// const box = (x: number, y: number, w: number, h: number): CSSProperties => ({
//   position: "absolute",
//   left: mm(x),
//   top: mm(y),
//   width: mm(w),
//   height: mm(h),
// });

// const hidden: CSSProperties = {
//   backfaceVisibility: "hidden",
//   WebkitBackfaceVisibility: "hidden",
// };

// const clearPlastic: CSSProperties = {
//   background:
//     "linear-gradient(135deg, rgba(200,220,235,.14), rgba(200,220,235,.04) 45%, rgba(200,220,235,.12))",
//   boxShadow:
//     "inset 0 0 0 1px rgba(255,255,255,.28), inset 0 0 14px rgba(255,255,255,.10)",
// };

// /** Moving specular highlight that follows the tilt. */
// function Gloss({ shift, strength = 1 }: { shift: number; strength?: number }) {
//   const pos = Math.max(0, Math.min(100, 50 + shift));
//   return (
//     <div
//       aria-hidden
//       className="pointer-events-none absolute inset-0"
//       style={{
//         backgroundImage: `linear-gradient(112deg,
//           rgba(255,255,255,${0.5 * strength}) 0%,
//           rgba(255,255,255,0) 26%,
//           rgba(255,255,255,0) 56%,
//           rgba(255,255,255,${0.22 * strength}) 64%,
//           rgba(255,255,255,0) 72%)`,
//         backgroundSize: "260% 100%",
//         backgroundPosition: `${pos}% 0`,
//       }}
//     />
//   );
// }

// function FallbackArt({
//   title,
//   artist,
//   color,
// }: {
//   title: string;
//   artist: string;
//   color: string;
// }) {
//   return (
//     <div
//       className="relative h-full w-full text-white"
//       style={{
//         background: `radial-gradient(circle at 24% 22%, rgba(255,255,255,.38), transparent 40%),
//                      radial-gradient(circle at 80% 85%, ${color}, transparent 60%),
//                      linear-gradient(160deg, ${color}, #070b16)`,
//       }}
//     >
//       <div className="absolute inset-x-0 bottom-0" style={{ padding: mm(7) }}>
//         <div
//           className="font-semibold leading-[0.95] tracking-tight"
//           style={{ fontSize: mm(12) }}
//         >
//           {title}
//         </div>
//         <div className="opacity-80" style={{ fontSize: mm(5), marginTop: mm(2) }}>
//           {artist}
//         </div>
//       </div>
//     </div>
//   );
// }

// function Disc({
//   color,
//   title,
//   shift,
// }: {
//   color: string;
//   title: string;
//   shift: number;
// }) {
//   const holeMask = `radial-gradient(circle, transparent ${mm(7.5)}, #000 ${mm(7.6)})`;
//   return (
//     <div
//       style={{
//         ...box(ART_LEFT, ART_TOP, ART, ART),
//         borderRadius: "9999px",
//         transform: `translateZ(${mm(-1.5)})`,
//         maskImage: holeMask,
//         WebkitMaskImage: holeMask,
//         boxShadow:
//           "inset 0 0 0 1px rgba(255,255,255,.55), inset 0 0 0 2px rgba(0,0,0,.18)",
//         backgroundImage: [
//           // anisotropic sheen, slides with the tilt
//           `conic-gradient(from ${shift * 3}deg, transparent 0 12%, rgba(255,255,255,.42) 22%, transparent 32% 62%, rgba(255,255,255,.42) 72%, transparent 82%)`,
//           // clamp ring + stacking ring near the hole
//           `radial-gradient(circle, transparent 0 ${mm(7.5)}, rgba(255,255,255,.4) ${mm(7.5)} ${mm(8.6)}, rgba(255,255,255,.14) ${mm(8.6)} ${mm(17)}, rgba(0,0,0,.2) ${mm(17)} ${mm(17.6)}, transparent ${mm(17.6)})`,
//           // printed label
//           `radial-gradient(circle, transparent 0 ${mm(17.6)}, ${color} ${mm(17.6)} ${mm(58.6)}, transparent ${mm(58.6)})`,
//           // fine grooves
//           "repeating-radial-gradient(circle, rgba(0,0,0,.05) 0 1px, transparent 1px 3px)",
//           // bare polycarbonate
//           "conic-gradient(#cfd5db, #f2f4f6, #b9c3cf, #f6f1f8, #d4e6df, #f0f0f0, #c3ccd7, #fbf0f6, #cfd5db)",
//         ].join(","),
//       }}
//     >
//       <div
//         className="absolute left-1/2 -translate-x-1/2 text-center font-medium tracking-wide text-white/85"
//         style={{ top: mm(26), fontSize: mm(3.6), maxWidth: mm(40) }}
//       >
//         {title}
//       </div>
//     </div>
//   );
// }

// export function CdCase({
//   title,
//   artist,
//   tracks = [],
//   coverSrc,
//   discColor = "#1d3557",
//   spineColor = "#0e1117",
//   width = 320,
//   defaultOpen = false,
//   onToggle,
//   className = "",
// }: CdCaseProps) {
//   const [open, setOpen] = useState(defaultOpen);
//   const [tilt, setTilt] = useState({ x: 0, y: 0 });

//   const toggle = () => {
//     const next = !open;
//     setOpen(next);
//     onToggle?.(next);
//   };

//   const onMove = (e: PointerEvent<HTMLDivElement>) => {
//     if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
//     const r = e.currentTarget.getBoundingClientRect();
//     const dx = (e.clientX - r.left) / r.width - 0.5;
//     const dy = (e.clientY - r.top) / r.height - 0.5;
//     setTilt({ x: -dy * 14, y: dx * 20 });
//   };

//   const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
//     if (e.key === "Enter" || e.key === " ") {
//       e.preventDefault();
//       toggle();
//     }
//   };

//   const shift = tilt.y * 2.5;

//   return (
//     <div
//       role="button"
//       tabIndex={0}
//       aria-pressed={open}
//       aria-label={`${title} by ${artist}. ${open ? "Close" : "Open"} case`}
//       onClick={toggle}
//       onKeyDown={onKey}
//       onPointerMove={onMove}
//       onPointerLeave={() => setTilt({ x: 0, y: 0 })}
//       className={`relative cursor-pointer select-none rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80 focus-visible:ring-offset-8 ${className}`}
//       style={
//         {
//           "--mm": `${width / W}px`,
//           width: mm(W),
//           height: mm(H),
//           perspective: mm(700),
//         } as CSSProperties
//       }
//     >
//       {/* ground shadow */}
//       <div
//         aria-hidden
//         className="absolute rounded-[50%] bg-black/45 blur-xl transition-all duration-700 motion-reduce:transition-none"
//         style={{
//           left: mm(open ? -60 : 10),
//           top: mm(H - 6),
//           width: mm(open ? 250 : 122),
//           height: mm(16),
//         }}
//       />

//       {/* 3D scene */}
//       <div
//         className="relative transition-transform duration-500 ease-out motion-reduce:transition-none"
//         style={{
//           width: mm(W),
//           height: mm(H),
//           transformStyle: "preserve-3d",
//           transform: `translateX(${mm(open ? OPEN_SHIFT : 0)}) rotateX(${
//             tilt.x + 6
//           }deg) rotateY(${tilt.y + (open ? 12 : 24)}deg)`,
//         }}
//       >
//         {/* BACK: clear plastic over the traycard */}
//         <div
//           style={{
//             ...box(0, 0, W, H),
//             ...hidden,
//             transform: `translateZ(${mm(-D / 2)}) rotateY(180deg)`,
//             borderRadius: mm(1.5),
//             background: "#0b0d12",
//           }}
//         >
//           <div style={box(0, 3, W, H - 6)} className="flex">
//             <div style={{ width: mm(6.5), background: spineColor }} />
//             <div
//               className="flex-1 text-white"
//               style={{ background: "#14161c", padding: mm(6) }}
//             >
//               <div
//                 className="font-semibold leading-none tracking-tight"
//                 style={{ fontSize: mm(8) }}
//               >
//                 {title}
//               </div>
//               <div className="text-white/60" style={{ fontSize: mm(4), marginTop: mm(1.5) }}>
//                 {artist}
//               </div>
//               <ol
//                 className="text-white/80"
//                 style={{ marginTop: mm(6), fontSize: mm(3.6), lineHeight: 1.55 }}
//               >
//                 {tracks.map((t, i) => (
//                   <li key={t} className="flex" style={{ gap: mm(2.5) }}>
//                     <span className="w-[2ch] text-right tabular-nums text-white/40">
//                       {i + 1}
//                     </span>
//                     <span>{t}</span>
//                   </li>
//                 ))}
//               </ol>
//             </div>
//             <div style={{ width: mm(6.5), background: spineColor }} />
//           </div>
//           <div style={clearPlastic} className="absolute inset-0 rounded-[inherit]" />
//           <Gloss shift={-shift} strength={0.9} />
//         </div>

//         {/* TRAY: black plastic with the hub */}
//         <div
//           style={{
//             ...box(0, 0, W, H),
//             ...hidden,
//             transform: `translateZ(${mm(-3.6)})`,
//             borderRadius: mm(1.5),
//             background:
//               "linear-gradient(90deg, #08080a, #1a1b1e 10%, #111214 50%, #1a1b1e 90%, #08080a)",
//           }}
//         >
//           {/* rails */}
//           <div
//             style={{ ...box(8, 4, 3, H - 8), borderRadius: mm(1.5) }}
//             className="bg-white/[0.05]"
//           />
//           <div
//             style={{ ...box(W - 11, 4, 3, H - 8), borderRadius: mm(1.5) }}
//             className="bg-white/[0.05]"
//           />
//           {/* raised hub */}
//           <div
//             style={{
//               ...box(CX - 17, CY - 17, 34, 34),
//               borderRadius: "9999px",
//               background:
//                 "radial-gradient(circle at 40% 35%, #2b2d31, #151618 70%)",
//               boxShadow: "inset 0 0 0 1px rgba(255,255,255,.07)",
//             }}
//           />
//           <div
//             style={{
//               ...box(CX - 4.5, CY - 4.5, 9, 9),
//               borderRadius: "9999px",
//               background: "#26272a",
//             }}
//           />
//           {Array.from({ length: 12 }, (_, i) => (
//             <span
//               key={i}
//               style={{
//                 position: "absolute",
//                 left: mm(CX - 1.1),
//                 top: mm(CY - 1.7),
//                 width: mm(2.2),
//                 height: mm(3.4),
//                 borderRadius: mm(0.5),
//                 background: "linear-gradient(#3a3c41, #1a1b1d)",
//                 transform: `rotate(${i * 30}deg) translateY(${mm(-6.2)})`,
//               }}
//             />
//           ))}
//         </div>

//         {/* DISC */}
//         <Disc color={discColor} title={title} shift={shift} />

//         {/* SPINE (left edge) */}
//         <div
//           style={{
//             position: "absolute",
//             left: 0,
//             top: 0,
//             width: mm(D),
//             height: mm(H),
//             transformOrigin: "left center",
//             transform: `translateZ(${mm(-D / 2)}) rotateY(-90deg)`,
//             background: spineColor,
//             ...hidden,
//           }}
//           className="flex items-center justify-center overflow-hidden text-white"
//         >
//           <div
//             className="flex items-center font-medium"
//             style={{
//               writingMode: "vertical-rl",
//               fontSize: mm(4.2),
//               gap: mm(5),
//             }}
//           >
//             <span>{artist}</span>
//             <span className="text-white/55">{title}</span>
//           </div>
//           <div style={clearPlastic} className="absolute inset-0" />
//           <Gloss shift={shift} strength={0.6} />
//         </div>

//         {/* RIGHT edge */}
//         <div
//           style={{
//             position: "absolute",
//             left: 0,
//             top: 0,
//             width: mm(D),
//             height: mm(H),
//             transformOrigin: "left center",
//             transform: `translateX(${mm(W)}) translateZ(${mm(D / 2)}) rotateY(90deg)`,
//             background: "rgba(10,12,16,.85)",
//             ...hidden,
//           }}
//         >
//           <div style={clearPlastic} className="absolute inset-0" />
//         </div>

//         {/* TOP edge */}
//         <div
//           style={{
//             position: "absolute",
//             left: 0,
//             top: 0,
//             width: mm(W),
//             height: mm(D),
//             transformOrigin: "top center",
//             transform: `translateZ(${mm(-D / 2)}) rotateX(90deg)`,
//             background: "rgba(10,12,16,.8)",
//             ...hidden,
//           }}
//         >
//           <div style={clearPlastic} className="absolute inset-0" />
//         </div>

//         {/* BOTTOM edge */}
//         <div
//           style={{
//             position: "absolute",
//             left: 0,
//             top: mm(H),
//             width: mm(W),
//             height: mm(D),
//             transformOrigin: "top center",
//             transform: `translateZ(${mm(D / 2)}) rotateX(-90deg)`,
//             background: "rgba(10,12,16,.8)",
//             ...hidden,
//           }}
//         >
//           <div style={clearPlastic} className="absolute inset-0" />
//         </div>

//         {/* LID: hinges on the left edge */}
//         <div
//           className="transition-transform duration-[900ms] ease-[cubic-bezier(.3,.7,.2,1)] motion-reduce:transition-none"
//           style={{
//             ...box(0, 0, W, H),
//             transformStyle: "preserve-3d",
//             transformOrigin: "left center",
//             transform: `translateZ(${mm(D / 2)}) rotateY(${open ? OPEN_ANGLE : 0}deg)`,
//           }}
//         >
//           {/* outside: cover art */}
//           <div
//             style={{
//               ...box(0, 0, W, H),
//               ...hidden,
//               borderRadius: mm(1.5),
//               background: "rgba(8,10,14,.35)",
//             }}
//           >
//             <div
//               style={{
//                 ...box(ART_LEFT, ART_TOP, ART, ART),
//                 boxShadow: "0 0 0 1px rgba(0,0,0,.35)",
//               }}
//               className="overflow-hidden"
//             >
//               {coverSrc ? (
//                 <img
//                   src={coverSrc}
//                   alt={`${title} cover`}
//                   draggable={false}
//                   className="h-full w-full object-cover"
//                 />
//               ) : (
//                 <FallbackArt title={title} artist={artist} color={discColor} />
//               )}
//               {/* booklet fold */}
//               <div
//                 aria-hidden
//                 className="absolute inset-y-0 left-0"
//                 style={{
//                   width: mm(3),
//                   background:
//                     "linear-gradient(90deg, rgba(255,255,255,.22) 0, rgba(0,0,0,.28) 18%, transparent 100%)",
//                 }}
//               />
//             </div>
//             <div style={clearPlastic} className="absolute inset-0 rounded-[inherit]" />
//             <Gloss shift={shift} />
//           </div>

//           {/* inside: booklet back page */}
//           <div
//             style={{
//               ...box(0, 0, W, H),
//               ...hidden,
//               transform: "rotateY(180deg)",
//               borderRadius: mm(1.5),
//               background: "rgba(8,10,14,.25)",
//             }}
//           >
//             <div
//               style={{ ...box(8, ART_TOP, ART, ART), padding: mm(8) }}
//               className="bg-[#e8e5dc] text-neutral-800"
//             >
//               <div
//                 className="font-semibold leading-none tracking-tight"
//                 style={{ fontSize: mm(8) }}
//               >
//                 {title}
//               </div>
//               <div className="text-neutral-600" style={{ fontSize: mm(4), marginTop: mm(1.5) }}>
//                 {artist}
//               </div>
//               <ol
//                 style={{ marginTop: mm(8), fontSize: mm(3.8), lineHeight: 1.6 }}
//                 className="text-neutral-700"
//               >
//                 {tracks.map((t, i) => (
//                   <li key={t} className="flex" style={{ gap: mm(3) }}>
//                     <span className="w-[2ch] text-right tabular-nums text-neutral-400">
//                       {i + 1}
//                     </span>
//                     <span>{t}</span>
//                   </li>
//                 ))}
//               </ol>
//             </div>
//             <div style={clearPlastic} className="absolute inset-0 rounded-[inherit]" />
//             <Gloss shift={-shift} strength={0.8} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CdCase;

/* Usage
<CdCase
  title="Night Shift"
  artist="Harbour Lights"
  tracks={["Low Tide", "Neon Static", "Night Shift", "Paper Moon"]}
  coverSrc="/covers/night-shift.jpg"
  discColor="#7a1f3d"
  width={340}
/>
*/
