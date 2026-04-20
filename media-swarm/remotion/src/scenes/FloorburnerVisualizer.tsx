import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Sequence, Img} from 'remotion';
import {spring} from 'remotion';

interface Props {
  trackTitle: string;
}

export const FloorburnerVisualizer: React.FC<Props> = ({trackTitle}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  
  const timeInSeconds = frame / fps;
  
  // Beat detection simulation (130 BPM = ~2.17 beats per second)
  const beat = Math.sin(timeInSeconds * 8.15) * 0.5 + 0.5; // Strong pulse at 130 BPM
  
  // Scene timing based on FLOORBURNER structure (in seconds)
  const isIntro = timeInSeconds < 45;
  const isBuild1 = timeInSeconds >= 45 && timeInSeconds < 90;
  const isDrop1 = timeInSeconds >= 90 && timeInSeconds < 150;
  const isBreakdown = timeInSeconds >= 195 && timeInSeconds < 240;
  const isBuild2 = timeInSeconds >= 240 && timeInSeconds < 285;
  const isDrop2 = timeInSeconds >= 285 && timeInSeconds < 375;
  const isClimax = timeInSeconds >= 375 && timeInSeconds < 450;
  const isOutro = timeInSeconds >= 450;

  // Intensity based on section
  const intensity = isDrop1 || isDrop2 || isClimax 
    ? 1.0 
    : isBuild1 || isBuild2 
      ? 0.7 
      : isBreakdown 
        ? 0.3 
        : 0.4;

  const scale = spring({
    frame: frame - (isDrop1 || isDrop2 ? 20 : 0),
    fps,
    config: {damping: 15, stiffness: 80},
  });

  const fireIntensity = interpolate(intensity * beat, [0, 1], [0.6, 1.8]);

  return (
    <AbsoluteFill style={{background: '#0a0a0a'}}>
      {/* Dark club background with subtle grid */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 30%, #1a0000 0%, #000000 70%)',
          boxShadow: 'inset 0 0 180px rgba(255, 40, 0, 0.6)',
        }}
      />

      {/* Subtle crowd silhouettes (dancing rectangles) */}
      {Array.from({length: 18}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${15 + (i % 6) * 12}%`,
            bottom: `${8 + Math.floor(i / 6) * 18}%`,
            width: '38px',
            height: `${60 + Math.sin(timeInSeconds * 3 + i) * 25}px`,
            background: `rgba(255,${80 + i * 8},40,${0.6 + beat * 0.4})`,
            transform: `scaleY(${0.8 + beat * 0.6})`,
            borderRadius: '4px 4px 0 0',
            transition: 'all 0.08s linear',
          }}
        />
      ))}

      {/* Fire / Pyrotechnics layer */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 65%, rgba(255, 90, 0, ${fireIntensity * 0.9}) 10%, transparent 60%)`,
          filter: `blur(${3 + beat * 2}px)`,
          opacity: 0.85 * intensity,
        }}
      />

      {/* Main title - massive impact on drops */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isDrop1 || isDrop2 || isClimax ? '180px' : '120px',
          fontWeight: '900',
          letterSpacing: '-0.05em',
          color: '#fff',
          textShadow: `
            0 0 40px #ff2200,
            0 0 80px #ff2200,
            0 0 140px #ff8800,
            6px 6px 0 #000,
            -6px -6px 0 #000
          `,
          transform: `scale(${1 + (isDrop1 || isDrop2 ? beat * 0.25 : 0)})`,
          opacity: isIntro || isOutro ? 0.6 : 1,
          transition: 'all 0.1s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        FLOORBURNER
      </AbsoluteFill>

      {/* Laser beams - reactive */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, 
            transparent 30%, 
            rgba(0, 255, 255, ${0.15 * beat * intensity}) 48%, 
            transparent 50%,
            rgba(255, 100, 0, ${0.25 * beat * intensity}) 52%,
            transparent 70%)`,
          transform: `rotate(${Math.sin(timeInSeconds * 2) * 8}deg)`,
        }}
      />

      {/* BPM / Energy meter */}
      <div
        style={{
          position: 'absolute',
          top: '60px',
          right: '60px',
          color: '#0ff',
          fontFamily: 'monospace',
          fontSize: '22px',
          textAlign: 'right',
          textShadow: '0 0 20px #0ff',
          opacity: 0.8,
        }}
      >
        130 BPM<br />
        <span style={{fontSize: '42px', color: intensity > 0.8 ? '#ff2200' : '#0ff'}}>
          {isDrop1 || isDrop2 || isClimax ? 'MAXIMUM' : 'ENERGY'}
        </span>
      </div>

      {/* DJ Booth label */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '28px',
          letterSpacing: '6px',
          fontWeight: 700,
          textTransform: 'uppercase',
          border: '2px solid rgba(0,255,255,0.4)',
          padding: '8px 42px',
          borderRadius: '2px',
          background: 'rgba(0,0,0,0.6)',
        }}
      >
        LIVE • MAIN STAGE
      </div>

      {/* Frame counter / time for debugging */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '30px',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '15px',
          fontFamily: 'monospace',
        }}
      >
        {timeInSeconds.toFixed(1)}s • FLOORBURNER
      </div>
    </AbsoluteFill>
  );
};
