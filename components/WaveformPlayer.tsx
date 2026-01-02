import React, { useEffect, useRef, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import { Song, Fragment, User } from '../types';
import { Play, Pause, Lock, Unlock } from 'lucide-react';

interface WaveformPlayerProps {
  song: Song;
  currentUser: User | null;
  onTimeUpdate?: (currentTime: number) => void;
}

const WaveformPlayer: React.FC<WaveformPlayerProps> = ({ song, currentUser, onTimeUpdate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsRef = useRef<RegionsPlugin | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentFragmentIndex, setCurrentFragmentIndex] = useState<number | null>(null);

  // Initialize WaveSurfer
  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#2dd4bf', // Ether Teal
      progressColor: '#ccfbf1',
      cursorColor: '#ff00ff',
      barWidth: 3,
      barGap: 3,
      barRadius: 3,
      height: 160,
      normalize: true,
      backend: 'WebAudio', // Necessary for better control
    });

    // Register Regions Plugin
    const wsRegions = ws.registerPlugin(RegionsPlugin.create());
    regionsRef.current = wsRegions;
    wavesurferRef.current = ws;

    ws.load(song.audioUrl);

    ws.on('ready', () => {
      setIsReady(true);
      initializeRegions();
    });

    ws.on('audioprocess', (currentTime) => {
      handleAudioProcess(currentTime);
      if (onTimeUpdate) onTimeUpdate(currentTime);
    });

    ws.on('finish', () => setIsPlaying(false));

    return () => {
      ws.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.audioUrl]);

  // Re-run region drawing when song fragments update (e.g. after mint)
  useEffect(() => {
    if (isReady && regionsRef.current) {
      regionsRef.current.clearRegions();
      initializeRegions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.fragments, isReady]);

  const initializeRegions = () => {
    if (!regionsRef.current || !wavesurferRef.current) return;

    song.fragments.forEach((frag) => {
      const isOwned = frag.ownerId !== null;
      
      const regionContent = document.createElement('div');
      regionContent.style.width = '100%';
      regionContent.style.height = '100%';
      regionContent.style.position = 'relative';

      // Avatar Logic (Social Reveal)
      if (isOwned) {
        const avatar = document.createElement('img');
        // Deterministic avatar based on owner ID for demo
        avatar.src = `https://picsum.photos/seed/${frag.ownerId}/30/30`;
        avatar.style.width = '30px';
        avatar.style.height = '30px';
        avatar.style.borderRadius = '50%';
        avatar.style.border = '2px solid #2dd4bf';
        avatar.style.position = 'absolute';
        avatar.style.top = '10px';
        avatar.style.left = '50%';
        avatar.style.transform = 'translateX(-50%)';
        avatar.style.zIndex = '10';
        avatar.title = `Owned by ${frag.ownerId}`;
        regionContent.appendChild(avatar);
      } else {
        const lockIcon = document.createElement('div');
        lockIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
        lockIcon.style.position = 'absolute';
        lockIcon.style.top = '50%';
        lockIcon.style.left = '50%';
        lockIcon.style.transform = 'translate(-50%, -50%)';
        regionContent.appendChild(lockIcon);
      }

      regionsRef.current?.addRegion({
        id: frag.id,
        start: frag.startTime,
        end: frag.endTime,
        color: isOwned ? 'rgba(45, 212, 191, 0.1)' : 'rgba(10, 10, 10, 0.85)', // Transparent teal if owned, dark grey mask if locked
        drag: false,
        resize: false,
        content: regionContent,
      });
    });
  };

  const handleAudioProcess = (currentTime: number) => {
    if (!wavesurferRef.current) return;

    // Find current fragment
    const currentFrag = song.fragments.find(f => currentTime >= f.startTime && currentTime < f.endTime);
    
    if (currentFrag) {
      if (currentFrag.index !== currentFragmentIndex) {
        setCurrentFragmentIndex(currentFrag.index);
      }

      // Logic: If unminted, mute volume. If minted, full volume.
      // This creates the "Silence" effect for unrevealed areas.
      const volume = currentFrag.ownerId !== null ? 1 : 0;
      wavesurferRef.current.setVolume(volume);
    }
  };

  const togglePlay = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  return (
    <div className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-ether-100 flex items-center gap-2">
           Visualizer 
           <span className="text-xs bg-ether-900 text-ether-400 px-2 py-1 rounded">ETH-L2</span>
        </h3>
        <div className="flex items-center gap-4">
           {currentFragmentIndex !== null && (
             <div className="text-sm font-mono text-ether-400">
               Fragment: #{currentFragmentIndex + 1} 
               <span className="ml-2 text-slate-500">
                 {song.fragments[currentFragmentIndex].ownerId ? '[UNLOCKED]' : '[LOCKED]'}
               </span>
             </div>
           )}
        </div>
      </div>
      
      <div className="relative group">
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-slate-900/80">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ether-500"></div>
          </div>
        )}
        <div ref={containerRef} className="w-full rounded-lg overflow-hidden" />
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={togglePlay}
          disabled={!isReady}
          className={`flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${
            isReady 
              ? 'bg-ether-500 hover:bg-ether-400 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.5)]' 
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
      </div>
    </div>
  );
};

export default WaveformPlayer;