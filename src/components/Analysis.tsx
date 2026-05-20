import React from 'react';
import { AlertCircle, HelpCircle, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Analysis({ isPrintView = false }: { isPrintView?: boolean }) {
  const sections = [
    {
      title: "代課規定",
      subtitle: "SUBSTITUTE TEACHING POLICIES",
      rules: [
        { 
          desc: "請假應自行覓妥代課教師", 
          status: "illegal", 
          basis: "安排代課是雇主行政責任，不得轉嫁給請假勞工（勞基法 §43）",
          action: "可拒絕自行找代課，書面告知辦公室安排屬其職責"
        },
        { 
          desc: "代課費自行負擔並與代課老師核算", 
          status: "illegal", 
          basis: "代課費屬薪資支出，應由雇主承擔，不得要求勞工自付",
          action: "拒絕自付代課費，要求中心支付"
        },
        { 
          desc: "代課教師須為本中心在職及退休教師", 
          status: "legal", 
          basis: "屬合理的教學品質管控",
          action: "遵守即可"
        }
      ]
    },
    {
      title: "調課規定",
      subtitle: "RESCHEDULING GUIDELINES",
      rules: [
        { 
          desc: "調課須全班學生簽名同意，提前 5 個工作天申請", 
          status: "legal", 
          basis: "屬合理行政程序，保障學生權益",
          action: "遵守即可"
        },
        { 
          desc: "調課限在中心樓層及上班時間內", 
          status: "grey", 
          basis: "地點限制屬管理措施，但若因此阻礙法定假別行使，可能有侵權疑慮",
          action: "若因限制無法調課，應直接申請請假，不應喪失權益"
        }
      ]
    },
    {
      title: "補課規定",
      subtitle: "COMPENSATORY CLASS POLICIES",
      rules: [
        { 
          desc: "中心無法安排代課時，請假教師應安排補課", 
          status: "illegal", 
          basis: "雇主無法安排代課是雇主責任，不得因此要求員工假後補課，法定假別不附帶補課義務",
          action: "法定假別不應補課，可書面說明「本人不負補課義務」"
        }
      ]
    },
    {
      title: "請假規定",
      subtitle: "LEAVE POLICIES",
      rules: [
        { 
          desc: "請假與調課應於請假日前五個工作天填寫「教師請假/調課/補課申請表」", 
          status: "grey", 
          basis: "《勞工請假規則》第10條：「勞工請假時，應於事前敘明請假理由及日數。但遇有急病或緊急事故，得委託他人代辦請假手續。」",
          action: "若遇特殊事件仍可先請假，事後再補單。"
        },
        { 
          desc: "請假五天（含）以上，至遲應於每學季開課前一週提出，不得於學季中請假。", 
          status: "illegal", 
          basis: "《勞基法》第38條第2項（特休排定權在勞工）。《性別平等工作法》第15條（產假）： 產假為法定強制給付的假別，依分娩事實發生。",
          action: "依法請假"
        },
        { 
          desc: "每學季請假總天數以七天為上限。", 
          status: "illegal", 
          basis: "法定的請假天數是以「年度」來計算",
          action: "放心請假"
        }
      ]
    }
  ];

  return (
    <div className="space-y-16">
      <header className="mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-black mb-4 tracking-tight">規定分析</h1>
        <p className="text-sm font-bold text-ink/60 uppercase">中心現行規定與勞基法之適法性分析</p>
      </header>

      <div
        className="bg-[#BDA589] text-paper p-8 mb-16 flex gap-6 items-start relative overflow-hidden rounded-xl print:bg-black print:text-white"
        style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
      >
        <AlertCircle size={24} className="shrink-0 mt-1" />
        <div className="space-y-2 relative z-10">
          <p className="text-sm md:text-xl leading-relaxed font-bold">
            「請假須自行找代課」是中心最常見的違法問題。
          </p>
          <p className="text-lg font-bold opacity-60 mt-2 print:opacity-80">
            法定假別由勞基法保障，不附帶自行尋找代課之義務。
          </p>
        </div>
      </div>


      <div className="space-y-24 print:space-y-12">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-8 print:space-y-6">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-ink/10 pb-4 print:border-b-2 print:border-black/20">
              <h2 className="font-serif text-3xl font-black print:text-black">{section.title}</h2>
            </div>
            
            <div className={cn("grid gap-12", isPrintView && "gap-8")}>
              {section.rules.map((rule, ruleIdx) => (
                <div key={ruleIdx} className={cn(
                  "grid grid-cols-1 md:grid-cols-12 gap-6 group",
                  isPrintView && "print-break-inside-avoid print:block print-border-b print:pb-8 last:border-0"
                )}>
                  <div className={cn("md:col-span-4 space-y-3", isPrintView && "print:mb-4")}>
                    <div className={cn(
                      "text-xs font-bold px-2 py-0.5 inline-block",
                      rule.status === 'illegal' ? "bg-[#c0392b] text-white print:bg-red-700" :
                      rule.status === 'grey' ? "bg-ink/5 text-ink border border-ink/20 print:bg-gray-100 print:text-black" :
                      "bg-ink text-paper print:bg-black print:text-white"
                    )} style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                      {rule.status === 'illegal' ? '違法' : rule.status === 'grey' ? '灰色地帶' : '合法'}
                    </div>
                    <h4 className={cn("text-lg font-bold leading-tight", isPrintView && "print:text-black")}>{rule.desc}</h4>
                  </div>
                  
                  <div className={cn(
                    "md:col-span-8 space-y-4 md:border-l md:border-ink/5 md:pl-12",
                    isPrintView && "print:border-l-2 print:border-black/10 print:pl-6"
                  )}>
                    <div className={cn("text-sm leading-relaxed text-ink/80 font-medium", isPrintView && "print:text-black")}>
                      <span className={cn("text-xs font-bold block mb-2 opacity-60", isPrintView && "print:text-black/50 uppercase tracking-wider")}>依據</span>
                      {rule.basis}
                    </div>
                    <div className={cn(
                      "p-4 bg-paper border border-ink/5 rounded-xl text-sm font-medium text-ink",
                      isPrintView && "print:bg-gray-50 print-border print:text-black"
                    )} style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                      <span className={cn("text-xs font-bold block mb-2 opacity-60", isPrintView && "print:text-black/50 uppercase tracking-wider")}>建議作法</span>
                      {rule.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-paper border border-ink/10 border-t-4 border-t-ink rounded-xl p-8 md:p-12 mt-24">
        <div className="flex gap-2 items-center mb-6">
          <HelpCircle size={18} className="opacity-40" />
          <h4 className="text-sm font-bold">補充說明</h4>
        </div>
        <p className="text-sm leading-relaxed text-ink/70 max-w-2xl">
          若調課或補課導致教師當日實際工時超過 8 小時，超出部分依法應視為延長工時（加班），中心須依勞基法 §24 給付加班費。中心不得以「補課」名義要求教師無償超時工作。
        </p>
      </div>
    </div>
  );
}
