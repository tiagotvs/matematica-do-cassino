import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import Act1_Hero from './components/Act1_Hero';
import Act2_Revelation from './components/Act2_Revelation';
import Act3_HouseEdge from './components/Act3_HouseEdge';
import Act4_RealityGap from './components/Act4_RealityGap';
import Act5_Simulator from './components/Act5_Simulator';

const App: React.FC = () => {
  return (
    <main className="bg-slate-950 text-slate-200 overflow-x-hidden selection:bg-amber-500 selection:text-black">
      <Act1_Hero />
      <Act2_Revelation />
      <Act3_HouseEdge />
      <Act4_RealityGap />
      <Act5_Simulator />

      <footer className="py-12 bg-black text-center text-slate-600 text-sm border-t border-slate-900">
        <p>A Matemática do Cassino &copy; {new Date().getFullYear()}</p>
        <p className="mt-2">Lembre-se: A casa sempre vence.</p>
      </footer>

      <Analytics />
    </main>
  );
};

export default App;