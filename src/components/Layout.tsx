import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Calculator, MessageSquare, Info, HelpingHand, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import LeaveGuide from './LeaveGuide';
import Analysis from './Analysis';
import FAQ from './FAQ';
import Contact from './Contact';

const LEAVE_CATEGORIES = [
  {
    title: "🗓️ 常態假別",
    items: [
      { id: "例假日", label: "📅 例假日", sub: "每週 1 天" },
      { id: "休息日", label: "🗓️ 休息日", sub: "每週 1 天" },
      { id: "國定假日", label: "🎌 國定假日", sub: "15～16 天/年" },
      { id: "特別休假（特休）", label: "🌿 特別休假", sub: "3～30 天/年・全薪" },
      { id: "公假", label: "📋 公假", sub: "教召・選務等" },
      { id: "颱風假（天然災害假）", label: "🌀 颱風假", sub: "天然災害假" }
    ]
  },
  {
    title: "🏥 傷病 ＆ 生育假",
    items: [
      { id: "普通傷病假（病假）", label: "🤒 病假", sub: "30 天/年・半薪" },
      { id: "產假 ＆ 生育相關假別", label: "🤱 產假 ＆ 生育假", sub: "產假、產檢、育嬰" }
    ]
  },
  {
    title: "📝 事由假",
    items: [
      { id: "事假 ＆ 家庭照顧假", label: "📝 事假 ＆ 家庭照顧假", sub: "14 天/年・不支薪" },
      { id: "婚假", label: "💍 婚假", sub: "8 天・全薪" },
      { id: "喪假", label: "🕯️ 喪假", sub: "3～8 天・全薪" }
    ]
  }
];

const ALL_LEAVES = LEAVE_CATEGORIES.flatMap(c => c.items.map(i => i.id));

