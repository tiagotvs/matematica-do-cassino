import React from 'react';
import { ArrowDown } from 'lucide-react';

const Act1_Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-slate-950">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900 via-slate-950 to-slate-950"></div>
      
      <div className="z-10 text-center px-4 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        <div className="mb-6 inline-block">
          <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-4 py-1 rounded-full text-sm font-semibold tracking-widest uppercase">
            Ato I: A Miragem
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight text-white mb-6">
          Eles vendem a <span className="text-amber-400 neon-text italic">exceção</span>. <br/>
          Você paga pela <span className="text-rose-500 neon-danger">regra</span>.
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A emoção da vitória a curto prazo é real. Mas ela é apenas o isco para algo muito maior, matemático e invisível.
        </p>

        <div className="pt-12">
          <p className="text-sm text-slate-500 mb-4 uppercase tracking-widest">Descubra a verdade</p>
          <div className="animate-bounce">
            <ArrowDown className="w-8 h-8 text-amber-500 mx-auto" />
          </div>
        </div>
      </div>

      {/* Decorative "Chips" or lights blurred in foreground */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
    </section>
  );
};

export default Act1_Hero;