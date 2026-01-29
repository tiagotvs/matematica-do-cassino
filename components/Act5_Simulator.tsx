import React, { useEffect, useRef, useState } from 'react';
import { PlayCircle, AlertTriangle, Settings2, RotateCcw } from 'lucide-react';
import { GameState } from '../types';

// Constants for time
const SIMULATION_DURATION_SECONDS = 10;
const FPS = 60;
const ROUNDS_PER_SECOND = 1000;

const Act5_Simulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Simulation Settings
  const [playerCount, setPlayerCount] = useState(100);
  const [initialBalance, setInitialBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [winChance, setWinChance] = useState(48.6);

  // Runtime State
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [rounds, setRounds] = useState(0);
  const [survivors, setSurvivors] = useState(100);
  
  // Refs for animation loop
  const playersRef = useRef<number[]>([]);
  const animationFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const prevProgressRef = useRef<number>(0);

  // Calculate House Profit for display
  const totalInitialMoney = playerCount * initialBalance;
  // Sum current money (floored at 0 to avoid counting negative debt if logic allowed it, though break prevents it)
  const currentTotalMoney = playersRef.current.reduce((acc, curr) => acc + Math.max(0, curr), 0);
  const houseProfit = totalInitialMoney - currentTotalMoney;

  // Helper to get High DPI scaled dimensions
  const getRenderDimensions = () => {
    if (!containerRef.current) return { width: 0, height: 0, dpr: 1 };
    const rect = containerRef.current.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    return {
        width: rect.width * dpr,
        height: rect.height * dpr,
        dpr
    };
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, dpr: number) => {
    // Clear whole canvas
    ctx.clearRect(0, 0, width, height);
    
    // Grid Lines Style
    ctx.lineWidth = 1 * dpr;
    ctx.strokeStyle = '#1e293b'; // slate-800
    
    // Initial Balance Line (Relative to max scale)
    // Assume max visible graph is double initial balance
    const maxScale = initialBalance * 2 || 2000;
    const yStart = height - (initialBalance / maxScale) * height; 
    
    ctx.beginPath();
    ctx.moveTo(0, yStart);
    ctx.lineTo(width, yStart);
    ctx.strokeStyle = '#334155'; // slate-700
    ctx.setLineDash([5 * dpr, 5 * dpr]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Text Labels
    ctx.font = `${12 * dpr}px monospace`;
    ctx.fillStyle = '#64748b';
    ctx.fillText(`R$ ${initialBalance} (Início)`, 10 * dpr, yStart - 10 * dpr);
    ctx.fillText('R$ 0 (Falência)', 10 * dpr, height - 10 * dpr);
  };

  const resizeCanvas = () => {
     const canvas = canvasRef.current;
     if (canvas && containerRef.current) {
         const { width, height, dpr } = getRenderDimensions();
         // Set actual internal resolution
         canvas.width = width;
         canvas.height = height;
         // Clean context
         const ctx = canvas.getContext('2d');
         if (ctx) drawGrid(ctx, width, height, dpr);
     }
  };

  const resetSimulation = () => {
    setRounds(0);
    setSurvivors(playerCount);
    setGameState(GameState.IDLE);
    playersRef.current = new Array(playerCount).fill(initialBalance);
    resizeCanvas();
  };

  const runSimulation = (timestamp: number) => {
    if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
        prevProgressRef.current = 0;
    }
    
    // Calculate 0.0 to 1.0 progress based on time
    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / (SIMULATION_DURATION_SECONDS * 1000), 1);
    
    // Safety break
    if (progress >= 1 && prevProgressRef.current >= 1) {
      setGameState(GameState.FINISHED);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions
    const width = canvas.width;
    const height = canvas.height;
    const dpr = window.devicePixelRatio || 1;

    // Logic: Simulate enough rounds to match the time step
    const roundsThisFrame = Math.floor(ROUNDS_PER_SECOND / FPS);
    const maxScale = initialBalance * 2 || 2000;
    
    let currentAlive = 0;

    // Drawing settings
    ctx.lineWidth = 1 * dpr;
    // Dynamic opacity based on player count to manage clutter
    ctx.globalAlpha = playerCount > 200 ? 0.3 : 0.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const startX = prevProgressRef.current * width;
    const endX = progress * width;

    // If progress hasn't moved enough to draw a pixel, skip drawing but update logic?
    // Actually, we want to update logic anyway.

    for (let p = 0; p < playerCount; p++) {
      let balance = playersRef.current[p];
      
      if (balance <= 0) continue; // Player is bust

      currentAlive++;
      
      const startY = height - (Math.max(0, Math.min(maxScale, balance)) / maxScale) * height;

      ctx.beginPath();
      ctx.moveTo(startX, startY);

      // Simulate the batch
      for (let r = 0; r < roundsThisFrame; r++) {
         if (balance <= 0) {
            balance = 0;
            break;
         }
         // Win Chance calculation
         if (Math.random() < (winChance / 100)) {
            balance += betAmount;
         } else {
            balance -= betAmount;
         }
      }
      
      // Update state
      playersRef.current[p] = balance;

      const endY = height - (Math.max(0, Math.min(maxScale, balance)) / maxScale) * height;
      
      ctx.lineTo(endX, endY);
      
      // Color coding
      if (balance > initialBalance) ctx.strokeStyle = '#10b981'; // Green
      else if (balance < initialBalance) ctx.strokeStyle = '#f43f5e'; // Red
      else ctx.strokeStyle = '#fbbf24'; // Yellow
      
      ctx.stroke();
    }

    setRounds(r => r + roundsThisFrame);
    setSurvivors(currentAlive);
    prevProgressRef.current = progress;

    if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(runSimulation);
    } else {
        setGameState(GameState.FINISHED);
    }
  };

  const start = () => {
    // Force resize one last time before starting to ensure accuracy
    resizeCanvas();
    
    // Initialize
    playersRef.current = new Array(playerCount).fill(initialBalance);
    setSurvivors(playerCount);
    setRounds(0);
    prevProgressRef.current = 0;

    setGameState(GameState.RUNNING);
    startTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(runSimulation);
  };

  // Handle Resize
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeCanvas, 100);
    };
    
    window.addEventListener('resize', handleResize);
    // Initial draw
    setTimeout(resizeCanvas, 50);

    return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimer);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [initialBalance, playerCount]);

  return (
    <section className="min-h-screen py-20 px-4 bg-slate-950 border-t border-slate-800 flex flex-col items-center">
      <div className="max-w-6xl w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
           <div className="inline-block">
              <span className="bg-purple-900/30 text-purple-400 border border-purple-500/20 px-4 py-1 rounded-full text-sm font-semibold tracking-widest uppercase">
                  Ato V: O Ultimato
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white">
              A Máquina da Verdade
            </h2>
            <p className="text-xl text-slate-400">
               Teste sua própria estratégia. Veja a LGN devorar sua banca em segundos.
            </p>
        </div>

        {/* Simulator Container */}
        <div className="relative w-full bg-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden shadow-2xl">
            
            {/* Stats Overlay (Visible during run/finish) */}
            <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur p-4 rounded border border-slate-700 text-sm font-mono space-y-1 pointer-events-none">
                <div className="flex justify-between w-48">
                    <span className="text-slate-400">Jogadores:</span>
                    <span className="text-white font-bold">{survivors} / {playerCount}</span>
                </div>
                <div className="flex justify-between w-48">
                    <span className="text-slate-400">Rodadas:</span>
                    <span className="text-cyan-400 font-bold">{rounds.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-48">
                   <span className="text-slate-400">Tempo Simulado:</span>
                   <span className="text-white">{(rounds / ROUNDS_PER_SECOND / 24).toFixed(1)} dias</span>
                </div>
            </div>

            {/* Canvas */}
            <div ref={containerRef} className="h-[600px] w-full bg-slate-900 relative">
                 <canvas ref={canvasRef} className="block w-full h-full" />
                 
                 {/* SETUP & IDLE SCREEN */}
                 {gameState === GameState.IDLE && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm z-20 p-4 animate-fade-in overflow-y-auto">
                         
                         <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-2xl w-full my-auto">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                                <Settings2 className="text-purple-500" />
                                <h3 className="text-xl font-bold text-white">Configurar Cenário</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400 block">Jogadores Simultâneos</label>
                                    <input 
                                        type="number" 
                                        value={playerCount}
                                        onChange={(e) => setPlayerCount(Math.min(500, Math.max(1, Number(e.target.value))))}
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none transition-colors"
                                    />
                                    <p className="text-xs text-slate-600">Máx: 500</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400 block">Banca Inicial (R$)</label>
                                    <input 
                                        type="number" 
                                        value={initialBalance}
                                        onChange={(e) => setInitialBalance(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400 block">Valor da Aposta (R$)</label>
                                    <input 
                                        type="number" 
                                        value={betAmount}
                                        onChange={(e) => setBetAmount(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400 block">Chance de Vitória (%)</label>
                                    <input 
                                        type="number" 
                                        value={winChance}
                                        onChange={(e) => setWinChance(Number(e.target.value))}
                                        step="0.1"
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none transition-colors"
                                    />
                                    <p className="text-xs text-slate-600">
                                        Roleta: 48.6% | Cara/Coroa: 50%
                                    </p>
                                </div>
                            </div>

                            <button 
                                onClick={start}
                                className="w-full group relative px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xl rounded-lg shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all transform hover:scale-[1.01]"
                            >
                                <span className="flex items-center justify-center gap-3">
                                    <PlayCircle className="w-6 h-6" />
                                    RODAR SIMULAÇÃO
                                </span>
                            </button>
                         </div>
                     </div>
                 )}

                 {/* FINISHED SCREEN */}
                 {gameState === GameState.FINISHED && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md z-30 animate-fade-in">
                         <div className="text-center space-y-6 max-w-lg px-4 bg-slate-900/90 p-8 rounded-xl border border-slate-700">
                             <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                             <h3 className="text-3xl font-bold text-white">Resultado Final</h3>
                             <p className="text-lg text-slate-300">
                                 De {playerCount} apostadores, <strong>{survivors}</strong> terminaram com dinheiro.
                             </p>
                             <div className="grid grid-cols-2 gap-4 text-sm bg-slate-950 p-4 rounded-lg">
                                <div>
                                    <span className="block text-slate-500">Taxa de Quebra</span>
                                    <span className="text-rose-500 font-bold text-xl">{((1 - survivors/playerCount)*100).toFixed(1)}%</span>
                                </div>
                                <div>
                                    <span className="block text-slate-500">Rodadas Totais</span>
                                    <span className="text-slate-200 font-bold text-xl">{rounds.toLocaleString()}</span>
                                </div>
                                <div className="col-span-2 border-t border-slate-800 pt-4 mt-2">
                                    <span className="block text-slate-400 uppercase tracking-wider text-xs mb-1">Lucro da Banca</span>
                                    <span className={`font-serif font-bold text-4xl ${houseProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        R$ {houseProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                             </div>
                             <p className="text-slate-400 italic border-l-2 border-rose-600 pl-4 text-left text-sm">
                                 "Quanto mais você joga, mais a matemática se impõe. O curto prazo é sorte. O longo prazo é uma sentença."
                             </p>
                             <button 
                                onClick={resetSimulation}
                                className="mt-8 flex items-center justify-center gap-2 w-full px-6 py-3 border border-slate-600 hover:bg-slate-800 hover:border-slate-500 text-slate-200 rounded font-bold transition-all"
                             >
                                <RotateCcw size={18} />
                                Configurar Novamente
                             </button>
                         </div>
                     </div>
                 )}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Act5_Simulator;