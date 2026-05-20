import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, Calculator, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Semester {
  key: string;
  label: string;
  months: number[];
  optional?: boolean;
}

const SEMESTERS: Semester[] = [
  { key: 'spring', label: '春季班', months: [3, 4, 5] },
  { key: 'summer', label: '夏季班', months: [6, 7, 8] },
  { key: 'summer2', label: '暑期班', months: [7, 8], optional: true },
  { key: 'fall', label: '秋季班', months: [9, 10, 11] },
  { key: 'winter', label: '冬季班', months: [12, 1, 2] },
];

interface LeavePeriod {
  id: number;
  start: string;
  end: string;
  type: string;
}

interface YearSalaryData {
  [semKey: string]: {
    skip?: boolean;
    hasRaise?: boolean;
    rate?: number;
    hours?: number;
    raiseMonth?: number;
    rateBefore?: number;
    hoursBefore?: number;
    rateAfter?: number;
    hoursAfter?: number;
  };
}

export default function LeaveCalculator() {
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState('');
  const [leavePeriods, setLeavePeriods] = useState<LeavePeriod[]>([]);
  const [salaries, setSalaries] = useState<{ [year: number]: YearSalaryData }>({});
  const [openYear, setOpenYear] = useState<number | null>(currentYear - 1);
  const [result, setResult] = useState<any>(null);

  const recentYears = Array.from({ length: 5 }, (_, i) => currentYear - 5 + i);

  useEffect(() => {
    // Initialize salaries for the last 5 years
    const initialSalaries: { [year: number]: YearSalaryData } = {};
    recentYears.forEach(y => {
      initialSalaries[y] = {};
    });
    setSalaries(initialSalaries);
  }, []);

  const addLeaveBlock = () => {
    setLeavePeriods([...leavePeriods, { id: Date.now(), start: '', end: '', type: 'parental' }]);
  };

  const removeLeaveBlock = (id: number) => {
    setLeavePeriods(leavePeriods.filter(p => p.id !== id));
  };

  const updateSalary = (year: number, semKey: string, data: any) => {
    setSalaries(prev => ({
      ...prev,
      [year]: {
        ...prev[year],
        [semKey]: { ...prev[year]?.[semKey], ...data }
      }
    }));
  };

  const calculateMonthly = (year: number, sem: Semester) => {
    const data = salaries[year]?.[sem.key];
    if (!data || data.skip) return null;

    if (data.hasRaise) {
      if (!data.rateBefore || !data.hoursBefore || !data.rateAfter || !data.hoursAfter || !data.raiseMonth) return null;
      const before = Math.round(data.rateBefore * data.hoursBefore * 20);
      const after = Math.round(data.rateAfter * data.hoursAfter * 20);
      const raiseIdx = sem.months.indexOf(Number(data.raiseMonth));
      const monthsBefore = raiseIdx >= 0 ? raiseIdx : 0;
      const monthsAfter = sem.months.length - monthsBefore;
      return Math.round((before * monthsBefore + after * monthsAfter) / sem.months.length);
    } else {
      if (!data.rate || !data.hours) return null;
      return Math.round(data.rate * data.hours * 20);
    }
  };

  const calculateYearlyAvg = (year: number) => {
    const monthSalary: { [month: number]: number } = {};
    let hasAny = false;

    SEMESTERS.forEach(s => {
      const monthly = calculateMonthly(year, s);
      if (monthly === null) return;
      hasAny = true;
      s.months.forEach(m => {
        monthSalary[m] = (monthSalary[m] || 0) + monthly;
      });
    });

    const vals = Object.values(monthSalary);
    if (!hasAny || vals.length === 0) return null;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  const getAnnualLeave = (seniority: number) => {
    if (seniority < 0.5) return 0;
    if (seniority < 1) return 3;
    if (seniority < 2) return 7;
    if (seniority < 3) return 10;
    if (seniority < 5) return 14;
    if (seniority < 10) return 15;
    const extra = Math.floor(seniority) - 10;
    return Math.min(15 + extra + 1, 30);
  };

  const monthsBetween = (a: Date, b: Date) => {
    return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  };

  const runCalculation = () => {
    if (!startDate) {
      alert('請填入到職年月');
      return;
    }

    const [sy, sm] = startDate.split('-').map(Number);
    const startD = new Date(sy, sm - 1, 1);

    const calcLeavePeriods = leavePeriods
      .filter(p => p.type !== 'counted' && p.start && p.end)
      .map(p => {
        const [sY, sM] = p.start.split('-').map(Number);
        const [eY, eM] = p.end.split('-').map(Number);
        return { start: new Date(sY, sM - 1, 1), end: new Date(eY, eM - 1, 1) };
      });

    const yearlySalaries: { [year: number]: number } = {};
    recentYears.forEach(y => {
      const avg = calculateYearlyAvg(y);
      if (avg) yearlySalaries[y] = avg;
    });

    const rows = [];
    let totalDays = 0;
    let totalAmount = 0;

    recentYears.forEach(yr => {
      const endOfYear = new Date(yr, 11, 31);
      if (startD > endOfYear) return;

      // Effective seniority
      let totalMonths = monthsBetween(startD, endOfYear);
      if (totalMonths < 0) totalMonths = 0;
      calcLeavePeriods.forEach(lp => {
        const overlapStart = lp.start > startD ? lp.start : startD;
        const overlapEnd = lp.end < endOfYear ? lp.end : endOfYear;
        if (overlapEnd > overlapStart) {
          totalMonths -= monthsBetween(overlapStart, overlapEnd);
        }
      });
      const seniority = Math.max(0, totalMonths / 12);
      const annualDays = getAnnualLeave(seniority);
      if (annualDays === 0) return;

      // Find best salary (current or previous or next)
      let salary = yearlySalaries[yr];
      if (!salary) {
        for (let y = yr - 1; y >= yr - 5; y--) if (yearlySalaries[y]) { salary = yearlySalaries[y]; break; }
        if (!salary) for (let y = yr + 1; y <= yr + 5; y++) if (yearlySalaries[y]) { salary = yearlySalaries[y]; break; }
      }

      const amount = salary ? Math.round((salary / 30) * annualDays) : 0;
      rows.push({ year: yr, seniority, annualDays, salary, amount });
      totalDays += annualDays;
      totalAmount += amount;
    });

    setResult({ rows, totalDays, totalAmount });
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="space-y-16">
      <header className="mb-16">
        <div className="text-xs font-bold text-ink/40 mb-2">特休結算</div>
        <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tight">特休薪資試算器</h1>
      </header>

      <div className="space-y-12">
        {/* Step 1 */}
        <div className="bg-white border border-ink/10 rounded-none overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-ink" />
          <div className="bg-paper px-8 py-6 border-b border-ink/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-serif text-2xl font-black opacity-20">01</span>
              <h3 className="text-[13px] font-bold tracking-widest">基本就業資料</h3>
            </div>
            <Info size={14} className="text-ink/20" />
          </div>
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-xs font-bold text-ink mb-4">到職年月 — {startDate || "尚未設定"}</label>
              <input
                type="month"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full sm:w-80 p-4 bg-transparent border border-ink/10 rounded-none outline-none focus:border-ink transition-all text-sm font-bold uppercase tracking-widest"
              />
            </div>
            <div className="flex gap-4 p-6 bg-ink text-paper text-[11px] leading-relaxed serif italic">
              <Info size={16} className="shrink-0 mt-0.5 opacity-50" />
              <p>特休以週年制計算，年資自實際到職日起算。滿 10 年為 16 天，之後每年加 1 天，上限 30 天。</p>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white border border-ink/10 rounded-none overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-ink/20 group-hover:bg-ink transition-colors" />
          <div className="bg-paper px-8 py-6 border-b border-ink/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-serif text-2xl font-black opacity-20">02</span>
              <h3 className="text-[13px] font-bold tracking-widest">留職停薪紀錄</h3>
            </div>
          </div>
          <div className="p-8 space-y-8">
            <p className="text-xs text-ink/60 leading-relaxed font-light uppercase tracking-widest">
              若曾請育嬰留停、長期病假留停等，該期間不併入年資計算。
            </p>
            
            <div className="space-y-6">
              {leavePeriods.map((p) => (
                <div key={p.id} className="p-8 bg-paper border border-ink/10 rounded-none relative">
                  <button
                    onClick={() => removeLeaveBlock(p.id)}
                    className="absolute top-4 right-4 text-ink/20 hover:text-red-700 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
                    <div>
                      <label className="block text-[9px] font-black text-ink/40 uppercase tracking-widest mb-2">Commencement</label>
                      <input
                        type="month"
                        value={p.start}
                        onChange={(e) => {
                          const newPeriods = [...leavePeriods];
                          const idx = newPeriods.findIndex(x => x.id === p.id);
                          newPeriods[idx].start = e.target.value;
                          setLeavePeriods(newPeriods);
                        }}
                        className="w-full p-4 bg-white border border-ink/10 rounded-none outline-none text-xs font-bold uppercase tracking-widest"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-ink/40 uppercase tracking-widest mb-2">Termination</label>
                      <input
                        type="month"
                        value={p.end}
                        onChange={(e) => {
                          const newPeriods = [...leavePeriods];
                          const idx = newPeriods.findIndex(x => x.id === p.id);
                          newPeriods[idx].end = e.target.value;
                          setLeavePeriods(newPeriods);
                        }}
                        className="w-full p-4 bg-white border border-ink/10 rounded-none outline-none text-xs font-bold uppercase tracking-widest"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-ink/40 uppercase tracking-widest mb-2">Leave Category</label>
                    <select
                      value={p.type}
                      onChange={(e) => {
                        const newPeriods = [...leavePeriods];
                        const idx = newPeriods.findIndex(x => x.id === p.id);
                        newPeriods[idx].type = e.target.value;
                        setLeavePeriods(newPeriods);
                      }}
                      className="w-full p-4 bg-white border border-ink/10 rounded-none outline-none text-xs font-bold uppercase tracking-widest"
                    >
                      <optgroup label="DENIED SENIORITY">
                        <option value="parental">育嬰留職停薪</option>
                        <option value="sick">普通傷病假留職停薪</option>
                        <option value="other_no">其他留職停薪</option>
                      </optgroup>
                      <optgroup label="GRANTED SENIORITY">
                        <option value="counted">產假、婚假、喪假等</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addLeaveBlock}
              className="w-full py-6 border border-dashed border-ink/20 rounded-none text-ink/40 text-[10px] font-black uppercase tracking-[0.3em] hover:border-ink hover:text-ink transition-all flex items-center justify-center gap-3"
            >
              <Plus size={14} /> Register Leave Period
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white border border-ink/10 rounded-none overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-ink/20 group-hover:bg-ink transition-colors" />
          <div className="bg-paper px-8 py-6 border-b border-ink/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-serif text-2xl font-black opacity-20">03</span>
              <h3 className="text-[13px] font-bold tracking-widest">過去 5 年薪資紀錄</h3>
            </div>
          </div>
          <div className="p-8">
            <div className="mb-12 bg-ink/5 p-8 border-l-4 border-ink space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-ink/40 mb-2">Algorithm</p>
              <p className="text-sm italic serif text-ink">
                鐘點費 × 每日時數 × 20天 = 當期月薪。
              </p>
              <p className="text-[10px] uppercase font-medium tracking-tighter opacity-60">
                Data points should be precise. Combine overlapping sessions (July/August).
              </p>
            </div>

            <div className="space-y-4">
              {recentYears.reverse().map(year => (
                <div key={year} className="border border-ink/10 rounded-none overflow-hidden">
                  <button
                    onClick={() => setOpenYear(openYear === year ? null : year)}
                    className="w-full flex items-center justify-between px-8 py-6 bg-paper hover:bg-white transition-colors"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-serif italic text-2xl font-black">{year}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-20">FY RECORD</span>
                    </div>
                    <div className="flex items-center gap-8">
                      {calculateYearlyAvg(year) && (
                        <span className="text-[11px] font-black tracking-widest text-ink italic serif">
                          AVG: ${calculateYearlyAvg(year)?.toLocaleString()}
                        </span>
                      )}
                      <ChevronDown size={14} className={cn("text-ink/30 transition-transform duration-500", openYear === year && "rotate-180")} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {openYear === year && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-8 space-y-6 bg-white border-t border-ink/10">
                          {SEMESTERS.map(sem => {
                            const data = salaries[year]?.[sem.key] || {};
                            return (
                              <div key={sem.key} className="p-8 bg-paper border border-ink/5 rounded-none group/sem">
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                  <div className="flex flex-col">
                                    <span className="serif text-xl font-bold italic tracking-tight">{sem.label}</span>
                                    <span className="text-[9px] font-black text-ink/30 uppercase tracking-[0.2em]">{sem.months.join(' · ')} MONTHS</span>
                                  </div>
                                  <div className="flex items-center gap-8">
                                    {sem.optional && (
                                      <label className="flex items-center gap-2 cursor-pointer select-none group/opt">
                                        <input
                                          type="checkbox"
                                          checked={!!data.skip}
                                          onChange={(e) => updateSalary(year, sem.key, { skip: e.target.checked })}
                                          className="w-4 h-4 rounded-none accent-ink border-ink/20"
                                        />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-ink/40 group-hover/opt:text-ink transition-colors">Inactive</span>
                                      </label>
                                    )}
                                    <label className="flex items-center gap-2 cursor-pointer select-none group/raise">
                                      <input
                                        type="checkbox"
                                        disabled={!!data.skip}
                                        checked={!!data.hasRaise}
                                        onChange={(e) => updateSalary(year, sem.key, { hasRaise: e.target.checked })}
                                        className="w-4 h-4 rounded-none accent-ink border-ink/20"
                                      />
                                      <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", data.skip ? "text-ink/10" : "text-ink/40 group-hover/raise:text-ink")}>Adjusted</span>
                                    </label>
                                  </div>
                                </div>

                                {!data.skip && (
                                  <div className="space-y-8">
                                    {data.hasRaise ? (
                                      <>
                                        <div className="flex items-center gap-4 py-2 border-b border-ink/10">
                                          <div className="text-[10px] font-black uppercase tracking-widest text-ink/40">Effective Month:</div>
                                          <select
                                            value={data.raiseMonth || sem.months[1]}
                                            onChange={(e) => updateSalary(year, sem.key, { raiseMonth: Number(e.target.value) })}
                                            className="p-1 px-4 text-[10px] font-black bg-white border border-ink/10 rounded-none uppercase tracking-widest"
                                          >
                                            {sem.months.map(m => <option key={m} value={m}>{m}月</option>)}
                                          </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                          <SalaryInput label="Rate (Pre)" value={data.rateBefore} onChange={val => updateSalary(year, sem.key, { rateBefore: val })} />
                                          <SalaryInput label="Load (Pre)" value={data.hoursBefore} onChange={val => updateSalary(year, sem.key, { hoursBefore: val })} />
                                          <SalaryInput label="Rate (Post)" value={data.rateAfter} onChange={val => updateSalary(year, sem.key, { rateAfter: val })} />
                                          <SalaryInput label="Load (Post)" value={data.hoursAfter} onChange={val => updateSalary(year, sem.key, { hoursAfter: val })} />
                                        </div>
                                      </>
                                    ) : (
                                      <div className="grid grid-cols-2 gap-8">
                                        <SalaryInput label="Hourly Rate ($/HR)" value={data.rate} onChange={val => updateSalary(year, sem.key, { rate: val })} />
                                        <SalaryInput label="Daily Load (HRS)" value={data.hours} onChange={val => updateSalary(year, sem.key, { hours: val })} />
                                      </div>
                                    )}
                                    {calculateMonthly(year, sem) !== null && (
                                      <div className="text-right pt-4 border-t border-ink/5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-ink/20 mr-4">ESTIMATED MONTHLY</span>
                                        <span className="text-lg font-black serif italic">${calculateMonthly(year, sem)?.toLocaleString()}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={runCalculation}
        className="w-full py-8 bg-ink text-paper rounded-none font-serif text-2xl md:text-3xl font-black hover:bg-black transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-4 group"
      >
        <Calculator size={28} className="opacity-40 group-hover:opacity-100 transition-opacity" /> 
        系統試算
      </button>

      {result && (
        <div id="results-section" className="bg-white border-2 border-ink rounded-none overflow-hidden shadow-2xl mt-24 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
          <div className="editorial-line-h top-0 opacity-10" />
          <div className="bg-ink text-paper px-10 py-10 flex flex-col md:flex-row items-baseline justify-between gap-4">
            <h3 className="font-serif text-3xl font-black">試算結果</h3>
            <span className="text-sm font-bold opacity-40">年份區間：{recentYears[0]} — {recentYears[recentYears.length-1]}</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-paper text-ink border-b border-ink">
                <tr>
                  <th className="px-10 py-6 text-left text-xs font-bold tracking-widest">年度</th>
                  <th className="px-10 py-6 text-left text-xs font-bold tracking-widest">年資</th>
                  <th className="px-10 py-6 text-right text-xs font-bold tracking-widest">應有特休天數</th>
                  <th className="px-10 py-6 text-right text-xs font-bold tracking-widest">折算工資估計</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {result.rows.map((r: any) => (
                  <tr key={r.year} className="group hover:bg-ink/5 transition-colors">
                    <td className="px-10 py-8 font-serif text-xl font-black">{r.year} 年</td>
                    <td className="px-10 py-8">
                      <div className="text-xs font-bold text-ink/80">
                        {Math.floor(r.seniority)}年 {Math.round((r.seniority % 1) * 12)}個月
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="font-serif text-2xl font-black">{r.annualDays} <span className="text-sm tracking-widest opacity-40">天</span></div>
                    </td>
                    <td className="px-10 py-8 text-right bg-paper/50">
                      <div className="font-serif text-2xl font-black text-ink">
                        ${r.amount.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-ink/40 font-bold mt-1">
                        月薪估算：${r.salary?.toLocaleString() || 0}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-ink text-paper">
                <tr>
                  <td colSpan={2} className="px-10 py-12">
                    <div className="text-sm font-bold opacity-60 mb-2">未折算總金額估計</div>
                    <div className="font-serif text-2xl font-black">累計應追討金額</div>
                  </td>
                  <td colSpan={2} className="px-10 py-12 text-right">
                    <div className="text-xs text-paper/60 mb-2 font-bold tracking-widest">累積未休 {result.totalDays} 天</div>
                    <div className="text-5xl font-serif font-black leading-none tracking-tight">
                      ${result.totalAmount.toLocaleString()}
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="p-10 bg-white border-t border-ink/10">
            <div className="flex gap-6 text-ink/70 text-xs leading-relaxed max-w-3xl font-medium">
              <AlertTriangle size={24} className="shrink-0 text-red-700 opacity-60" />
              <div>
                <strong className="tracking-widest font-black text-ink text-sm block mb-2">免責聲明</strong>
                本計算結果僅供參考，不代表官方正式金額或法律意見。實際可追討金額因個人授課時數、年資細節、已請假紀錄等因素而異。建議盡快透過工會正式協商追討。
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SalaryInput({ label, value, onChange }: { label: string, value?: number, onChange: (val: number) => void }) {
  return (
    <div className="group/field">
      <label className="block text-[9px] font-black text-ink/30 mb-2 uppercase tracking-widest group-focus-within/field:text-ink transition-colors">{label}</label>
      <input
        type="number"
        value={value || ''}
        placeholder="0.00"
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full p-0 py-4 bg-transparent border-b border-ink/10 rounded-none outline-none focus:border-ink transition-all text-lg font-black serif italic placeholder:opacity-10"
      />
    </div>
  );
}
