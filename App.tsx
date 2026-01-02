import React, { useState, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from './config/wagmi';

import Navbar from './components/Navbar';
import WaveformPlayer from './components/WaveformPlayer';
import MintCard from './components/MintCard';
import SongUploader from './components/SongUploader';
import Web3Guard from './components/Web3Guard';

import { Song } from './types';
import { fetchSongData, mintFragment } from './services/mockBlockchain';
import { useUserProfile } from './hooks/useUserProfile';

const queryClient = new QueryClient();

// Main Inner Component to use Hooks
const EtherLoopApp = () => {
  const [currentView, setCurrentView] = useState<'marketplace' | 'studio'>('marketplace');
  const [song, setSong] = useState<Song | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Custom Web3 Hook
  const { user, isFirstTime, balance } = useUserProfile();

  // Initialize Data
  useEffect(() => {
    const init = async () => {
      const songData = await fetchSongData('song_1');
      setSong(songData);
    };
    init();
  }, []);

  // Show Onboarding Toast
  useEffect(() => {
    if (isFirstTime) {
      setNotification("Welcome to EtherLoop! Connect your wallet to start collecting.");
    }
  }, [isFirstTime]);

  const handleMint = async () => {
    if (!song || !user) {
        showNotification("Please connect your wallet first.");
        return;
    }
    
    setIsMinting(true);
    try {
      const result = await mintFragment(song.id, user);
      if (result.success && result.fragment) {
        setSong(prev => {
          if (!prev) return null;
          const newFragments = prev.fragments.map(f => 
            f.id === result.fragment?.id ? result.fragment : f
          );
          return {
            ...prev,
            fragments: newFragments,
            mintedFragments: prev.mintedFragments + 1
          };
        });
        showNotification(`Success! You revealed Fragment #${result.fragment.index + 1}`);
      } else {
        showNotification("Mint failed or sold out.");
      }
    } catch (error) {
      showNotification("Transaction error.");
    } finally {
      setIsMinting(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-ether-500 selection:text-black">
      <Navbar 
        currentUser={user} 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {currentView === 'marketplace' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Visualizer & Info */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {song && (
                <div className="animate-fade-in">
                  <WaveformPlayer 
                    song={song} 
                    currentUser={user}
                  />
                  <div className="mt-8 prose prose-invert max-w-none">
                     <div className="flex justify-between items-center">
                         <h3 className="text-xl font-bold text-ether-100">About the Track</h3>
                         {user && <span className="text-xs text-ether-400 font-mono border border-ether-900 px-2 py-1 rounded">YOUR BALANCE: {balance}</span>}
                     </div>
                     <p className="text-slate-400">
                        "Neon Nights" is an exclusive algorithmic house track generated for the Etherlink Hackathon. 
                        It features 8 unique loops. Collecting a loop grants you commercial royalty-free rights 
                        to that specific stem used in the composition.
                     </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Mint Action */}
            <div className="lg:col-span-4 h-full">
               {song ? (
                  <MintCard 
                    song={song} 
                    onMint={handleMint} 
                    isMinting={isMinting} 
                  />
               ) : (
                  <div className="h-64 bg-slate-900 animate-pulse rounded-xl"></div>
               )}
            </div>
          </div>
        )}

        {currentView === 'studio' && (
           <Web3Guard>
              <SongUploader />
           </Web3Guard>
        )}
      </main>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-8 right-8 bg-ether-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-bounce cursor-pointer" onClick={() => setNotification(null)}>
          {notification}
        </div>
      )}
    </div>
  );
};

// Root App Wrapper for Providers
export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#14b8a6', // ether-500
          accentColorForeground: 'white',
          borderRadius: 'medium',
        })}>
          <EtherLoopApp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}