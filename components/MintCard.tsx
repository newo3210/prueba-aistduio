import React, { useState } from 'react';
import { Song, User } from '../types';
import { Disc, Zap, Trophy, ShieldCheck } from 'lucide-react';

interface MintCardProps {
  song: Song;
  onMint: () => Promise<void>;
  isMinting: boolean;
}

const MintCard: React.FC<MintCardProps> = ({ song, onMint, isMinting }) => {
  const percentage = Math.round((song.mintedFragments / song.totalFragments) * 100);
  const isSoldOut = song.mintedFragments === song.totalFragments;
  const nextPrice = 0.05; // Mock price

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-1 border border-slate-700 shadow-2xl h-full flex flex-col">
      <div className="bg-slate-900/90 p-6 rounded-lg flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{song.title}</h2>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <img src={song.artist.avatarUrl} alt={song.artist.username} className="w-5 h-5 rounded-full" />
              <span>{song.artist.username}</span>
            </div>
          </div>
          <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
             <Disc className={`w-8 h-8 ${isPlaying(percentage) ? 'animate-spin-slow text-ether-400' : 'text-slate-600'}`} />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-mono text-ether-300 mb-2">
            <span>REVEAL PROGRESS</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-ether-600 to-neon-blue transition-all duration-700 ease-out shadow-[0_0_10px_rgba(45,212,191,0.5)]"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 text-right">
            {song.mintedFragments}/{song.totalFragments} Fragments Minted
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50 flex flex-col items-center text-center">
                <Trophy className="w-5 h-5 text-yellow-500 mb-2" />
                <span className="text-xs text-slate-300">First Minter Badge</span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50 flex flex-col items-center text-center">
                <ShieldCheck className="w-5 h-5 text-ether-400 mb-2" />
                <span className="text-xs text-slate-300">Commercial Rights</span>
            </div>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-slate-400 text-sm">Price per Fragment</span>
            <span className="text-xl font-bold text-white">{nextPrice} ETH</span>
          </div>

          <button
            onClick={onMint}
            disabled={isMinting || isSoldOut}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 ${
              isSoldOut 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-ether-600 to-ether-500 hover:from-ether-500 hover:to-ether-400 text-white shadow-lg hover:shadow-ether-500/25'
            }`}
          >
             {isMinting ? (
                 <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Minting...
                 </>
             ) : isSoldOut ? (
                 "SOLD OUT"
             ) : (
                 <>
                    <Zap className="w-5 h-5 fill-current" />
                    Blind Mint Fragment
                 </>
             )}
          </button>
          <p className="text-xs text-center text-slate-600 mt-3">
             Powered by Etherlink (Tezos L2). Gas fees &lt; $0.01.
          </p>
        </div>
      </div>
    </div>
  );
};

const isPlaying = (percent: number) => percent > 0 && percent < 100;

export default MintCard;