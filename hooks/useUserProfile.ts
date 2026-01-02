import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { User } from '../types';

export const useUserProfile = () => {
  const { address, isConnected, chainId } = useAccount();
  const { data: balanceData } = useBalance({
    address: address,
  });

  const [isFirstTime, setIsFirstTime] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  // Handle "Onboarding" Logic
  useEffect(() => {
    if (isConnected && address) {
      const hasVisited = localStorage.getItem(`etherloop_visited_${address}`);
      if (!hasVisited) {
        setIsFirstTime(true);
        localStorage.setItem(`etherloop_visited_${address}`, 'true');
      } else {
        setIsFirstTime(false);
      }
    }
  }, [isConnected, address]);

  // Generate Profile Data
  useEffect(() => {
    if (isConnected && address) {
        // In a real app, you would fetch this from your backend/Indexer
        // ensuring the user matches the connected wallet
        const mockProfile: User = {
            id: address.toLowerCase(),
            address: address,
            // Generate a cool username from address if not set
            username: `user_${address.substring(2, 6)}...${address.substring(address.length - 4)}`,
            // Generate dynamic avatar based on address (Effigy or similar)
            avatarUrl: `https://effigy.im/a/${address}.png`,
            isArtist: false, // Default
        };
        setUserProfile(mockProfile);
    } else {
        setUserProfile(null);
    }
  }, [isConnected, address]);

  return {
    user: userProfile,
    address,
    isConnected,
    chainId,
    balance: balanceData ? `${parseFloat(balanceData.formatted).toFixed(4)} ${balanceData.symbol}` : '0.00 XTZ',
    isFirstTime,
  };
};