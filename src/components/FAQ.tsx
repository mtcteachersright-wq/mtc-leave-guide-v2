import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const FAQS = [
  {
    q: "請假要自己找代課，符合法律規定嗎？",
    a: "不符合。安排代課是辦公室的行政責任，並非教師義務。不論請何種假別，只需要完成請假手續（告知理由、提供證明），找代課的事交給辦公室就好。",
    note: "依據 2026-05-14 學校公告，代課費已由中心統一辦理，老師無須另行支付代課費予代課教師。"
  },
  {
    q: "辦公室說因我們屬部分工時勞工，故喪假只有 4 天，符合法律規定嗎？",
    a: "不符合。按照法律，父母或配偶過世，法定為 8 天全薪；祖父母、子女、配偶父母之喪假為 6 天；兄弟姊妹則為 3 天。"
  },
  {
    q: "颱風假不出勤中心可以記曠職或扣薪嗎？",
    a: "不一定。若你的工作地、居住地、或上班必經路途任一縣市宣布停班，不出勤不能被記曠職、被扣全勤，也不能被強迫以事假抵充。",
    note: "颱風假後中心若要求補課，書面施壓補課皆屬違法行為。"
  },
  {
    q: "育嬰留停期間被退出勞健保，正常嗎？",
    a: "不正常，違法。育嬰留停期間有權繼續參加勞健保，若退保會喪失育嬰津貼資格。如果已經被退保，應立即向工會反映，要求補辦並追討損失。"
  },
  {
    q: "我們真的有特休嗎？中心為何從來沒提過。",
    a: "有。只要在中心任職滿 6 個月，就開始有特休。中心沒提不代表你沒有——事實上，中心至今未建立特休制度，這本身就是違法的。你可以主動要求。",
    note: "有教師於2026年4月17日申請特休假，但中心未經教師同意擅自將特休假更改為事假，屬違法行為。"
  },
  {
    q: "若特休沒休完，年底就會到期嗎？",
    a: "不會。該年度未休完的特休，雇主必須折算工資發給你，或經你同意後遞延一年（只能遞延一次）。直接歸零違法。"
  },
  {
    q: "離職時特休沒用完怎麼辦？",
    a: "離職時，所有未休完的特休都須折算成工資發放，雇主不得拒絕。建議向中心確認折算金額的計算方式。"
  },
  {
    q: "如何計算能追討多少特休折算工資？",
    a: "我們目前正在修改特休計算器的計算邏輯，未來會再釋出新版工具。折算公式為前一年學季班平均時薪 × 教學時數 x 未休天數。若對實際折算有疑問，建議直接向中心或工會確認。"
  },
  {
    q: "病假累積超過 30 天，後續病假就不支薪嗎？",
    a: "不一定。未住院的一般病假一年每年上限30 天，超過的部分不支薪。但若住院，兩年內合計最長可請 1 年，期間半薪照給。兩者需分開計算。"
  },
  {
    q: "上下班途中受傷，算工傷嗎？",
    a: "若符合職業災害認定標準的上下班交通意外，可申請工傷病假。若中心要求請普通病假，須主動確認是否符合工傷條件，差別在病假領半薪和工傷假為全薪、無天數上限。"
  },
  {
    q: "我們可以請生理假嗎？需要提供證明嗎？",
    a: "不需要。法律明定不得要求提供證明，中心也不能因此扣全勤或影響考績。每月 1 天，一年3天，超過三天列入病假計算。"
  },
  {
    q: "申請育嬰留停，中心可以拒絕嗎？",
    a: "不能。育嬰留職停薪是法定權利，子女未滿 3 歲都可以申請，最長 2 年，與年資無關。中心若以「未滿 3 年」或「需委員會審核」為由拒絕，都是違法的。"
  },
  {
    q: "我們也享有產檢假、陪產假嗎？",
    a: "這兩種假都是法定的：孕婦有 7 天全薪產檢假，配偶有 7 天全薪陪產檢及陪產假。不需要用特休或事假抵充，直接申請就好"
  },
  {
    q: "開學前十天不能請假，符合法律嗎？",
    a: "這是中心自訂的規定，但無法凌駕於法律之上。病假、喪假、婚假等法定假別，無論是否在「開學前十天」，中心都不能拒絕。"
  },
  {
    q: "補課算加班嗎？",
    a: "須視情況。若因補課導致當天實際工時超過 8 小時，超出的部分依法算加班，中心應給加班費。以「補課」名義要求無償超時工作並不合法。"
  },
  {
    q: "家庭照顧假和事假有什麼差別？",
    a: "兩種都不支薪，但家庭照顧假不能扣全勤，一般事假可以扣。家人生病或發生緊急狀況時，優先用家庭照顧假，可以維持全勤紀錄。每年 7 天，併入事假 14 天計算。",
    note: "中心目前是否有全勤制度，尚待釐清。"
  }
];

