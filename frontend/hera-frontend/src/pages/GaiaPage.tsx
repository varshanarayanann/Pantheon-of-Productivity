// src/pages/GaiaPage.tsx

import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import GoddessPageLayout from '../components/GoddessPageLayout.js';
import { GODDESSES } from '../constants.js';

// Define the new color palette
const COLORS = {
  white: '#F9F7F3',
  gold: '#B58E62',
  sageGreen: '#8EA48E',
  deepTeal: '#2A526E',
};

// Styled Components for the breathing graphic and page layout
const BreathingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  background-color: ${COLORS.white};
  color: ${COLORS.deepTeal};
  font-family: 'Times New Roman', serif;
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
`;

const StartButton = styled.button`
  background-color: ${COLORS.gold};
  color: ${COLORS.white};
  border: none;
  padding: 15px 30px;
  font-size: 1.25rem;
  cursor: pointer;
  border-radius: 5px;
  font-family: 'Times New Roman', serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${COLORS.sageGreen};
  }
`;

const BreathingCircle = styled.div<{ phase: string }>`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 4s ease-in-out;
  box-shadow: 0 0 20px ${COLORS.deepTeal};
  background-color: ${COLORS.deepTeal};
  position: relative;

  ${props =>
    (props.phase === 'inhale' || props.phase === 'hold-in') &&
    `
      transform: scale(1.25);
      background-color: ${COLORS.sageGreen};
      box-shadow: 0 0 30px ${COLORS.sageGreen};
    `}

  ${props =>
    (props.phase === 'exhale' || props.phase === 'hold-out') &&
    `
      transform: scale(0.75);
      background-color: ${COLORS.deepTeal};
      box-shadow: 0 0 20px ${COLORS.deepTeal};
    `}
`;

const BreathingText = styled.p`
  margin-top: 2rem;
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
`;

const CounterText = styled.span<{ phase: string }>`
  color: ${COLORS.white};
  font-size: 2rem;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: font-size 1s ease-in-out;
  
  ${props =>
    (props.phase === 'inhale' || props.phase === 'hold-in') &&
    `
      font-size: 2.5rem;
    `}

  ${props =>
    (props.phase === 'exhale' || props.phase === 'hold-out') &&
    `
      font-size: 1.5rem;
    `}
`;

const GaiaPage: React.FC = () => {
  const gaia = GODDESSES.find(g => g.id === 'gaia')!;
  const [phase, setPhase] = useState('inhale');
  const [isRunning, setIsRunning] = useState(false);
  const [counter, setCounter] = useState(1);
  const holdCount = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // useRef to store the mutable state values
  const phaseRef = useRef(phase);
  const counterRef = useRef(counter);

  // Update refs whenever state changes
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    counterRef.current = counter;
  }, [counter]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const currentPhase = phaseRef.current;
        const currentCounter = counterRef.current;

        if (currentPhase === 'inhale') {
          if (currentCounter < 4) {
            setCounter(prev => prev + 1);
          } else {
            setPhase('hold-in');
            holdCount.current = 0; // Reset hold counter
          }
        } else if (currentPhase === 'hold-in') {
          holdCount.current++;
          if (holdCount.current >= 2) { // Hold for 2 seconds
            setPhase('exhale');
          }
        } else if (currentPhase === 'exhale') {
          if (currentCounter > 1) {
            setCounter(prev => prev - 1);
          } else {
            setPhase('hold-out');
            holdCount.current = 0; // Reset hold counter
          }
        } else if (currentPhase === 'hold-out') {
          holdCount.current++;
          if (holdCount.current >= 2) { // Hold for 2 seconds
            setPhase('inhale');
            setCounter(1); // Reset counter for the next cycle
          }
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  return (
    <GoddessPageLayout goddess={gaia}>
      <BreathingContainer>
        {isRunning ? (
          <>
            <BreathingCircle phase={phase}>
              <CounterText phase={phase}>{counter}</CounterText>
            </BreathingCircle>
            <BreathingText>{phase.toUpperCase()}</BreathingText>
          </>
        ) : (
          <StartButton onClick={() => setIsRunning(true)}>Start Breathing</StartButton>
        )}
      </BreathingContainer>
      <div className="text-center text-slate-600 dark:text-slate-400 py-16">
        <p>Gaia's Digital Garden Tool Placeholder</p>
        <p className="mt-2 text-sm">Nurture your notes, ideas, and knowledge in an interconnected space.</p>
      </div>
    </GoddessPageLayout>
  );
};

export default GaiaPage;