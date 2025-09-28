// MusicPlayerContext.tsx
import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

// Define the shape of the music player state
interface PlayerState {
    currentTrackUrl: string | null;
    isPlaying: boolean;
    volume: number;
}

interface MusicPlayerContextType {
    playerState: PlayerState;
    playTrack: (url: string) => void;
    pauseTrack: () => void;
    setVolume: (volume: number) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playerState, setPlayerState] = useState<PlayerState>({
        currentTrackUrl: null,
        isPlaying: false,
        volume: 0.5,
    });

    // Initialize the audio element once
    if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.loop = true;
        audioRef.current.volume = playerState.volume;
    }

    const playTrack = (url: string) => {
        if (audioRef.current) {
            if (audioRef.current.src !== url) {
                audioRef.current.src = url;
            }
            audioRef.current.play();
            setPlayerState(prevState => ({ ...prevState, currentTrackUrl: url, isPlaying: true }));
        }
    };

    const pauseTrack = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setPlayerState(prevState => ({ ...prevState, isPlaying: false }));
        }
    };

    const setVolume = (volume: number) => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            setPlayerState(prevState => ({ ...prevState, volume }));
        }
    };

    return (
        <MusicPlayerContext.Provider value={{ playerState, playTrack, pauseTrack, setVolume }}>
            {children}
        </MusicPlayerContext.Provider>
    );
};

export const useMusicPlayer = () => {
    const context = useContext(MusicPlayerContext);
    if (context === undefined) {
        throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
    }
    return context;
};