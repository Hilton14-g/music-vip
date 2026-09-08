import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext';

export const AudioVisualizer = ({ barCount = 36, height = 50, mini = false }) => {
  const { isPlaying, eqPreset } = usePlayer();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const bars = Array.from({ length: barCount }, (_, i) => ({
      height: 4,
      targetHeight: 4,
      speed: 0.15 + (i % 5) * 0.04,
      frequency: 0.05 + (i / barCount) * 0.1
    }));

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / barCount;
      const gap = mini ? 1.5 : 3;
      const actualWidth = Math.max(2, barWidth - gap);

      // Multiplicador según el preset del ecualizador
      let boost = 1;
      if (eqPreset === 'bass') boost = 1.35;
      if (eqPreset === 'club') boost = 1.5;
      if (eqPreset === 'chill') boost = 0.75;

      bars.forEach((bar, index) => {
        if (isPlaying) {
          // Simulación de respuesta en frecuencias de audio
          const wave = Math.sin(phase * bar.speed + index * 0.3);
          const wave2 = Math.cos(phase * 0.5 + index * 0.2);
          const rawHeight = (Math.abs(wave * 0.6 + wave2 * 0.4) * (canvas.height * 0.85) + 6) * boost;
          
          bar.targetHeight = Math.min(canvas.height, Math.max(4, rawHeight));
          bar.height += (bar.targetHeight - bar.height) * 0.2;
        } else {
          // Reposo cuando está en pausa
          bar.height += (3 - bar.height) * 0.1;
        }

        const x = index * barWidth + gap / 2;
        const y = canvas.height - bar.height;

        // Gradiente brillante neón
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        if (mini) {
          gradient.addColorStop(0, '#00f2fe');
          gradient.addColorStop(1, '#4facfe');
        } else {
          gradient.addColorStop(0, '#7928ca');
          gradient.addColorStop(0.5, '#00f2fe');
          gradient.addColorStop(1, '#ff007a');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, actualWidth, bar.height, [3, 3, 0, 0]);
        } else {
          ctx.rect(x, y, actualWidth, bar.height);
        }
        ctx.fill();

        // Efecto de brillo en las puntas si no es mini
        if (!mini && isPlaying && bar.height > 15) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(x + actualWidth / 2, y + 2, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (isPlaying) {
        phase += 0.08;
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, barCount, mini, eqPreset]);

  return (
    <canvas 
      ref={canvasRef} 
      width={barCount * 8} 
      height={height}
      className={`w-full ${mini ? 'h-5' : 'h-14'} transition-opacity duration-300 ${isPlaying ? 'opacity-90' : 'opacity-30'}`}
    />
  );
};
