import React, { useState } from 'react';
import { ChevronDown, Search, FileText, AlertCircle, CheckCircle2, Info, Calculator } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface Scenario {
  id: string;
  label: string;
  title: string;
  eyebrow?: string;
  content: React.ReactNode;
}

interface LeaveCardProps {
  key?: React.Key;
  title: string;
  summary: string;
  icon: string;
  tags: string[];
  days: string;
  pay: string;
  law: React.ReactNode;
  lawCite?: string;
  failIssues?: React.ReactNode;
  failCite?: string;
  actualRights: React.ReactNode;
  children?: React.ReactNode;
  scenarios?: Scenario[];
  onOpenScenario?: (scenario: Scenario) => void;
  forceOpen?: boolean;
  isPrintView?: boolean;
}

function LeaveCard({
  title,
  summary,
  icon,
  days,
  pay,
  law,
  lawCite,
  failIssues,
  failCite,
  actualRights,
  children,
  scenarios,
  onOpenScenario,
  forceOpen = false,
  isPrintView = false
}: LeaveCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const _isOpen = forceOpen || isOpen;

  return (
    <div className={cn(
      "bg-white border border-ink/10 rounded-xl overflow-hidden mb-6 transition-all hover:border-ink/30 relative",
      isPrintView && "print-border print-break-inside-avoid print:shadow-none"
    )}>
      <button
        onClick={() => !isPrintView && setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-6 p-6 text-left transition-colors relative z-10 cursor-pointer touch-manipulation",
          isOpen ? "bg-paper border-b border-ink/10" : "hover:bg-paper",
          isPrintView && "print:bg-gray-50 print-border-b"
        )}
      >
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 bg-ink text-paper",
          isPrintView && "print:bg-black print:text-white"
        )} style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className={cn(
            "font-serif text-xl md:text-2xl font-bold text-ink mb-1 tracking-tight",
            isPrintView && "print:text-black"
          )}>{title}</h2>
          <p className={cn(
            "text-[11px] text-ink/60 font-medium",
            isPrintView && "print:text-black/80"
          )}>{summary}</p>
        </div>
        <div className="hidden sm:flex print:flex flex-col gap-2 items-end shrink-0">
          <span className={cn(
            "text-[9px] uppercase tracking-widest font-black text-ink/60 border border-ink/20 px-2 py-0.5 rounded-xl",
            isPrintView && "print:text-black print:border-black/30"
          )}>
            {days}
          </span>
          <span className={cn(
            "text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded-xl",
            pay.includes("全薪") ? "bg-ink text-paper" : "bg-transparent text-ink border border-ink",
            isPrintView && (pay.includes("全薪") ? "print:bg-black print:text-white" : "print:text-black print:border-black/30")
          )} style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
            {pay}
          </span>
        </div>
        {!isPrintView && (
          <ChevronDown
            size={16}
            className={cn("text-ink/30 transition-transform duration-500", _isOpen && "rotate-180")}
          />
        )}
      </button>

      <AnimatePresence initial={!isPrintView}>
        {_isOpen && (
          <motion.div
            initial={isPrintView ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={forceOpen ? false : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className={cn(
              "grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-ink/5",
              isPrintView && "print-grid-2 print-border-b"
            )}>
              {/* Law Section */}
              <div className={cn(
                "p-8 border-b md:border-r border-ink/10 order-1",
                isPrintView && "print:p-6 print-border-r print-border-b"
              )}>
                <div className={cn(
                  "text-[9px] font-black tracking-[0.2em] text-ink uppercase mb-6 flex items-center gap-2",
                  isPrintView && "print:text-black print:mb-4"
                )}>
                  <div className={cn("w-4 h-px bg-ink/20", isPrintView && "print:bg-black/30")} /> 法律保障
                </div>
                <div className={cn(
                  "text-[14px] text-ink/70 leading-relaxed font-light space-y-4 [&_strong]:text-ink",
                  isPrintView && "print:text-black print:font-normal"
                )}>
                  {law}
                </div>
                {lawCite && (
                  <div className={cn(
                    "mt-6 text-[11px] text-ink/60 font-medium leading-snug",
                    isPrintView && "print:text-black/60 print:mt-4"
                  )}>
                    來源：{lawCite}
                  </div>
                )}
              </div>

              {/* Actual Rights Section - Highlighted */}
              <div className={cn(
                "p-8 bg-[#fdf8ee] border-b border-ink/10 order-3 md:order-2",
                isPrintView && "print:p-6 print-bg-rights print-border-b"
              )} style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                <div className={cn(
                  "text-[9px] font-black tracking-[0.2em] text-[#8b6914] uppercase mb-6 flex items-center gap-2",
                  isPrintView && "print:text-[#664d03] print:mb-4"
                )}>
                  <div className={cn("w-4 h-px bg-[#8b6914]/20", isPrintView && "print:bg-[#664d03]/30")} /> 我們的實際權益
                </div>
                <div className={cn(
                  "text-[14px] leading-relaxed font-light space-y-4 text-ink/70 [&_strong]:text-ink",
                  isPrintView && "print:text-black print:font-normal"
                )}>
                  {actualRights}
                </div>
              </div>

              {/* Scenarios Section replacing Status Keep */}
              <div className={cn(
                "p-8 border-b md:border-b-0 md:border-r border-ink/10 order-2 md:order-3",
                isPrintView && "print:p-6 print-border-r"
              )}>
                <div className={cn(
                  "text-[9px] font-black tracking-[0.2em] text-ink/60 uppercase mb-6 flex items-center gap-2",
                  isPrintView && "print:text-black/60 print:mb-4"
                )}>
                  <div className={cn("w-4 h-px bg-ink/20", isPrintView && "print:bg-black/30")} /> 情境說明與舉例
                </div>
                {scenarios && scenarios.length > 0 ? (
                  <div className={cn(isPrintView ? "print-example-box space-y-8" : "flex flex-wrap gap-2")}>
                    {scenarios.map((s, idx) => (
                      isPrintView ? (
                        <div key={idx} className="space-y-4 border-b border-black/5 pb-8 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-red-mid rounded-full" />
                            <div className="text-[10px] font-black tracking-[0.1em] text-ink uppercase">📖 舉例：{s.title}</div>
                          </div>
                          <div className="text-xs leading-relaxed pl-3 border-l-2 border-ink/5">{s.content}</div>
                        </div>
                      ) : (
                        <button
                          key={idx}
                          onClick={() => onOpenScenario?.(s)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-paper border border-ink/10 rounded-full text-xs font-bold text-ink/60 hover:border-ink hover:text-ink transition-all cursor-pointer shadow-sm group"
                        >
                          <Info size={14} className="text-ink/20 group-hover:text-red-mid" />
                          {s.label}
                        </button>
                      )
                    ))}
                  </div>
                ) : (
                  <div className={cn(
                    "text-[13px] text-ink/70 leading-relaxed font-light",
                    isPrintView && "print:text-black print:font-normal"
                  )}>
                    <span className={cn("opacity-40", isPrintView && "print:opacity-60")}>目前無常見情境。</span>
                  </div>
                )}
              </div>

              {/* Violations Section */}
              <div className={cn("p-8 order-4", isPrintView && "print:p-6")}>
                <div className={cn(
                  "text-[9px] font-black tracking-[0.2em] text-[#c0392b] uppercase mb-6 flex items-center gap-2",
                  isPrintView && "print:text-[#a02d23] print:mb-4"
                )}>
                  <div className={cn("w-4 h-px bg-[#c0392b]/20", isPrintView && "print:bg-[#a02d23]/30")} /> 中心現狀
                </div>
                <div className={cn(
                  "text-[13px] text-ink/70 leading-relaxed font-light space-y-4",
                  isPrintView && "print:text-black print:font-normal"
                )}>
                  {failIssues || <span className={cn("opacity-40", isPrintView && "print:opacity-60")}>目前無具體違法記錄。</span>}
                </div>
                {failCite && (
                  <div className={cn(
                    "mt-4 text-[10px] text-[#c0392b]/60 font-bold tracking-tighter",
                    isPrintView && "print:text-red-800/60"
                  )}>
                    來源：{failCite}
                  </div>
                )}
              </div>
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScenarioModal({ 
  scenario, 
  onClose 
}: { 
  scenario: Scenario | null; 
  onClose: () => void 
}) {
  return (
    <AnimatePresence>
      {scenario && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/70 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            className="bg-white w-full max-w-xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[85vh] border border-ink/10"
          >
            <div className="p-8 md:p-10 border-b border-ink/5 flex justify-between items-start bg-paper/30">
              <div>
                <div className="text-[10px] font-black tracking-[0.2em] text-[#1a3d6b] uppercase mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1a3d6b] rounded-full" />
                  {scenario.eyebrow || "情境說明與舉例"}
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-ink leading-tight">{scenario.title}</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-ink hover:text-paper rounded-full transition-all text-ink/30 cursor-pointer"
              >
                <AlertCircle className="rotate-45" size={24} />
              </button>
            </div>
            <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar flex-1 lg:p-12">
              <div className="space-y-10">
                {scenario.content}
              </div>
            </div>
            <div className="p-8 bg-paper/50 border-t border-ink/5 flex justify-between items-center bg-white">
              <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">
                MTC Educators' Rights Guidance
              </p>
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-ink text-paper text-sm font-black rounded-full cursor-pointer hover:bg-ink/80 transition-all shadow-lg active:scale-95"
              >
                我知道了
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const SituationBlock = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-4">
    <div className="text-[9px] font-black tracking-[0.2em] text-ink/40 uppercase">📋 情境 (Situation)</div>
    <div className="bg-paper p-6 md:p-8 rounded-2xl border-l-[6px] border-[#1a3d6b] text-base md:text-lg leading-relaxed font-medium text-ink italic shadow-sm">
      {children}
    </div>
  </div>
);

const WrongBlock = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-4">
    <div className="text-[9px] font-black tracking-[0.2em] text-[#c0392b] uppercase">❌ 違背法律 (Violation)</div>
    <div className="text-sm md:text-base leading-relaxed text-ink/80 space-y-4 [&_strong]:text-ink [&_span.warn]:text-[#c0392b] [&_span.warn]:font-bold">
      {children}
    </div>
  </div>
);

const CorrectBlock = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-4">
    <div className="text-[9px] font-black tracking-[0.2em] text-[#1a6b4a] uppercase">✅ 正確作法 (Resolution)</div>
    <div className="text-sm md:text-base leading-relaxed text-ink/80 space-y-4 [&_strong]:text-ink [&_span.good]:text-[#1a6b4a] [&_span.good]:font-bold">
      {children}
    </div>
  </div>
);

const TipsBlock = ({ title, children }: { title?: string, children: React.ReactNode }) => (
  <div className="space-y-4">
    <div className="text-[9px] font-black tracking-[0.2em] text-[#8b6914] uppercase">{title || "💡 權益小提醒 (Tips)"}</div>
    <div className="bg-[#fdf8ee] p-6 rounded-2xl border border-[#8b6914]/10 text-sm md:text-base leading-relaxed text-ink/80 space-y-4 [&_strong]:text-ink [&_span.note]:text-[#8b6914] [&_span.note]:font-bold">
      {children}
    </div>
  </div>
);

interface LeaveItem {
  title: string;
  summary: string;
  icon: string;
  tags: string[];
  days: string;
  pay: string;
  law: React.ReactNode;
  lawCite?: string;
  failIssues?: React.ReactNode;
  failCite?: string;
  actualRights: React.ReactNode;
  scenarios?: Scenario[];
  children?: React.ReactNode;
}

export default function LeaveGuide({ isPrintView = false, selectedLeaves = null }: { isPrintView?: boolean, selectedLeaves?: string[] | null }) {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [activeScenario, setActiveScenario] = React.useState<Scenario | null>(null);

  const leaves: LeaveItem[] = [
    {
      title: "例假日",
      summary: "每 7 日中 1 天，原則不得出勤",
      icon: "📅",
      tags: ["例假日", "全薪", "常態"],
      days: "每週 1 天",
      pay: "全薪",
      law: (
        <ul className="list-disc pl-4 space-y-1">
          <li>每 7 日應有 <strong>1 天例假日，全薪</strong></li>
          <li><strong>原則上不得出勤</strong>，僅限天災、事變或突發事件例外</li>
          <li>若因例外情況出勤，應<strong>加倍給薪並補假</strong></li>
        </ul>
      ),
      lawCite: "勞基法 §36",
      failIssues: (
        <ul className="list-disc pl-4 space-y-1">
          <li>例假日安排有工作坊、講座等活動，<span className="text-[#c0392b] font-medium">要求或預設教師出席但不支薪</span></li>
          <li>此類活動若具出席義務，屬出勤範疇，<span className="text-[#c0392b] font-medium">應依例假日出勤規定加倍給薪並補假</span></li>
        </ul>
      ),
      failCite: "❌ 違反勞基法 §36、§40",
      actualRights: (
        <ul className="list-disc pl-4 space-y-1">
          <li>例假日工作坊、講座若有出席義務，<strong>應主動詢問是否計薪</strong>，並要求以書面確認</li>
          <li>若被要求例假日出勤但不支薪，可拒絕或要求加倍給薪並補假</li>
        </ul>
      )
    },
    {
      title: "休息日",
      summary: "每 7 日中 1 天，可協商出勤但需加給加班費",
      icon: "🗓️",
      tags: ["休息日", "全薪", "常態"],
      days: "每週 1 天",
      pay: "全薪",
      law: (
        <ul className="list-disc pl-4 space-y-1">
          <li>每 7 日應有 <strong>1 天休息日，全薪</strong></li>
          <li>可協商出勤，但出勤須<strong>依加班費標準加給</strong></li>
          <li>出勤加班費：<strong>2 小時內加給 1⅓ 倍；逾 2 小時加給 1⅔ 倍</strong></li>
        </ul>
      ),
      lawCite: "勞基法 §36、§24",
      actualRights: (
        <ul className="list-disc pl-4 space-y-1">
          <li>休息日出勤應主動確認加班費是否正確計算</li>
          <li>若雇主強制要求出勤，應確保補假或加班費到位</li>
        </ul>
      )
    },
    {
      title: "國定假日",
      summary: "現行共 15～16 天（依內政部公告），出勤應加給一日工資（共雙倍）",
      icon: "🎌",
      tags: ["國定假日", "全薪", "常態"],
      days: "15–16 天 / 年",
      pay: "全薪",
      law: (
        <ul className="list-disc pl-4 space-y-1">
          <li>依內政部公告，<strong>現行共 15～16 天，全薪</strong>（兒童節與清明節有時同日，故天數略有差異）</li>
          <li>包含：元旦、春節（小年夜至初三，共 5 天）、和平紀念日、兒童節、民族掃墓節（清明）、勞動節、端午節、教師節、中秋節、國慶日、臺灣光復節、行憲紀念日</li>
          <li>出勤應<strong>加給一日工資（共雙倍薪）</strong></li>
          <li>天數非勞基法直接規定，<strong>由行政令另定</strong></li>
        </ul>
      ),
      lawCite: "勞基法 §37、§39；紀念日及節日實施條例",
      actualRights: (
        <ul className="list-disc pl-4 space-y-1">
          <li>國定假日出勤，應確認雙倍薪資是否正確給付</li>
          <li>補班安排應符合勞資協議，不得片面強制補班</li>
        </ul>
      )
    },
    {
      title: "普通傷病假（病假）",
      summary: "未住院 30 天半薪、住院最長 1 年半薪｜含公傷假、生理假",
      icon: "🤒",
      tags: ["病假", "傷病", "半薪", "公傷", "生理假", "violation"],
      days: "30 天 / 年",
      pay: "半薪",
      law: (
        <ul className="list-disc pl-4 space-y-1">
          <li>
            <strong>普通傷病假（未住院）：一年合計最多 30 天，半薪</strong><br />
            <span className="text-xs opacity-60">超過 30 天部分不支薪；一年內未超過 10 天者雇主不得為不利處分（114年新制）</span>
          </li>
          <li>
            <strong>普通傷病假（住院）：兩年內合計最多 1 年</strong>（含未住院天數），半薪<br />
            <span className="text-xs opacity-60">罹癌門診治療、安胎假均併入住院傷病假計算</span>
          </li>
          <li>
            <strong>公傷病假：治療、休養期間無上限，全薪</strong><br />
            <span className="text-xs opacity-60">因職業災害致失能、傷害或疾病者；不得扣全勤</span>
          </li>
          <li>
            <strong>生理假：每月 1 天，半薪</strong><br />
            <span className="text-xs opacity-60">一年前 3 天不併入傷病假；不得要求提供證明；不得扣全勤或考績</span>
          </li>
          <li>雇主可要求提供證明，但<strong>不得無故拒絕請假</strong></li>
        </ul>
      ),
      lawCite: "勞工請假規則 §4–6、§9-1；性別平等工作法 §14",
      failIssues: (
        <ul className="list-disc pl-4 space-y-1">
          <li>未主動告知半薪權利，<span className="text-[#c0392b] font-medium">需教師自行追討</span></li>
          <li>以「請假超過 3 天需審核、且須找到替代教師」為由，<span className="text-[#c0392b] font-medium">實質擋假</span></li>
        </ul>
      ),
      failCite: "❌ 違反勞工請假規則 §4、§10；勞基法 §43",
      actualRights: (
        <ul className="list-disc pl-4 space-y-1">
          <li>理論上有 30 天半薪病假，<span className="text-[#c0392b] font-medium">實際需自行爭取</span></li>
          <li className="text-[#1a6b4a] font-medium">教師請假<strong>沒有自行找代課之義務</strong>，安排代課是辦公室的責任，請主動主張</li>
          <li>通勤受傷若屬職災，可主張<strong>全薪公傷假</strong>（無天數上限）</li>
        </ul>
      ),
      scenarios: [
        {
          id: "modal-sick",
          label: "請假代課",
          title: "普通傷病假：到底要誰找代課？",
          content: (
            <>
              <SituationBlock>
                王老師感冒發燒，醫生開了 5 天的休養證明。她向辦公室發訊息請病假，對方卻說：「請假超過 3 天需要審核，而且要先自己找好代課老師我們才準假喔。」
              </SituationBlock>
              <WrongBlock>
                <span className="warn">雇主要求教師自行找代課是違法的</span>。安排代課及維持單位運作是雇主的管理責任。
              </WrongBlock>
              <CorrectBlock>
                告知辦公室已交出診斷證明，並依勞基法請假。提醒對方：「安排核准代課是雇主的管理責任，老師並無代勞義務。」
              </CorrectBlock>
            </>
          )
        },
        {
          id: "modal-sick-hospitalized",
          label: "住院病假",
          title: "住院傷病假：癌症門診治療也適用",
          content: (
            <>
              <SituationBlock>
                陳老師確診早期乳癌，醫生建議採門診化療方式治療，預計需 3 個月。陳老師擔心病假天數不夠用，超過 30 天後就沒有薪水。
              </SituationBlock>
              <TipsBlock title="✅ 其實有保障">
                依法，<strong>罹癌採門診方式治療，視同住院傷病假計算</strong>，不受每年 30 天的限制。兩年內合計最長可請 1 年，期間<span className="good">半薪照給</span>。
              </TipsBlock>
            </>
          )
        },
        {
          id: "modal-occupational",
          label: "公傷職災",
          title: "公傷病假：上下班意外也是職災",
          content: (
            <>
              <SituationBlock>
                林老師在下班途中發生車禍右手骨折。辦公室說：「這是你自己的意外，跟工作沒關係，請普通病假。」
              </SituationBlock>
              <WrongBlock>
                <span className="warn">上下班途中發生的交通事故若符合認定標準，應屬職災</span>。中心未主動告知，導致林老師少領了半薪差額。
              </WrongBlock>
              <CorrectBlock>
                向勞保局申請職災傷病給付，並要求中心將假別改列為<strong>公傷病假</strong>。
              </CorrectBlock>
            </>
          )
        },
        {
          id: "modal-menstrual",
          label: "生理假",
          title: "生理假：無須證明且不得扣全勤",
          content: (
            <>
              <SituationBlock>
                吳老師每個月生理期第一天都會嚴重疼痛。她擔心請假會被扣全勤，或被要求提供醫院證明。
              </SituationBlock>
              <CorrectBlock>
                性平法 §14 明定生理假每月 1 天、半薪，且<span className="good">不得要求提供證明</span>，亦不得扣考績或全勤。
              </CorrectBlock>
            </>
          )
        }
      ]
    },
    {
      title: "產假 ＆ 生育相關假別",
      summary: "產假 8 週、產檢假 7 天、陪產假 7 天｜中心違法退保，津貼無法領取",
      icon: "🤱",
      tags: ["產假", "育嬰", "留職停薪", "violation"],
      days: "多種假別",
      pay: "依規定",
      law: (
        <ul className="list-disc pl-4 space-y-1">
          <li>
            <strong>產假：8 週</strong>（含例休假日）<br />
            <span className="text-xs opacity-60">年資滿 6 個月→全薪；未滿 6 個月→半薪</span>
          </li>
          <li>
            <strong>流產假：</strong><br />
            <span className="text-xs opacity-60">妊娠 3 個月以上→ 4 週（薪資同產假）；2～3 個月→ 7 天；未滿 2 個月→ 5 天（不支薪）</span>
          </li>
          <li>
            <strong>產檢假：7 天，全薪</strong><br />
            <span className="text-xs opacity-60">雇主超過 5 天部分可申請政府補助</span>
          </li>
          <li>
            <strong>陪產檢及陪產假：7 天，全薪</strong>（配偶適用）<br />
            <span className="text-xs opacity-60">第 6、7 天雇主可申請政府補助</span>
          </li>
          <li>
            <strong>育嬰留職停薪：最長 2 年</strong>（子女滿 3 歲前）<br />
            <span className="text-xs opacity-60">留停期間可續保勞健保；可申請育嬰津貼（投保薪資 60%，最長 6 個月）</span>
          </li>
        </ul>
      ),
      lawCite: "勞基法 §50；性平法 §15、§15-1、§16；勞保條例 §9",
      failIssues: (
        <ul className="list-disc pl-4 space-y-1">
          <li>育嬰留停期間，<span className="text-[#c0392b] font-medium">逕行將教師退出勞健保</span>。</li>
          <li>導致教師<span className="text-[#c0392b] font-medium">無法領取生育給付及育嬰留停津貼</span>。</li>
        </ul>
      ),
      failCite: "❌ 違反性平法、勞保條例",
      actualRights: (
        <ul className="list-disc pl-4 space-y-1">
          <li>產假、產檢假、陪產假均依法應給，不可用特休或事假替代。</li>
          <li className="text-[#c0392b] font-medium">申請育嬰留停時，須明確要求中心維持勞健保。</li>
        </ul>
      ),
      scenarios: [
        {
          id: "modal-maternity",
          label: "產假薪資",
          title: "產假：年資與全薪保障",
          content: (
            <>
              <SituationBlock>
                蔡老師年資 8 個月，預計在 9 月生產。她聽到同事說「在這裡生孩子薪水只有一半」，有點擔心。
              </SituationBlock>
              <TipsBlock title="✅ 實際保障">
                蔡老師年資已滿 6 個月，依法產假 <strong>8 週全薪</strong>。未滿 6 個月才給半薪。
              </TipsBlock>
            </>
          )
        },
        {
          id: "modal-miscarriage",
          label: "流產假",
          title: "流產假：容易被忽略的權益",
          content: (
            <>
              <SituationBlock>
                許老師懷孕 14 週不幸流產。辦公室說：「這種情況只能請普通病假，半薪。」
              </SituationBlock>
              <WrongBlock>
                許老師懷孕超過 3 個月，依勞基法 §50 應給予 <strong>4 週流產假，薪資同產假</strong>。
              </WrongBlock>
              <CorrectBlock>
                明確申請「流產假」而非病假，並附上證明，確認薪資依正當標準發放。
              </CorrectBlock>
            </>
          )
        },
        {
          id: "modal-prenatal",
          label: "產檢假",
          title: "產檢假：不應動用特休",
          content: (
            <>
              <SituationBlock>
                鄭老師定期產檢都用特休，因為她不知道有「產檢假」。
              </SituationBlock>
              <CorrectBlock>
                依性平法 §15-1，產檢假共 <strong>7 天全薪</strong>，與特休獨立。已動用特休的部分可要求補回。
              </CorrectBlock>
            </>
          )
        },
        {
          id: "modal-paternity",
          label: "陪產假",
          title: "陪產檢及陪產假：配偶的權益",
          content: (
            <>
              <SituationBlock>
                黃老師想請假陪產，但擔心要請不支薪的事假。
              </SituationBlock>
              <CorrectBlock>
                配偶分娩時可請 <strong>7 天全薪陪產檢及陪產假</strong>。無須動用事假或特休。
              </CorrectBlock>
            </>
          )
        },
        {
          id: "modal-parental-leave",
          label: "育嬰留停",
          title: "育嬰留職停薪：保險與津貼",
          content: (
            <>
              <SituationBlock>
                林老師申請育嬰留停半年，後發現勞健保被中心退掉了，導致無法領取育嬰津貼。
              </SituationBlock>
              <WrongBlock>
                <span className="warn">雇主不得逕行為留停勞工退保</span>。
              </WrongBlock>
              <CorrectBlock>
                申請時書面要求維持投保。若已被退保，立即聯繫工會向主管機關申訴追討津貼損失。
              </CorrectBlock>
            </>
          )
        }
      ]
    },
    {
      title: "事假 ＆ 家庭照顧假",
      summary: "事假一年最多 14 天不支薪；家庭照顧假 7 天併入計算",
      icon: "📝",
      tags: ["事假", "家庭照顧假", "不支薪"],
      days: "14 天 / 年",
      pay: "不支薪",
      law: (
        <ul className="list-disc pl-4 space-y-1">
          <li>
            <strong>事假：一年合計最多 14 天，不支薪</strong><br />
            <span className="text-xs opacity-60">無須說明事由；不計入例假日</span>
          </li>
          <li>
            <strong>家庭照顧假：一年 7 天，不支薪</strong>（併入事假 14 天計算）<br />
            <span className="text-xs opacity-60">家庭成員預防接種、嚴重疾病或重大事故時適用；<strong>不得扣全勤</strong>（與一般事假不同）</span>
          </li>
        </ul>
      ),
      lawCite: "勞工請假規則 §7、§9；性別平等工作法 §20",
      failIssues: (
        <ul className="list-disc pl-4 space-y-1">
          <li>中心未明載家庭照顧假制度，<span className="text-[#c0392b] font-medium">教師可能不知此假別不得扣全勤</span></li>
          <li>有以「沒有規定」為由拒絕家庭照顧假的疑慮</li>
        </ul>
      ),
      actualRights: (
        <ul className="list-disc pl-4 space-y-1">
          <li>家庭照顧假雖不支薪，但<strong>不得因此扣全勤</strong>，這是與一般事假的最大差異</li>
          <li>若家人需緊急照顧，可優先申請家庭照顧假而非一般事假，以保護全勤記錄</li>
          <li>申請時建議以書面（email）留存紀錄</li>
        </ul>
      ),
      scenarios: [
        {
          id: "modal-personal-leave",
          label: "事假理由",
          title: "事假：一定要向雇主交代理由嗎？",
          content: (
            <>
              <SituationBlock>
                趙老師家有急事要處理。辦公室詢問：「你要請什麼假？要有充分理由我們才能核准。」
              </SituationBlock>
              <TipsBlock title="✅ 事假無須詳細說明理由">
                依法事假只需告知「有事故需親自處理」，<strong>無須向雇主詳細說明細節</strong>。辦公室要求「核准充分理由」已超出法律授權。且代課仍由辦公室負責，不可要求教師自行找人。
              </TipsBlock>
            </>
          )
        },
        {
          id: "modal-family-care",
          label: "家庭照顧",
          title: "家庭照顧假：保住全勤的最佳選擇",
          content: (
            <>
              <SituationBlock>
                孫老師孩子突然高燒需送醫，緊急請假一天。辦公室警告：「這會扣你的全勤獎金，你要想清楚。」
              </SituationBlock>
              <WrongBlock>
                依性平法第 20 條，<span className="warn">家庭照顧假不得扣全勤獎金</span>。中心的說法已屬違法威脅。
              </WrongBlock>
              <CorrectBlock>
                申請時明確指定假別為「<strong>家庭照顧假</strong>」，而非一般事假。若遇到全勤仍被扣除，應留存證據透過工會申訴。
              </CorrectBlock>
            </>
          )
        }
      ]
    },
    {
      title: "婚假",
      summary: "法定 8 天全薪｜中心未明載婚假制度",
      icon: "💍",
      tags: ["婚假", "結婚", "全薪", "violation"],
      days: "8 天",
      pay: "全薪",
      law: (
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>8 天全薪</strong></li>
          <li>結婚前 10 日起 <strong>3 個月內</strong>請畢（公司同意可延至 1 年）</li>
          <li><strong>不得扣全勤獎金</strong></li>
        </ul>
      ),
      lawCite: "勞工請假規則 §2",
      failIssues: (
        <ul className="list-disc pl-4 space-y-1">
          <li>聘約未載婚假，教師不知有假可請。</li>
        </ul>
      ),
      actualRights: (
        <ul className="list-disc pl-4 space-y-1">
          <li>主動向中心確認，且依法無須自行尋求代課教師。</li>
        </ul>
      ),
      scenarios: [
        {
          id: "modal-wedding",
          label: "舉例說明",
          title: "婚假：權益不因聘約未載而消失",
          content: (
            <>
              <SituationBlock>
                陳老師計畫在 10 月結婚。查詢聘約發現沒寫婚假，詢問辦公室卻被告知「要自己確認」。
              </SituationBlock>
              <WrongBlock>
                聘約未載是管理的疏失。<span className="warn">雇主有義務讓勞工了解其法定權利</span>。
              </WrongBlock>
              <CorrectBlock>
                《勞工請假規則》第 2 條明定婚假為 <strong>8 天全薪</strong>。申請時主動確認 8 天假及工資照給，且無須自行找代課。
              </CorrectBlock>
            </>
          )
        }
      ]
    },
    {
      title: "喪假",
      summary: "父母/配偶 8 天全薪｜中心誤導僅給 4 天",
      icon: "🕯️",
      tags: ["喪假", "喪亡", "全薪", "violation"],
      days: "3–8 天",
      pay: "全薪",
      law: (
        <ul className="list-disc pl-4 space-y-1">
          <li>父母、養父母、繼父母、配偶：<strong>8 天全薪</strong></li>
          <li>祖父母、子女、配偶之父母（含養父母、繼父母）：<strong>6 天全薪</strong></li>
          <li>曾祖父母、兄弟姊妹、配偶之祖父母：<strong>3 天全薪</strong></li>
          <li>百日內可<strong>分次請畢</strong>，<strong>不計入例假日</strong></li>
          <li><strong>不得扣全勤獎金</strong></li>
        </ul>
      ),
      lawCite: "勞工請假規則 §3",
      failIssues: (
        <ul className="list-disc pl-4 space-y-1">
          <li>主管告知 <span className="text-[#c0392b] font-medium">8 天喪假僅能請 4 天</span></li>
        </ul>
      ),
      actualRights: (
        <ul className="list-disc pl-4 space-y-1">
          <li>父母/配偶過世法定 <span className="text-[#1a6b4a] font-medium"><strong>8 天全薪</strong></span>，切勿接受「4 天」說法</li>
          <li>可於百日內彈性分次請，無須一次休完</li>
          <li className="text-[#1a6b4a] font-medium">教師請假<strong>沒有自行找代課之義務</strong>，安排代課是辦公室的責任，請主動主張</li>
        </ul>
      ),
      scenarios: [
        {
          id: "modal-funeral",
          label: "舉例說明",
          title: "喪假：不要被錯誤資訊給騙了",
          content: (
            <>
              <SituationBlock>
                張老師父親過世。主管告知：「父親過世給 4 天，你看著用吧。」
              </SituationBlock>
              <WrongBlock>
                這是嚴重違法！法規明定 <span className="warn">父母過世喪假為 8 天、全薪</span>。主管少給了 4 天有薪假。
              </WrongBlock>
              <CorrectBlock>
                喪假可在百日內分次請完。張老師應在治喪後主動補請剩餘的 4 天假。
              </CorrectBlock>
            </>
          )
        }
      ]
    },
    {
      title: "特別休假（特休）",
      summary: "依年資 3～30 天，全薪｜中心至今未建立制度",
      icon: "🌿",
      tags: ["特休", "特別休假", "全薪", "violation"],
      days: "3–30 天 / 年",
      pay: "全薪",
      law: (
        <ul className="list-disc pl-4 space-y-1">
          <li>年資滿 6 個月：<strong>3 天</strong></li>
          <li>滿 1 年：<strong>7 天</strong>｜滿 2 年：<strong>10 天</strong></li>
          <li>滿 3 年：<strong>14 天</strong>｜滿 5 年：<strong>15 天</strong></li>
          <li>滿 10 年起：<strong>每年加 1 天，上限 30 天</strong></li>
          <li>全薪；期日由<strong>勞工自行排定</strong>，雇主不得無故拒絕</li>
          <li><strong>遞延規定：</strong>年度終結未休完，可經勞雇雙方協商<strong>遞延至次一年度</strong>，但僅能遞延<strong>一次</strong>；次一年度仍未休完，雇主<strong>必須折算工資發給</strong>，不得再遞延</li>
          <li><strong>折算工資計算方式：</strong>以<strong>前一年度月薪 ÷ 30 × 未休天數</strong>計算；離職時亦同，雇主須於離職日起算</li>
          <li>雇主須<strong>主動告知</strong>剩餘特休天數及折算金額，並記載於工資清冊</li>
        </ul>
      ),
      lawCite: "勞基法 §38、§70",
      failIssues: (
        <ul className="list-disc pl-4 space-y-1">
          <li><span className="text-[#c0392b] font-medium">至今未建立特休制度</span>，未主動告知教師</li>
          <li>年度終結或離職時，<span className="text-[#c0392b] font-medium">未依法折算未休特休為工資</span></li>
          <li>依年資及授課量，每年折算薪資約 <strong>3 萬～9 萬元</strong>，是各假別中<span className="text-[#c0392b] font-medium">經濟損失最大者</span></li>
          <li>中心雇用人數達 30 人以上，依法應訂定「工作規則」（勞基法 §70），並確保其內容不得牴觸法令（§71）；<span className="text-[#c0392b] font-medium">迄今未落實</span></li>
        </ul>
      ),
      failCite: "❌ 違反勞基法 §38、§70",
      actualRights: (
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>年資自實際到職日起算</strong>，與勞基法適用日期無關；多數 2008 年前任教的老師，年資已超過 10 年，每年特休天數隨年資遞增（滿 10 年為 16 天，之後每年加 1 天，上限 30 天）</li>
          <li className="text-[#1a6b4a] font-medium">歷年未休、未折算的特休工資<strong>可依法追討</strong></li>
          <li>若中心欲遞延特休，須經你<strong>本人同意</strong>，且只能遞延一次；次年仍未給，即可要求折算工資</li>
          <li>因每位老師授課班型、時數與年資不同，實際月薪各異，請自行帶入計算</li>
          <li>請務必保留年資佐證文件（聘約、出勤紀錄等），作為追討依據</li>
          <li>這是各假別中<span className="text-[#c0392b] font-medium"><strong>經濟價值最高、應優先追討</strong></span>的權益</li>
        </ul>
      ),
      scenarios: [
        {
          id: "modal-annual",
          label: "舉例說明",
          title: "特休：我的權益究竟有多少錢？",
          content: (
            <>
              <SituationBlock>
                李老師任教 12 年，月薪約 4 萬。從沒休過特休，中心也說沒這制度。
              </SituationBlock>
              <WrongBlock>
                這是嚴重違法！12 年年資應有每年 22 天特休。中心必須將未休天數折算工資。
              </WrongBlock>
              <CorrectBlock>
                每年可追討 <strong>約 $29,333</strong>。累積 5 年可追回 <span className="good">約 $147,000</span>。
              </CorrectBlock>
            </>
          )
        }
      ]
    },
    {
      title: "公假",
      summary: "依法令應給假情形，工資照給，天數視需要而定",
      icon: "📋",
      tags: ["公假", "全薪", "教召", "選舉"],
      days: "視需要",
      pay: "全薪",
      law: (
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>工資照給，天數視實際需要而定</strong>，無明定上限</li>
          <li>適用情形包含：<strong>教召（後備軍人教育召集）</strong>、依法擔任投開票所工作人員、應國家考試、依法出庭作證等</li>
          <li><strong>不得扣全勤獎金</strong>，且不得視為缺勤</li>
        </ul>
      ),
      lawCite: "勞工請假規則 §8、§9",
      failIssues: (
        <ul className="list-disc pl-4 space-y-1">
          <li>中心未於聘約或說明文件中<span className="text-[#c0392b] font-medium">明載公假制度</span></li>
          <li>教師若不主動詢問，<span className="text-[#c0392b] font-medium">可能不知道可以請公假</span>、誤以為要用特休或事假抵充</li>
        </ul>
      ),
      actualRights: (
        <ul className="list-disc pl-4 space-y-1">
          <li>收到<strong>教召通知書</strong>時，持通知書向中心申請公假，<span className="text-[#1a6b4a] font-medium">全程工資照給，不須使用特休或事假</span></li>
          <li>擔任選務工作（投開票所工作人員）同樣可請公假</li>
          <li>公假<strong>不得扣全勤</strong>，且辦公室應負責安排代課</li>
          <li>建議以書面留存公假申請紀錄</li>
        </ul>
      ),
      scenarios: [
        {
          id: "modal-public",
          label: "舉例說明",
          title: "公假：教召是法定義務，不是事假",
          content: (
            <>
              <SituationBlock>
                吳老師收到 5 天教召通知。正猶豫是否要用特休抵充或請事假（不支薪）。
              </SituationBlock>
              <WrongBlock>
                教召屬法定公假，<span className="warn">不需要動用個人假別</span>。用特休抵教召是雇主規備法律義務的常見手段。
              </WrongBlock>
              <CorrectBlock>
                持教召通知申請公假，<strong>工資照給、不得扣全勤</strong>。安排代課同樣是中心責任。
              </CorrectBlock>
            </>
          )
        }
      ]
    },
    {
      title: "颱風假（天然災害假）",
      summary: "颱風假不是假｜不得記曠職、不得扣全勤、不得強迫以事假抵充",
      icon: "🌀",
      tags: ["颱風假", "天然災害", "停班", "全薪"],
      days: "視情況",
      pay: "宜給薪",
      law: (
        <ul className="list-disc pl-4 space-y-1 text-sm md:text-[14px]">
          <li><strong>颱風假不是勞基法的正式假別</strong>，依據為《天然災害發生事業單位勞工出勤管理及工資給付要點》</li>
          <li>只要<strong>工作地、居住地、或上班必經途中</strong>任一縣市首長宣布停班，勞工因而未出勤，雇主：
            <ul className="list-disc pl-4 space-y-1 mt-2 text-ink/80">
              <li><strong>不得視為曠工或遲到</strong></li>
              <li><strong>不得強迫以事假或其他假別處理</strong></li>
              <li><strong>不得強迫補班</strong></li>
              <li><strong>不得扣發全勤獎金</strong></li>
              <li><strong>不得解僱或為其他不利處分</strong></li>
            </ul>
          </li>
          <li className="mt-2">颱風天未出勤：雇主「<strong>宜</strong>」不扣薪（建議但非強制）</li>
          <li>颱風天出勤（正常工作日）：工資照給，雇主「宜」額外加給，但非強制</li>
          <li>颱風天出勤（休息日）：<strong>须依加班费標準給付</strong></li>
          <li><span className="text-[#c0392b] font-medium">不得要求以特休抵充颱風假</span>（勞基法保障特休由勞工自行排定）</li>
        </ul>
      ),
      lawCite: "出勤管理及工資給付要點 §6、§7；勞基法 §38",
      failIssues: (
        <ul className="list-disc pl-4 space-y-1">
          <li>颱風天授課中斷後，<span className="text-[#c0392b] font-medium">發信要求老師通知學生調課或補課</span>，將補行工作的責任轉嫁給教師</li>
          <li>颱風假後三日內要求提供課程進度表，<span className="text-[#c0392b] font-medium">間接施壓補課</span></li>
        </ul>
      ),
      failCite: "❌ 違反勞工出勤管理及工資給付要點 §6",
      actualRights: (
        <ul className="list-disc pl-4 space-y-1">
          <li>颱風天不出勤，<strong>絕對不可被記曠職或強迫請事假</strong>，遇到此情況應立即以書面提出異議</li>
          <li>若被扣全勤獎金，留存薪資條，透過工會申訴</li>
          <li>颱風天中心要求出勤，若評估通勤有安全疑慮，<strong>可行使「退避權」拒絕出勤</strong>，雇主不得對你不利</li>
          <li>颱風假課程中斷屬不可抗力，<span className="text-[#1a6b4a] font-medium">補課不是教師義務</span>，中心不得以書信方式施壓</li>
          <li>收到要求補課的信件，建議<strong>留存備份</strong>作為日後申訴的書面證據</li>
        </ul>
      ),
      scenarios: [
        {
          id: "modal-typhoon",
          label: "舉例說明",
          title: "颱風假：中心施壓補課怎麼辦？",
          content: (
            <>
              <SituationBlock>
                颱風停班當天，中心發信要求老師留意進度，並「務必安排補課」。
              </SituationBlock>
              <WrongBlock>
                勞動部明定 <span className="warn">雇主不得強迫勞工補行工作</span>。課程進度落後責任不在老師，中心不應移轉行政責任。
              </WrongBlock>
              <CorrectBlock>
                保留信件截圖，回覆：「本次停課屬不可抗力，依勞動部給付要點，本人不負補課義務。」
              </CorrectBlock>
            </>
          )
        }
      ]
    }
  ];

  const filteredLeaves = leaves.filter(leaf => {
    if (isPrintView && selectedLeaves) {
      return selectedLeaves.includes(leaf.title);
    }
    const matchesSearch = leaf.title.toLowerCase().includes(search.toLowerCase()) || 
                          leaf.summary.toLowerCase().includes(search.toLowerCase()) ||
                          leaf.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'full') return matchesSearch && leaf.pay === '全薪';
    if (filter === 'half') return matchesSearch && leaf.pay === '半薪';
    if (filter === 'violation') return matchesSearch && leaf.tags.includes('violation');
    return matchesSearch;
  });

  return (
    <div className={cn("space-y-12 print:space-y-8", isPrintView && "space-y-6 pt-4 print:pt-0")}>
      <ScenarioModal 
        scenario={activeScenario} 
        onClose={() => setActiveScenario(null)} 
      />

      {!isPrintView && (
        <div className="flex flex-col md:flex-row gap-6 mb-16 items-center">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-ink/30 transition-colors group-focus-within:text-ink" size={14} />
            <input
              type="text"
              placeholder="搜尋規範..."
              className="w-full pl-6 pr-4 py-4 bg-transparent border-b border-ink/10 rounded-none outline-none focus:border-ink transition-all text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar w-full md:w-auto">
            <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="全部" />
            <FilterButton active={filter === 'full'} onClick={() => setFilter('full')} label="全薪假" />
            <FilterButton active={filter === 'half'} onClick={() => setFilter('half')} label="半薪假" />
            <FilterButton active={filter === 'violation'} onClick={() => setFilter('violation')} label="違法事項" />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredLeaves.length > 0 ? (
          filteredLeaves.map((leaf, index) => (
            <LeaveCard 
              key={index}
              isPrintView={isPrintView}
              title={leaf.title}
              summary={leaf.summary}
              icon={leaf.icon}
              tags={leaf.tags}
              days={leaf.days}
              pay={leaf.pay}
              law={leaf.law}
              lawCite={leaf.lawCite}
              failIssues={leaf.failIssues}
              failCite={leaf.failCite}
              actualRights={leaf.actualRights}
              scenarios={leaf.scenarios}
              onOpenScenario={setActiveScenario}
              forceOpen={isPrintView}
            >
              {leaf.children}
            </LeaveCard>
          ))
        ) : (
          <div className="text-center py-32 text-ink/20 border border-dashed border-ink/10">
            <Info size={40} className="mx-auto mb-6 opacity-20" />
            <p className="text-sm font-medium text-ink/40">沒有找到符合條件的紀錄。</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-2 rounded-none text-sm font-bold transition-all whitespace-nowrap border-b-2 cursor-pointer touch-manipulation",
        active
          ? "border-ink text-ink"
          : "border-transparent text-ink/30 hover:text-ink"
      )}
    >
      {label}
    </button>
  );
}
