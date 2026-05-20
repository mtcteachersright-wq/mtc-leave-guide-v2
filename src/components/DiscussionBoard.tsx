import React, { useState, useEffect } from 'react';
import { db, auth, googleProvider, ADMIN_EMAIL, OperationType, handleFirestoreError } from '../lib/firebase';
import { 
  collection, addDoc, deleteDoc, doc, updateDoc, query, orderBy, 
  serverTimestamp, onSnapshot, Timestamp, getDoc, setDoc
} from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { 
  MessageSquare, User as UserIcon, LogOut, Send, 
  Trash2, Pin, Star, ShieldCheck, Mail, ChevronRight,
  MessageCircle, Reply
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Post {
  id: string;
  uid: string;
  email: string;
  nick: string;
  body: string;
  isAdmin: boolean;
  pinned: boolean;
  featured: boolean;
  deleted?: boolean;
  createdAt: Timestamp;
}

interface ReplyData {
  id: string;
  uid: string;
  email: string;
  nick: string;
  body: string;
  isAdmin: boolean;
  deleted?: boolean;
  createdAt: Timestamp;
}

export default function DiscussionBoard() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [nick, setNick] = useState('');
  const [showNickModal, setShowNickModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'info' | 'error' } | null>(null);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    setIsInIframe(window.self !== window.top);

    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (currentUser.email === ADMIN_EMAIL) {
          setNick('管理員');
        } else {
          try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists() && userDoc.data().nick) {
              setNick(userDoc.data().nick);
              localStorage.setItem(`nick_${currentUser.uid}`, userDoc.data().nick);
            } else {
              const localNick = localStorage.getItem(`nick_${currentUser.uid}`);
              if (localNick) {
                setNick(localNick);
              } else {
                setNick('');
                setShowNickModal(true);
              }
            }
          } catch (e: any) {
            if (!e.message?.includes('offline') && e.code !== 'unavailable') {
              console.warn("Failed to fetch nick:", e.message);
            }
            const localNick = localStorage.getItem(`nick_${currentUser.uid}`);
            if (localNick) {
              setNick(localNick);
            } else {
              setNick('');
              setShowNickModal(true);
            }
            if (e.code === 'permission-denied' || e.message?.includes('permission')) {
              handleFirestoreError(e, OperationType.GET, `users/${currentUser.uid}`);
            }
          }
        }
      }
    });

    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubPosts = onSnapshot(q, (snap) => {
      const fetchedPosts = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Post))
        .filter(p => !p.deleted);
      setPosts(fetchedPosts);
      setLoading(false);
    }, (err) => {
      console.error("Firestore onSnapshot error:", err);
      // Don't show toast for every permission denied on load to avoid spamming the user if they're not logged in,
      // but maybe we should show an error to help them debug.
      showToast('備註：無法讀取留言，請確保資料庫權限已開放', 'error');
      setLoading(false);
      if (err.code === 'permission-denied' || err.message?.includes('permission')) {
        handleFirestoreError(err, OperationType.LIST, 'posts');
      }
    });

    return () => {
      unsubAuth();
      unsubPosts();
    };
  }, []);

  const showToast = (msg: string, type: 'info' | 'error' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const dbSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result && result.user) {
        setUser(result.user);
        showToast('登入成功');
      }
    } catch (e: any) {
      console.error("Popup login error:", e);
      if (e.code === 'auth/popup-blocked' || e.code === 'auth/popup-closed-by-user') {
        showToast('請開啟瀏覽器「快顯視窗 (Popup window)」權限或至不阻擋彈出視窗的瀏覽器開啟。', 'error');
      } else if (e.code === 'auth/unauthorized-domain') {
        showToast('該網域未授權，請至 Firebase Console 新增此網域', 'error');
      } else {
        showToast('登入失敗: ' + e.message, 'error');
      }
    }
  };

  const dbSignOut = () => {
    signOut(auth);
    showToast('已登出');
  };

  const saveNick = async () => {
    if (!nick.trim()) return;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          nick: nick,
          email: user.email,
          updatedAt: serverTimestamp()
        }, { merge: true });
        localStorage.setItem(`nick_${user.uid}`, nick);
        setShowNickModal(false);
        showToast('暱稱設定完成');
      } catch (e: any) {
        // Fallback to localStorage if offline or permission denied
        console.error(e);
        localStorage.setItem(`nick_${user.uid}`, nick);
        setShowNickModal(false);
        showToast('暱稱已暫存於本機 (離線模式)', 'info');
        if (e.code === 'permission-denied' || e.message?.includes('permission')) {
          handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`);
        }
      }
    }
  };

  const submitPost = async () => {
    if (!user) return;
    if (!newPost.trim()) return;
    try {
      await addDoc(collection(db, 'posts'), {
        uid: user.uid,
        email: user.email,
        nick: nick || user.displayName || '匿名',
        body: newPost,
        isAdmin: user.email === ADMIN_EMAIL,
        pinned: false,
        featured: false,
        createdAt: serverTimestamp()
      });
      setNewPost('');
      showToast('佈告已發佈');
    } catch (e: any) {
      showToast('發佈失敗: ' + e.message, 'error');
      if (e.code === 'permission-denied' || e.message?.includes('permission')) {
        handleFirestoreError(e, OperationType.CREATE, 'posts');
      }
    }
  };

  const featuredPosts = posts.filter(p => p.featured);
  const regularPosts = posts.filter(p => !p.featured);

  // Sorting: Pinned first
  const sortedRegularPosts = [...regularPosts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  return (
    <div className="space-y-12">
      <header className="mb-12">
        <div className="text-[10px] font-bold tracking-[0.3em] text-ink/40 mb-2 uppercase">交流討論</div>
        <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tight">討論區</h1>
      </header>

      {!user ? (
        <div className="bg-white border border-ink/10 p-8 md:p-16 rounded-xl text-center space-y-6 md:space-y-8 relative overflow-hidden">
          <div className="editorial-line-h top-0 opacity-10" />
          <div className="w-16 h-16 bg-ink text-paper rounded-full flex items-center justify-center mx-auto text-3xl">
            <MessageSquare size={24} />
          </div>
          <div className="space-y-6 max-w-lg mx-auto">
            <h3 className="font-serif text-2xl md:text-3xl font-black">需要登入</h3>
            <p className="text-xs md:text-sm text-ink/65 leading-relaxed font-light">
              為了維護討論品質並防範惡意騷擾，請使用您的 Google 帳號登入後發表意見。
            </p>
            <div className="bg-amber-50/50 border border-amber-200/60 text-amber-900 p-5 rounded-xl text-xs md:text-sm text-center leading-relaxed font-sans mx-auto max-w-md">
              <span className="font-bold block text-amber-950 mb-1">
                ⚠️ 點擊後會跳轉到 Google 登入頁面，登入後自動返回。
              </span>
              <span className="text-[11px] text-amber-800 font-medium block">
                請勿從 LINE 或其他 App 內建瀏覽器直接開啟。
              </span>
            </div>
          </div>
          <button
            onClick={dbSignIn}
            className="cursor-pointer touch-manipulation inline-flex items-center justify-center gap-4 px-8 md:px-10 py-3 md:py-4 bg-ink text-paper rounded-xl text-sm font-bold transition-all shadow-xl hover:bg-black w-full sm:w-auto"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale invert" alt="" />
            使用 Google 帳號登入
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* User Bar */}
          <div className="border-b border-ink/10 pb-8 flex items-center gap-4 md:gap-6">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-ink text-paper flex items-center justify-center font-black text-sm overflow-hidden border border-ink/20 shrink-0">
              {user.photoURL ? <img src={user.photoURL} alt="" /> : nick.slice(0, 2) || '暱'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-base md:text-lg font-serif font-black flex items-center gap-2 truncate">
                {nick || user.displayName}
                {user.email === ADMIN_EMAIL && <ShieldCheck size={14} className="text-ink shrink-0" />}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-ink/40 font-bold truncate">
                {user.email === ADMIN_EMAIL ? 'Administrator' : 'Verified Educator'} 
                <span className="ml-1 md:ml-2 opacity-50">({user.email})</span>
              </div>
            </div>
            <button
              onClick={dbSignOut}
              className="p-2 text-ink/20 hover:text-ink transition-colors cursor-pointer touch-manipulation shrink-0 flex items-center gap-1 font-bold text-xs"
              title="Logout"
            >
              <LogOut size={20} />
              登出
            </button>
          </div>

          {/* Post Compose */}
          <div className="space-y-6">
            <div className="relative">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="請輸入討論內容..."
                className="w-full min-h-[160px] p-8 bg-white border rounded-xl border-ink/10 outline-none focus:border-ink transition-all text-sm leading-relaxed"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-xs font-bold text-ink/60">
                發言身份：<strong className="text-ink">{nick || user.displayName || '匿名'}</strong>
              </div>
              <button
                disabled={!newPost.trim()}
                onClick={submitPost}
                className="px-8 py-3 bg-ink text-paper rounded-xl text-sm font-bold hover:bg-black disabled:opacity-10 transition-all font-sans"
              >
                發佈留言
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-32 text-ink/20 uppercase tracking-[0.3em] font-black text-[10px]">Loading Records...</div>
          ) : (
            <div className="space-y-16 pb-24">
              {featuredPosts.length > 0 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-bold text-ink shrink-0">精選文章</span>
                    <div className="flex-1 h-px bg-ink/10" />
                  </div>
                  <div className="space-y-8">
                    {featuredPosts.map(post => (
                      <PostCard key={post.id} post={post} currentUser={user} currentUserNick={nick} onToast={showToast} />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <span className="text-xs font-bold text-ink shrink-0">一般討論</span>
                  <div className="flex-1 h-px bg-ink/10" />
                </div>
                {sortedRegularPosts.length > 0 ? (
                  <div className="space-y-8">
                    {sortedRegularPosts.map(post => (
                      <PostCard key={post.id} post={post} currentUser={user} currentUserNick={nick} onToast={showToast} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-ink/20 border border-dashed rounded-xl border-ink/10 flex flex-col items-center gap-4">
                    <p className="text-sm font-bold text-ink/40">目前沒有討論紀錄。</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Nickname Modal */}
      <AnimatePresence>
        {showNickModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-paper border rounded-xl border-ink p-8 shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="mb-8">
                <h3 className="font-serif text-2xl font-black">設定暱稱</h3>
              </div>
              <div className="space-y-6">
                <p className="text-xs text-ink/60 leading-relaxed font-light uppercase tracking-widest">
                  請設定一個公開顯示的名稱，此名稱將作為公告欄上的發言身份。
                </p>
                <input
                  type="text"
                  maxLength={20}
                  value={nick}
                  onChange={(e) => setNick(e.target.value)}
                  placeholder="例如：熱心的老師"
                  className="w-full p-4 bg-white border rounded-xl border-ink/10 outline-none focus:border-ink transition-all font-medium text-sm"
                  autoFocus
                />
                <button
                  onClick={saveNick}
                  disabled={!nick.trim()}
                  className="w-full py-4 bg-ink text-paper rounded-xl text-sm font-bold hover:bg-black transition-colors disabled:opacity-20"
                >
                  儲存並繼續
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={cn(
              "fixed bottom-12 left-1/2 z-[2000] px-8 py-3 rounded-xl text-white text-[10px] uppercase tracking-widest font-black shadow-2xl pointer-events-none",
              toast.type === 'error' ? "bg-[#c0392b]" : "bg-ink"
            )}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface PostCardProps {
  key?: React.Key;
  post: Post;
  currentUser: User | null;
  currentUserNick: string;
  onToast: (m: string, t?: 'info' | 'error') => void;
}

function PostCard({ post, currentUser, currentUserNick, onToast }: PostCardProps) {
  const [replies, setReplies] = useState<ReplyData[]>([]);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const isAdmin = currentUser?.email === ADMIN_EMAIL;
  const isOwner = currentUser?.uid === post.uid;

  useEffect(() => {
    const q = query(collection(db, 'posts', post.id, 'replies'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setReplies(
        snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as ReplyData))
          .filter(r => !r.deleted)
      );
    }, (err) => {
      console.error("Firestore replies onSnapshot error:", err);
      if (err.code === 'permission-denied' || err.message?.includes('permission')) {
        handleFirestoreError(err, OperationType.LIST, `posts/${post.id}/replies`);
      }
    });
    return unsub;
  }, [post.id]);

  const togglePin = async () => {
    try {
      await updateDoc(doc(db, 'posts', post.id), { pinned: !post.pinned });
      onToast(post.pinned ? 'DISMISSED PIN' : 'ARTICLE PINNED');
    } catch (e: any) {
      if (e.code === 'permission-denied' || e.message?.includes('permission')) {
        handleFirestoreError(e, OperationType.UPDATE, `posts/${post.id}`);
      } else {
        throw e;
      }
    }
  };

  const toggleFeatured = async () => {
    try {
      await updateDoc(doc(db, 'posts', post.id), { featured: !post.featured });
      onToast(post.featured ? 'REMOVED FROM SELECTION' : 'ADDED TO SELECTION');
    } catch (e: any) {
      if (e.code === 'permission-denied' || e.message?.includes('permission')) {
        handleFirestoreError(e, OperationType.UPDATE, `posts/${post.id}`);
      } else {
        throw e;
      }
    }
  };

  const deletePost = async () => {
    if (!confirm('ARCHIVE THIS CONTRIBUTION?')) return;
    try {
      await updateDoc(doc(db, 'posts', post.id), { deleted: true, body: '[ CONTENT EXPUNGED ]', nick: 'DELETED USER' });
      onToast('RECORD ARCHIVED');
    } catch (e: any) {
      if (e.code === 'permission-denied' || e.message?.includes('permission')) {
        handleFirestoreError(e, OperationType.UPDATE, `posts/${post.id}`);
      } else {
        throw e;
      }
    }
  };

  const submitReply = async () => {
    if (!replyBody.trim() || !currentUser) return;
    const repNick = isAdmin ? '管理員' : (currentUserNick || currentUser.displayName || '匿名');
    try {
      await addDoc(collection(db, 'posts', post.id, 'replies'), {
        uid: currentUser.uid,
        email: currentUser.email,
        nick: repNick,
        body: replyBody,
        isAdmin: isAdmin,
        createdAt: serverTimestamp()
      });
      setReplyBody('');
      setShowReplyInput(false);
      onToast('已發佈回覆');
    } catch (e: any) {
      onToast('回覆失敗: ' + e.message, 'error');
      if (e.code === 'permission-denied' || e.message?.includes('permission')) {
        handleFirestoreError(e, OperationType.CREATE, `posts/${post.id}/replies`);
      }
    }
  };

  const deleteReply = async (rid: string) => {
    if (!confirm('ARCHIVE THIS RESPONSE?')) return;
    try {
      await updateDoc(doc(db, 'posts', post.id, 'replies', rid), { deleted: true, body: '[ RESPONSE EXPUNGED ]', nick: 'DELETED USER' });
      onToast('RESPONSE ARCHIVED');
    } catch (e: any) {
      onToast('存檔失敗: ' + e.message, 'error');
      if (e.code === 'permission-denied' || e.message?.includes('permission')) {
        handleFirestoreError(e, OperationType.UPDATE, `posts/${post.id}/replies/${rid}`);
      }
    }
  };

  return (
    <div className={cn(
      "bg-white border rounded-xl p-8 space-y-6 transition-all relative overflow-hidden",
      post.pinned ? "border-ink border-l-8" : "border-ink/10",
      post.featured && "bg-ink/5"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shrink-0 bg-ink text-paper"
          )}>
            {post.nick.slice(0, 2)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-serif text-lg font-bold">{post.nick}</span>
              {post.isAdmin && <span className="text-[10px] px-2 py-0.5 bg-admin-bg text-admin-text rounded-full font-bold">管理員</span>}
              {post.pinned && <span className="text-[10px] bg-pin-bg text-[#92610a] border border-pin-border px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Pin size={10} /> 置頂</span>}
              {post.featured && <span className="text-[10px] bg-feat-bg text-[#1a4a8a] border border-feat-border px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Star size={10} /> 精選</span>}
            </div>
            <div className="text-[10px] text-ink/30 font-bold uppercase tracking-widest mt-1">
              {post.createdAt ? formatTime(post.createdAt) : 'PUBLISHING...'}
            </div>
          </div>
        </div>
      </div>

      <div className="text-[15px] leading-relaxed text-ink/80 whitespace-pre-wrap break-words border-l-2 border-ink/10 pl-6 py-2">
        {post.body}
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-ink/5">
        <ActionButton 
          icon={<Reply size={14} />} 
          label="回覆" 
          onClick={() => setShowReplyInput(!showReplyInput)} 
        />
        {(isAdmin || (isOwner && !post.deleted)) && (
          <ActionButton 
            icon={<Trash2 size={14} />} 
            label="刪除" 
            danger 
            onClick={deletePost} 
          />
        )}
        {isAdmin && !post.deleted && (
          <>
            <ActionButton 
              icon={<Pin size={14} />} 
              label={post.pinned ? '取消置頂' : '置頂'} 
              active={post.pinned} 
              onClick={togglePin} 
            />
            <ActionButton 
              icon={<Star size={14} />} 
              label={post.featured ? '取消精選' : '精選文章'} 
              active={post.featured} 
              onClick={toggleFeatured} 
            />
          </>
        )}
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-0 md:ml-12 mt-8 space-y-6">
          {replies.map(reply => (
            <div key={reply.id} className="border-l-4 border-ink/5 pl-8 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-ink">{reply.nick}</span>
                  {reply.isAdmin && <span className="text-[10px] px-2 py-0.5 bg-admin-bg text-admin-text rounded-full font-bold">管理員</span>}
                  <span className="text-[9px] text-ink/20 font-bold tracking-widest uppercase">
                    {reply.createdAt ? formatTime(reply.createdAt) : '...'}
                  </span>
                </div>
                {isAdmin && !reply.deleted && (
                  <button onClick={() => deleteReply(reply.id)} className="text-ink/20 hover:text-[#c0392b] transition-colors">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
              <div className="text-sm text-ink/80 leading-relaxed">
                {reply.body}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Input */}
      <AnimatePresence>
        {showReplyInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pt-4"
          >
            <div className="space-y-4 max-w-2xl">
              <textarea
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="請輸入回覆內容..."
                className="w-full min-h-[100px] p-6 text-sm bg-paper rounded-xl border border-ink/10 outline-none focus:border-ink resize-none"
                autoFocus
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowReplyInput(false)}
                  className="px-6 py-2 text-xs font-bold text-ink/60 hover:text-ink transition-colors"
                >
                  取消
                </button>
                <button
                  disabled={!replyBody.trim()}
                  onClick={submitReply}
                  className="px-8 py-2 bg-ink text-paper rounded-xl text-xs font-bold hover:bg-black disabled:opacity-20 transition-all shadow-md"
                >
                  發佈回覆
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionButton({ icon, label, onClick, danger, active }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-0 py-1 text-[11px] font-bold transition-all border-b-2 border-transparent",
        danger ? "text-[#c0392b] hover:border-[#c0392b]" : 
        active ? "border-ink text-ink" : "text-ink/30 hover:text-ink hover:border-ink/20"
      )}
    >
      <span className="scale-[0.8]">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function formatTime(ts: Timestamp) {
  const date = ts.toDate();
  return date.toLocaleDateString('zh-TW', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).toUpperCase();
}

