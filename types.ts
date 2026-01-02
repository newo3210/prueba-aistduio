export interface User {
  id: string;
  address: string; // 0x...
  username?: string; // Basename
  avatarUrl: string;
  isArtist: boolean;
}

export interface Fragment {
  id: string;
  index: number; // Position in the song (0, 1, 2...)
  startTime: number;
  endTime: number;
  price: number; // In XTZ/Eth
  ownerId: string | null; // Null means unminted
  isRevealed: boolean;
}

export interface Song {
  id: string;
  title: string;
  artist: User;
  audioUrl: string; // IPFS hash or local blob for demo
  duration: number;
  totalFragments: number;
  mintedFragments: number;
  fragments: Fragment[];
  waveformJson?: string; // Pre-calculated waveform data
  coverArt: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string;
}