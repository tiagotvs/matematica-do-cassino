import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

// Mock data for "Memory" (Emotional peaks)
const memoryData = [
  { step: 1, joy: 10 }, { step: 2, joy: 20 }, { step: 3, joy: 15 },
  { step: 4, joy: 80 }, // BIG WIN
  { step: 5, joy: 30 }, { step: 6, joy: 20 }, 
  { step: 7, joy: 90 }, // ANOTHER WIN
  { step: 8, joy: 40 }, { step: 9, joy: 10 }, { step: 10, joy: 5 },
];

// Mock data for "Reality" (Wallet draining)
const walletData = [
  { step: 1, money: 1000 }, { step: 2, money: 980 }, { step: 3, money: 960 },
  { step: 4, money: 1050 }, // Small spike
  { step: 5, money: 1020 }, { step: 6, money: 990 }, 
  { step: 7, money: 1100 }, // Spike
  { step: 8, money: 1060 }, { step: 9, money: 1000 }, { step: 10, money: 920 },
  { step: 11, money: 880 }, { step: 12, money: 840 }, { step: 13, money: 800 },
  { step: 14, money: 750 }, { step: 15, money: 700 },
];

const Act4_RealityGap: React.FC = () => {
  return (
    <section className="min-h-screen py-20 px-4 bg-slate-900 border-t border-slate-800 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-16 space-y-4">
             <div className="inline-block">
                <span className="bg-rose-900/30 text-rose-500 border border-rose-500/20 px-4 py-1 rounded-full text-sm font-semibold tracking-widest uppercase">
                    Ato IV: O Abismo
                </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">
                Memória vs. Matemática
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Seu cérebro foi evolutivamente projetado para lembrar das vitórias e descartar as perdas. O caixa do cassino, entretanto, lembra de cada centavo.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            {/* Memory Chart */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                <h3 className="text-xl font-bold text-amber-400 mb-2">O Que Você Sente</h3>
                <p className="text-sm text-slate-500 mb-6 h-10">Picos de dopamina. Você se lembra vividamente das duas vezes que ganhou, ignorando o tempo gasto perdendo.</p>
                {/* Fixed height container */}
                <div className="w-full h-[300px] min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={memoryData}>
                            <defs>
                                <linearGradient id="colorJoy" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis hide />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff'}} />
                            <Area type="monotone" dataKey="joy" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorJoy)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Wallet Chart */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                <h3 className="text-xl font-bold text-rose-500 mb-2">Sua Carteira (Realidade)</h3>
                <p className="text-sm text-slate-500 mb-6 h-10">Apesar dos pequenos picos, a tendência matemática (Vantagem da Casa) exerce uma força constante para baixo.</p>
                {/* Fixed height container */}
                <div className="w-full h-[300px] min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={walletData}>
                            <defs>
                                <linearGradient id="colorMoney" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis hide />
                            <YAxis hide domain={[0, 1200]} />
                            <Tooltip contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff'}} />
                            <Area type="monotone" dataKey="money" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorMoney)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Act4_RealityGap;