export default function FAQ({ isPrintView = false }: { isPrintView?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.preventDefault();
    navigator.clipboard.writeText(text);
    setToast(`已複製 ${text}，可前往信箱寄送郵件`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className={cn("space-y-12 max-w-4xl mx-auto", isPrintView && "space-y-8")}>
      {!isPrintView && (
        <header className="mb-16">
          <div className="text-xs font-bold tracking-widest text-ink/40 mb-2">常見問題</div>
          <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tight">問答集</h1>
        </header>
      )}

      <div className="space-y-0 border-t border-ink print:border-t-2 print:border-black">
        {FAQS.map((faq, idx) => {
          const _isOpen = isPrintView || openIndex === idx;
          return (
            <div key={idx} className="border-b border-ink/10 group print:border-b-2 print:border-black/5 break-inside-avoid">
              <button
                onClick={() => !isPrintView && setOpenIndex(openIndex === idx ? null : idx)}
                className={cn("w-full flex items-baseline justify-between py-8 px-4 md:px-8 text-left transition-colors group-hover:bg-ink/5", !isPrintView && "cursor-pointer", "print:py-4 print:px-0")}
              >
                <div className="flex gap-6 md:gap-8 items-baseline">
                  <span className="font-serif text-ink/20 text-2xl font-black print:text-black/30">{idx + 1}</span>
                  <span className="font-serif text-xl font-bold text-ink leading-relaxed pr-4 md:pr-8 print:text-black print:text-lg">{faq.q}</span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={cn("text-ink/30 shrink-0 transition-transform duration-500 print:hidden", _isOpen && "rotate-180")} 
                />
              </button>
              
              <AnimatePresence initial={!isPrintView}>
                {_isOpen && (
                  <motion.div
                    initial={isPrintView ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={isPrintView ? false : { height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-10 pl-16 md:pl-20 pr-12 md:pr-16 text-sm text-ink/70 leading-loose font-light print:pl-12 print:pr-0 print:pb-6 print:text-black">
                      <div className="max-w-2xl font-medium space-y-4 print:font-normal">
                        <p>{faq.a}</p>
                        {faq.note && (
                          <div className="bg-blue-light border-l-4 border-blue-mid p-3 text-xs text-ink/80 rounded-r-md print:bg-gray-50 print:border-black/20" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                            📢 {faq.note}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {!isPrintView && (
        <>
          <div className="mt-24 p-12 bg-ink text-paper rounded-xl text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/10" />
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest opacity-60 font-bold">支援管道</p>
              <h3 className="font-serif text-3xl font-bold">還有其他問題嗎？</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <button 
                onClick={(e) => handleCopy(e, 'mtc.teachers.right@gmail.com')}
                className="px-8 py-3 bg-paper text-ink rounded-xl text-sm font-bold hover:bg-white transition-all shadow-xl cursor-pointer"
              >
                複製 Email
              </button>
              <a 
                href="tel:1955"
                className="px-8 py-3 bg-transparent border rounded-xl border-paper/20 hover:border-paper text-paper text-sm font-bold transition-all"
              >
                勞工諮詢專線 1955
              </a>
            </div>
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
        </>
      )}
    </div>
  );
}
