import React from 'react';

const Act3_HouseEdge: React.FC = () => {
  return (
    <section className="min-h-screen py-20 px-4 bg-slate-950 flex flex-col justify-center items-center relative">
       {/* Background graphic */}
       <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden">
          <div className="w-[800px] h-[800px] border-[40px] border-emerald-900 rounded-full flex items-center justify-center">
            <div className="w-[600px] h-[600px] border-[40px] border-emerald-900 rounded-full"></div>
          </div>
       </div>

      <div className="max-w-4xl mx-auto text-center space-y-10 z-10">
        <div className="inline-block">
          <span className="bg-emerald-900/30 text-emerald-500 border border-emerald-500/20 px-4 py-1 rounded-full text-sm font-semibold tracking-widest uppercase">
            Ato III: A Vantagem da Casa
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white">
          O Cassino não precisa de <span className="text-emerald-500">Sorte</span>.
        </h2>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Eles têm o <span className="text-emerald-400 font-bold">House Edge</span>.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-12 text-left">
           <div className="bg-slate-900/80 p-8 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-4">O Imposto Invisível</h3>
              <p className="text-slate-400 leading-relaxed">
                Imagine que você aposta R$ 10. Matematicamente, o cassino já ganhou alguns centavos no momento em que a ficha toca a mesa. Não importa se você ganha essa rodada específica.
              </p>
           </div>
           
           <div className="bg-slate-900/80 p-8 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <span className="text-9xl font-serif font-bold text-emerald-500">0</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">O Zero Verde</h3>
              <p className="text-slate-400 leading-relaxed">
                Na roleta, o zero (e o duplo zero) inclina a balança. Ele transforma uma aposta de "50/50" (Vermelho/Preto) em <span className="text-rose-400 font-bold">47.4%</span> de chance para você. Essa pequena diferença é o suficiente para construir impérios.
              </p>
           </div>
        </div>

        <p className="text-lg text-slate-300 font-semibold pt-8">
          Eles não querem que você perca tudo hoje. Eles querem que você jogue <span className="italic text-emerald-400">para sempre</span>.
        </p>
      </div>
    </section>
  );
};

export default Act3_HouseEdge;