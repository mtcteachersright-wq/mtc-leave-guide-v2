import React, { useState } from 'react';
import { Phone, Mail, FileText, AlertCircle, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Contact({ isPrintView = false }: { isPrintView?: boolean }) {
  const [toast, setToast] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.preventDefault();
    navigator.clipboard.writeText(text);
    setToast(`已複製 ${text}，可前往信箱寄送郵件`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto px-4 md:px-0 print:px-0 print:space-y-8">
      <header className="mb-12 print:mb-6">
        <div className="text-[10px] font-bold tracking-[0.3em] text-ink/40 mb-2 uppercase print:text-black/30">找誰協助</div>
        <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tight mb-4 print:text-black print:text-3xl">聯絡資訊</h1>
        <p className="text-sm text-ink/60 leading-relaxed font-light print:text-black">
          遇到問題時，依照性質找對應的單位。中心以外若遇到違法情況，可直接向外部管道申訴。
        </p>
      </header>

      <div className="space-y-12 print:space-y-8">
        {/* 教務組 */}
        <section className="space-y-6 print:space-y-4 break-inside-avoid">
          <h3 className="font-serif text-2xl font-bold flex items-center gap-3 print:text-black print:text-xl">
            <span>📚</span> 教務組 <span className="text-sm text-ink/40 font-sans font-medium print:text-black/40">請假、代課相關</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
            {[
              { name: "張宜君", role: "組長", ext: "5178", email: "yichunc@ntnu.edu.tw", duties: "綜理教務組業務" },
              { name: "施季昀", ext: "5170", email: "cys@ntnu.edu.tw", duties: "師資及課務安排、代課協調" },
              { name: "吳怡萱", ext: "3911", email: "yswu@ntnu.edu.tw", duties: "教師人事業務、新生報到" },
              { name: "張茜茹", ext: "5128", email: "crchang0809@ntnu.edu.tw", duties: "師資及課務安排、代課協調" }
            ].map((person, idx) => (
              <div key={idx} className="bg-white border border-ink/10 rounded-xl p-5 hover:border-blue-mid transition-colors flex flex-col justify-between print:border-black/20 print:p-4">
                <div className="mb-4">
                  <div className="font-bold text-lg text-ink flex items-end gap-2 print:text-black">
                    {person.name}
                    {person.role && <span className="text-sm font-normal text-ink/40 mb-0.5 print:text-black/40">({person.role})</span>}
                  </div>
                  <div className="text-sm text-ink/60 mt-1 print:text-black/60">{person.duties}</div>
                </div>
                <div className="space-y-2 text-sm pt-4 border-t border-ink/5 print:border-black/5">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-ink/40 print:text-black/30" />
                    <a href={`tel:+88627749${person.ext}`} className="text-blue hover:underline print:text-black font-mono">{person.ext}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-ink/40 print:text-black/30" />
                    <button onClick={(e) => handleCopy(e, person.email)} className="text-blue hover:underline break-all block text-left cursor-pointer print:text-black font-mono">{person.email}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 總務組 */}
        <section className="space-y-6 print:space-y-4 break-inside-avoid">
          <h3 className="font-serif text-2xl font-bold flex items-center gap-3 print:text-black print:text-xl">
            <span>💰</span> 總務組 <span className="text-sm text-ink/40 font-sans font-medium print:text-black/40">薪資、勞健保相關</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
            {[
              { name: "陳俊達", role: "組長", ext: "5127", email: "chenct@ntnu.edu.tw", duties: "綜理總務組業務" },
              { name: "王鴻益", ext: "5126", email: "m82007@ntnu.edu.tw", duties: "教師鐘點費造冊、勞健保轉入轉出" },
              { name: "王姿君", ext: "5159", email: "w77777@ntnu.edu.tw", duties: "各項費用報銷" }
            ].map((person, idx) => (
              <div key={idx} className="bg-white border border-ink/10 rounded-xl p-5 hover:border-blue-mid transition-colors flex flex-col justify-between print:border-black/20 print:p-4">
                <div className="mb-4">
                  <div className="font-bold text-lg text-ink flex items-end gap-2 print:text-black">
                    {person.name}
                    {person.role && <span className="text-sm font-normal text-ink/40 mb-0.5 print:text-black/40">({person.role})</span>}
                  </div>
                  <div className="text-sm text-ink/60 mt-1 print:text-black/60">{person.duties}</div>
                </div>
                <div className="space-y-2 text-sm pt-4 border-t border-ink/5 print:border-black/5">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-ink/40 print:text-black/30" />
                    <a href={`tel:+88627749${person.ext}`} className="text-blue hover:underline print:text-black font-mono">{person.ext}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-ink/40 print:text-black/30" />
                    <button onClick={(e) => handleCopy(e, person.email)} className="text-blue hover:underline break-all block text-left cursor-pointer print:text-black font-mono">{person.email}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 主任室 */}
        <section className="space-y-6">
          <h3 className="font-serif text-2xl font-bold flex items-center gap-3">
            <span>🏛️</span> 主任室
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-ink/10 rounded-xl p-5 hover:border-blue-mid transition-colors flex flex-col justify-between">
              <div className="mb-4">
                <div className="font-bold text-lg text-ink flex items-end gap-2">
                  蔡雅薰
                  <span className="text-sm font-normal text-ink/40 mb-0.5">(主任)</span>
                </div>
              </div>
              <div className="space-y-2 text-sm pt-4 border-t border-ink/5">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-ink/40" />
                  <a href="tel:+886277495131" className="text-blue hover:underline">5131</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-ink/40" />
                  <button onClick={(e) => handleCopy(e, 'mtced@deps.ntnu.edu.tw')} className="text-blue hover:underline break-all text-left cursor-pointer">mtced@deps.ntnu.edu.tw</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 外部申訴管道 */}
        <section className="space-y-6 mt-16 relative">
          <div className="absolute -top-6 left-0 w-8 h-1 bg-red" />
          <h3 className="font-serif text-2xl font-bold flex items-center gap-3">
            <AlertCircle size={24} className="text-red" />
            中心以外的管道 <span className="text-sm text-ink/40 font-sans font-medium">遇到違法情況</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="tel:1955" className="group flex items-start gap-5 p-6 bg-white border border-ink/10 rounded-xl hover:border-blue-mid hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-full bg-blue-light text-blue flex items-center justify-center shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="font-bold text-ink mb-1 group-hover:text-blue transition-colors">勞動部申訴專線</h4>
                <div className="text-2xl font-black text-blue mb-2 font-mono">1955</div>
                <p className="text-xs text-ink/60 leading-relaxed">免費、匿名，24 小時皆可撥打</p>
              </div>
            </a>

            <button onClick={(e) => handleCopy(e, 'mtc.teachers.right@gmail.com')} className="group flex items-start gap-5 p-6 bg-white border border-ink/10 rounded-xl hover:border-blue-mid hover:shadow-lg transition-all w-full text-left cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-blue-light text-blue flex items-center justify-center shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="font-bold text-ink mb-1 group-hover:text-blue transition-colors">工會（透過促進會聯繫）</h4>
                <div className="text-sm font-bold text-blue mb-2 font-mono break-all">mtc.teachers.right@gmail.com</div>
                <p className="text-xs text-ink/60 leading-relaxed">遇到違法或申訴問題，工會協助你走流程</p>
              </div>
            </button>

            <a href="https://docs.google.com/forms/d/e/1FAIpQLScL59KWWcq6plFaqT2ONcKOCjyK26DibNvUKTtypapl522gMg/viewform" target="_blank" rel="noopener noreferrer" className="md:col-span-2 group flex items-start gap-5 p-6 bg-white border border-ink/10 rounded-xl hover:border-blue-mid hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-full bg-blue-light text-blue flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="font-bold text-ink mb-1 group-hover:text-blue transition-colors">師大國語中辛勞促會－勞權事件匿名回報</h4>
                <div className="text-sm font-bold text-blue mb-2">Google 表單（可匿名）</div>
                <p className="text-xs text-ink/60 leading-relaxed">遇到違法對待、想反映狀況，可在此匿名填寫，我們定期統整跟進</p>
              </div>
            </a>
          </div>
        </section>

        {/* 中心辦公室聯絡資訊 */}
        <section className="bg-paper-darker rounded-xl p-8 border border-ink/5 relative overflow-hidden">
          <Building2 size={120} className="absolute -bottom-8 -right-8 text-white/40" />
          <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
            <Building2 size={20} className="text-ink/60" /> 中心辦公室聯絡資訊
          </h3>
          <div className="space-y-4 text-sm relative z-10">
            <div className="flex gap-4">
              <div className="w-20 text-ink/50 font-medium shrink-0">地址</div>
              <div className="text-ink">106 台北市和平東路 1 段 129 號博愛樓 7 樓</div>
            </div>
            <div className="flex gap-4">
              <div className="w-20 text-ink/50 font-medium shrink-0">辦公時間</div>
              <div className="text-ink">週一至週五 08:30–12:30 / 13:30–17:00</div>
            </div>
            <div className="flex gap-4">
              <div className="w-20 text-ink/50 font-medium shrink-0">總電話</div>
              <div><a href="tel:+886277495130" className="text-blue hover:underline">02-7749-5130</a></div>
            </div>
            <div className="flex gap-4">
              <div className="w-20 text-ink/50 font-medium shrink-0">傳真</div>
              <div className="text-ink">02-2341-8431</div>
            </div>
            <div className="flex gap-4">
              <div className="w-20 text-ink/50 font-medium shrink-0">Email</div>
              <div><button onClick={(e) => handleCopy(e, 'mtc@mtc.ntnu.edu.tw')} className="text-blue hover:underline cursor-pointer">mtc@mtc.ntnu.edu.tw</button></div>
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-12 left-1/2 z-[2000] px-8 py-3 rounded-xl text-white text-[10px] uppercase tracking-widest font-black shadow-2xl pointer-events-none bg-ink"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
