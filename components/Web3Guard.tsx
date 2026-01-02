import React from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ShieldAlert } from 'lucide-react';

interface Web3GuardProps {
  children: React.ReactNode;
}

const Web3Guard: React.FC<Web3GuardProps> = ({ children }) => {
  const { isConnected, chainId } = useAccount();

  // Basic check for Etherlink Chains (Testnet or Mainnet)
  const isCorrectChain = chainId === 42793 || chainId === 128123;

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6 animate-fade-in">
        <div className="bg-slate-900 p-6 rounded-full border border-slate-800">
           <ShieldAlert className="w-12 h-12 text-ether-500" />
        </div>
        <div>
           <h2 className="text-2xl font-bold text-white mb-2">Wallet Connection Required</h2>
           <p className="text-slate-400 max-w-md mx-auto mb-6">
             To access the Artist Studio and manage your audio assets, you need to connect your wallet to Etherlink.
           </p>
           <div className="flex justify-center">
             <ConnectButton />
           </div>
        </div>
      </div>
    );
  }

  if (!isCorrectChain) {
     return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Wrong Network</h2>
        <p className="text-slate-400">Please switch to Etherlink Mainnet or Testnet.</p>
        <div className="flex justify-center">
             <ConnectButton showBalance={false} />
        </div>
      </div>
     );
  }

  return <>{children}</>;
};

export default Web3Guard;