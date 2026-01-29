import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Play, RotateCcw } from 'lucide-react';

const Act2_Revelation: React.FC = () => {
  const [flips, setFlips] = useState(0);
  const [heads, setHeads] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const animationRef = useRef<number | null>(null);

  const tails = flips - heads;
  const headsPercentage = flips > 0 ? (heads / flips) * 100 : 0;
  const tailsPercentage = flips > 0 ? (tails / flips) * 100 : 0;

  const data = [
    { name: 'Cara', value: headsPercentage, count: heads },
    { name: 'Coroa', value: tailsPercentage, count: tails },
  ];

  const runSimulation = () => {
    // Speed up as we go
    const flipsPerFrame = flips < 100 ? 1 : flips < 1000 ? 10 : 100;
    
    let newHeads = 0;
    for(let i=0; i<flipsPerFrame; i++) {
        if(Math.random() < 0.5) newHeads++;
    }

    setHeads(h => h + newHeads);
    setFlips(f => f + flipsPerFrame);

    if (flips < 100000) {
      animationRef.current = requestAnimationFrame(runSimulation);
    } else {
      setIsRunning(false);
    }
  };

  const startSimulation = () => {
    if (!isRunning) {
      setIsRunning(true);
      if (flips >= 100000) {
          // Reset if we finished before
          setFlips(0);
          setHeads(0);
      }
      runSimulation();
    }
  };

  const stopSimulation = () => {
    setIsRunning(false);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const reset = () => {
    stopSimulation();
    setFlips(0);
    setHeads(0);
  };

  useEffect(() => {
      return () => stopSimulation();
  }, [flips]); // Cleanup on unmount

  return (
    <section className="min-h-screen py-20 px-4 bg-slate-900 border-t border-slate-800 flex flex-col justify-center">
      <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        
        {/* Narrative */}
        <div className="space-y-6">
          <div className="inline-block">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-1 rounded-full text-sm font-semibold tracking-widest uppercase">
              Ato II: A Revelação
            </span>
          </div>
          <h2 className="text-4xl font-serif font-bold text-slate-100">
            A Lei dos Grandes Números
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Se você jogar uma moeda 10 vezes, pode obter 7 caras. Isso é <strong className="text-white">sorte</strong> (curto prazo).
          </p>
          <p className="text-lg text-slate-400 leading-relaxed">
            Se jogar 1.000.000 de vezes, o resultado será brutalmente próximo de 50/50. Isso é <strong className="text-white">estatística</strong> (longo prazo).
          </p>
          <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-cyan-500">
            <p className="italic text-slate-300">
              "A Lei dos Grandes Números é a gravidade do mundo das apostas. No curto prazo, você pode pular e desafiá-la. No longo prazo, ela sempre te puxa para baixo."
            </p>
          </div>
        </div>

        {/* Blueprint/Interactive */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-2xl">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Total de Jogadas</p>
                    <p className="text-3xl font-mono text-cyan-400">{flips.toLocaleString()}</p>
                </div>
                <div className="space-x-2">
                    <button 
                        onClick={startSimulation}
                        disabled={isRunning}
                        className={`px-4 py-2 rounded font-bold text-sm transition-colors flex items-center gap-2 ${isRunning ? 'bg-slate-700 text-slate-500' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}`}
                    >
                        <Play size={16} /> {flips > 0 ? 'Continuar' : 'Iniciar'}
                    </button>
                    <button 
                        onClick={reset}
                        className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            </div>

            {/* Explicit Dimensions Container */}
            <div className="w-full h-[300px] min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical">
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="name" type="category" width={50} tick={{fill: '#94a3b8'}} />
                        <Tooltip 
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                            contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9'}}
                        />
                        <ReferenceLine x={50} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: '50%', fill: '#ef4444', fontSize: 12 }} />
                        <Bar dataKey="value" barSize={30} radius={[0, 4, 4, 0]}>
                             {
                                data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#fbbf24' : '#94a3b8'} />
                                ))
                            }
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-4 text-xs font-mono text-slate-500">
                <span>Cara: {headsPercentage.toFixed(1)}%</span>
                <span>Coroa: {tailsPercentage.toFixed(1)}%</span>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Act2_Revelation;