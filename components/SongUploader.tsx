import React, { useState } from 'react';
import { Upload, Scissors, Music, CheckCircle } from 'lucide-react';

const SongUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState< 'idle' | 'uploading' | 'chopping' | 'ready'>('idle');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startProcess = () => {
    if (!file) return;
    
    // Simulate Upload to IPFS
    setStep('uploading');
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        startChopping();
      }
    }, 100);
  };

  const startChopping = () => {
    // Simulate ffmpeg.wasm processing locally
    setStep('chopping');
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
        // Random jumps to simulate complex processing
      p += Math.random() * 15;
      if (p > 100) p = 100;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setStep('ready');
      }
    }, 300);
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-ether-100 flex items-center gap-2">
        <Music className="text-ether-500" /> 
        Artist Studio: Upload & Chop
      </h2>

      {step === 'idle' && (
        <div className="border-2 border-dashed border-slate-700 rounded-xl p-12 text-center hover:border-ether-500 transition-colors bg-slate-900/50">
          <input 
            type="file" 
            accept="audio/*" 
            onChange={handleFileChange} 
            className="hidden" 
            id="audio-upload"
          />
          <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center">
            <div className="bg-slate-800 p-4 rounded-full mb-4">
               <Upload className="w-8 h-8 text-ether-400" />
            </div>
            <span className="text-lg font-medium text-white mb-2">
              {file ? file.name : "Drop your Master Track here"}
            </span>
            <span className="text-sm text-slate-500">WAV, FLAC or MP3 (Max 50MB)</span>
          </label>

          {file && (
             <button 
                onClick={startProcess}
                className="mt-6 bg-ether-600 hover:bg-ether-500 text-white px-6 py-2 rounded-lg font-bold transition-all"
             >
                Start Processing
             </button>
          )}
        </div>
      )}

      {(step === 'uploading' || step === 'chopping') && (
        <div className="text-center py-12">
            <div className="flex justify-center mb-6">
                {step === 'uploading' ? (
                    <Upload className="w-12 h-12 text-ether-400 animate-bounce" />
                ) : (
                    <Scissors className="w-12 h-12 text-neon-pink animate-pulse" />
                )}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
                {step === 'uploading' ? 'Uploading to IPFS...' : 'Chopping Loops with ffmpeg.wasm...'}
            </h3>
            <p className="text-slate-400 text-sm mb-6">
                {step === 'uploading' ? 'Securing your asset on Pinata' : 'Processing audio locally in browser to ensure gapless playback'}
            </p>
            
            <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-300 ${step === 'uploading' ? 'bg-ether-500' : 'bg-neon-pink'}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="mt-2 text-right text-xs text-slate-500 font-mono">{Math.round(progress)}%</div>
        </div>
      )}

      {step === 'ready' && (
          <div className="text-center py-12">
             <div className="flex justify-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-500" />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Track Ready!</h3>
             <p className="text-slate-400 mb-8">
                 Your song has been sliced into 8 fragments, metadata generated, and is ready to deploy to Etherlink.
             </p>
             <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                 Deploy Contract (ERC-1155)
             </button>
          </div>
      )}
    </div>
  );
};

export default SongUploader;