export default function Layout() {
  const [toast, setToast] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printTab, setPrintTab] = useState('tab-leaves');
  const [selectedLeaves, setSelectedLeaves] = useState<string[]>(ALL_LEAVES);

  const handlePrintClick = () => {
    setShowPrintModal(true);
  };

  const handlePrintConfirm = () => {
    setShowPrintModal(false);
    if (window.self !== window.top) {
      setToast('提醒：因預覽環境限制，若無反應，請複製本站網址至新分頁開啟即可列印');
      setTimeout(() => setToast(null), 5000);
    }
    setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        // ignore
      }
    }, 100);
  };

  const toggleLeave = (leave: string) => {
    setSelectedLeaves(prev => 
      prev.includes(leave) ? prev.filter(l => l !== leave) : [...prev, leave]
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#f7f4ef] text-ink font-sans selection:bg-ink selection:text-paper relative print:bg-white">
      {/* Header */}
      <header
        className="bg-[#0f172a] border-b border-ink/10 text-paper py-10 px-6 text-center relative overflow-hidden"
        style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
      >
        <img 
          src="/logo.png" 
          alt="華師勞權 Logo" 
          className="absolute top-4 left-4 w-12 h-12 rounded-xl border-2 border-paper/10 z-20 md:top-8 md:left-8 md:w-20 md:h-20 hidden sm:block shadow-lg"
          referrerPolicy="no-referrer"
        />
        {/* Background Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background:
              "repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.05) 60px, rgba(255,255,255,0.05) 61px)",
          }}
        />

        <div className="relative z-10">
          <div className="text-[11px] font-semibold text-red-mid tracking-[0.18em] mb-3 uppercase print:text-red-mid">
            臺師大國語中心教師勞權促進會
          </div>
          <h1 className="font-serif text-[clamp(1.5rem,5vw,2.2rem)] font-bold tracking-[0.04em] leading-snug mb-2 text-white print:!text-white">
            華語教師假別指南
          </h1>
          <div className="w-10 h-[2px] bg-red mx-auto mt-4 mb-3" />
          <p className="text-[13px] text-paper-darker max-w-[480px] mx-auto leading-relaxed print:text-paper-darker">
            法律保障 × 中心現狀 × 我們的實際權益
            <br />
            點擊各假別展開詳細說明
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#f7f4ef] border-b border-ink/10 mb-6 shadow-sm">
        <div className="flex w-full overflow-x-auto overflow-y-hidden no-scrollbar px-5 md:justify-center border-b border-ink/10" style={{ touchAction: 'pan-x' }}>
          <NavButton to="/" icon="📋" label="假別權益" />
          <NavButton to="/analysis" icon="⚖️" label="規定分析" />
          <NavButton to="/faq" icon="❓" label="常見問題" />
          <NavButton to="/contact" icon="📞" label="找誰協助" />
          <NavButton to="/discussion" icon="💬" label="交流討論區" />
        </div>
        <div className="flex w-full overflow-x-auto overflow-y-hidden no-scrollbar px-5 py-2.5 gap-3 justify-center bg-paper-dark" style={{ touchAction: 'pan-x' }}>
          <button 
            onClick={handlePrintClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-paper border border-ink/20 rounded-xl text-xs font-bold text-ink-light hover:border-ink hover:text-ink transition-all shrink-0 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            列印 / PDF
          </button>
          <a 
            href="https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0030001" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-paper border border-ink/20 rounded-xl text-xs font-bold text-ink-light hover:border-ink hover:text-ink transition-all shrink-0 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            勞基法
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl w-full mx-auto px-6 md:px-12 py-6 pb-24 relative overflow-hidden print:hidden">
        <Outlet />
      </main>

      {/* Hidden Print Wrapper */}
      <div className="hidden print:block w-full mx-auto px-0 py-0">
        {printTab === 'tab-leaves' && (
          <LeaveGuide isPrintView={true} selectedLeaves={selectedLeaves} />
        )}
        {printTab === 'tab-rules' && <Analysis isPrintView={true} />}
        {printTab === 'tab-faq' && <FAQ isPrintView={true} />}
        {printTab === 'tab-contact' && <Contact isPrintView={true} />}
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-12 px-6 text-xs text-ink/40 border-t border-ink/10 flex flex-col items-center justify-center gap-4">
        <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-ink/40">
          Built with Precision for MTC Educators.
        </div>
        <div className="text-center space-y-1">
          <div className="text-[11px] text-ink/60 leading-relaxed max-w-xs mx-auto">
            本手冊由促進會成員依現行法規整理研發，不構成法律意見。
          </div>
          <a href="tel:1955" className="inline-block text-xs font-bold tracking-tighter border-b border-ink hover:text-red hover:border-red transition-colors cursor-pointer">
            諮詢專線 — 1955
          </a>
        </div>
      </footer>

      <AnimatePresence>
        {showPrintModal && (
          <div className="fixed inset-0 bg-ink/60 z-[3000] flex items-center justify-center p-4 print:hidden">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              className="bg-white rounded-2xl w-full max-w-[540px] max-h-[90vh] overflow-y-auto shadow-[0_24px_60px_rgba(26,22,18,0.25)] flex flex-col"
            >
              <div className="p-5 border-b border-ink/10 flex items-center justify-between bg-ink rounded-t-2xl text-paper">
                <div className="font-serif text-base font-bold flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                  選擇列印內容
                </div>
                <button 
                  onClick={() => setShowPrintModal(false)}
                  className="p-1 text-paper/60 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-[13px] text-ink/60 mb-5 leading-relaxed">
                  請先選擇要列印的頁籤，再選擇假別（僅「假別權益」頁籤支援假別篩選）。
                </p>

                <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-ink/60 mb-3">
                  📄 列印哪個頁籤？
                </div>
                <div className="flex flex-wrap gap-3 mb-6">
                  {[
                    { id: 'tab-leaves', label: '📋 假別權益' },
                    { id: 'tab-rules', label: '⚖️ 請假規定分析' },
                    { id: 'tab-faq', label: '❓ 常見問題' },
                    { id: 'tab-contact', label: '📞 找誰協助' }
                  ].map(tab => (
                    <label key={tab.id} className="flex items-center gap-1.5 cursor-pointer text-[13px] font-medium text-ink">
                      <input 
                        type="radio" 
                        name="print-tab" 
                        checked={printTab === tab.id}
                        onChange={() => setPrintTab(tab.id)}
                        className="w-4 h-4 accent-[#1e293b]"
                      />
                      {tab.label}
                    </label>
                  ))}
                </div>

                {printTab === 'tab-leaves' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-ink/60">
                        🗓️ 篩選假別
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedLeaves(ALL_LEAVES)} className="text-[12px] text-blue hover:text-ink underline">全選</button>
                        <span className="text-ink/20">|</span>
                        <button onClick={() => setSelectedLeaves([])} className="text-[12px] text-blue hover:text-ink underline">全部取消</button>
                      </div>
                    </div>

                    {LEAVE_CATEGORIES.map(category => (
                      <div key={category.title} className="mb-4">
                        <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-ink/60 mb-2">
                          {category.title}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {category.items.map(item => (
                            <label 
                              key={item.id} 
                              className="flex items-center gap-2.5 p-2.5 border border-ink/10 rounded-xl cursor-pointer hover:border-blue-mid hover:bg-blue-light/30 transition-all select-none"
                            >
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 accent-[#1e293b] shrink-0" 
                                checked={selectedLeaves.includes(item.id)}
                                onChange={() => toggleLeave(item.id)}
                              />
                              <div>
                                <div className="text-[13px] font-medium text-ink leading-tight">{item.label}</div>
                                <div className="text-[11px] text-ink/60 mt-[1px]">{item.sub}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              <div className="p-5 border-t border-ink/10 bg-paper-dark rounded-b-2xl flex flex-wrap sm:flex-nowrap gap-3">
                <button 
                  onClick={handlePrintConfirm}
                  className="flex-1 py-3 px-4 bg-ink text-paper border-none rounded-xl text-sm font-medium hover:bg-ink-light transition-all flex items-center justify-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                  列印 / 匯出 PDF
                </button>
                <button 
                  onClick={() => setShowPrintModal(false)}
                  className="flex-1 py-3 px-4 bg-transparent text-ink/60 border border-ink/10 rounded-xl text-sm font-medium hover:text-ink hover:border-ink/30 transition-all"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-12 left-1/2 z-[2000] px-8 py-3 rounded-xl text-white text-[11px] tracking-wider font-bold shadow-2xl pointer-events-none bg-ink text-center whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "px-5 py-3 font-sans text-sm font-medium border-b-2 -mb-[1px] transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 cursor-pointer touch-manipulation",
          isActive
            ? "border-red text-ink"
            : "border-transparent text-ink-muted hover:text-ink"
        )
      }
    >
      <span>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}
