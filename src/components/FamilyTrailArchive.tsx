import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive,
  BookHeart,
  Camera,
  FileText,
  Gamepad2,
  Headphones,
  Image as ImageIcon,
  Mic,
  Mountain,
  PawPrint,
  Plus,
  Square,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { Language } from '../types';

type CategoryId = 'old-prints' | 'trail-days' | 'discoveries' | 'table-stories' | 'mountain-views';
type MemoryKind = 'photo' | 'audio' | 'text';

interface StaticMemory {
  id: string;
  order: number;
  kind: MemoryKind;
  category: CategoryId;
  eraZh: string;
  eraEn: string;
  titleZh: string;
  titleEn: string;
  noteZh: string;
  noteEn: string;
  image?: string;
  audio?: string;
  altZh?: string;
  altEn?: string;
  referenceOnly?: boolean;
}

interface UserMemory {
  id: string;
  kind: MemoryKind;
  category: CategoryId;
  era: string;
  title: string;
  note: string;
  createdAt: number;
  blob?: Blob;
}

const DB_NAME = 'mythtrial_family_trail_archive';
const DB_VERSION = 1;
const STORE_NAME = 'memories';

const categories: Array<{
  id: 'all' | CategoryId;
  zh: string;
  en: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'all', zh: '全部记忆', en: 'All Memories', icon: Archive },
  { id: 'old-prints', zh: '旧影', en: 'Old Prints', icon: BookHeart },
  { id: 'trail-days', zh: '山行', en: 'Trail Days', icon: Mountain },
  { id: 'discoveries', zh: '沿途发现', en: 'Small Discoveries', icon: PawPrint },
  { id: 'table-stories', zh: '桌游时光', en: 'Table Stories', icon: Gamepad2 },
  { id: 'mountain-views', zh: '山景收藏', en: 'Mountain Views', icon: ImageIcon },
];

const staticMemories: StaticMemory[] = [
  {
    id: 'old-swordplay', order: 1, kind: 'photo', category: 'old-prints',
    eraZh: '旧相册 · 最早一批', eraEn: 'Old album · earliest group',
    titleZh: '把华山当作故事舞台', titleEn: 'Mount Hua as a story stage',
    noteZh: '长辈在山顶摆出侠客招式。很多年以后，我们还会模仿同样的动作。',
    noteEn: 'An older generation turned the summit into a martial-arts stage. Years later, we still repeat the pose.',
    image: '/assets/family-archive/photos/01-early-swordplay.jpg',
    altZh: '旧相册里两个人在山顶持剑摆出侠客动作', altEn: 'Old family photograph of two people posing with swords on Mount Hua',
  },
  {
    id: 'old-cliff-chain', order: 2, kind: 'photo', category: 'old-prints',
    eraZh: '旧相册 · 早年', eraEn: 'Old album · early years',
    titleZh: '抓着铁链向上', titleEn: 'Climbing beside the chain',
    noteZh: '照片已经褪色，山壁和铁链却仍然能让人想起当时的高度。',
    noteEn: 'The print has faded, but the cliff and iron chain still carry the feeling of height.',
    image: '/assets/family-archive/photos/02-early-cliff-chain.jpg',
    altZh: '一张褪色的早年华山铁链攀爬照片', altEn: 'A faded early family photograph beside a Mount Hua chain trail',
  },
  {
    id: 'first-climb-audio', order: 2.4, kind: 'audio', category: 'old-prints',
    eraZh: '口述记忆 · 示例', eraEn: 'Oral memory · sample',
    titleZh: '第一次跟家人爬华山', titleEn: 'My first Mount Hua climb with family',
    noteZh: '旧照片里的石阶和山风，好像把不同年代的我们连在了一起。',
    noteEn: 'The stone steps and mountain wind connect our family across different generations.',
    audio: '/assets/family-archive/audio/01-first-family-climb.wav',
  },
  {
    id: 'old-rock-portrait', order: 3, kind: 'photo', category: 'old-prints',
    eraZh: '旧相册 · 早年', eraEn: 'Old album · early years',
    titleZh: '坐在伸向云海的岩石上', titleEn: 'Sitting above the sea of clouds',
    noteZh: '三个人挤在同一块岩石上，留下了只有旧相册才有的颜色。',
    noteEn: 'Three family members shared one rock ledge, preserved in the unmistakable colors of an old print.',
    image: '/assets/family-archive/photos/03-early-rock-portrait.jpg',
    altZh: '三个人坐在华山伸出的岩石上合影', altEn: 'Three family members sitting on a projecting rock at Mount Hua',
  },
  {
    id: 'family-cliff-line', order: 4, kind: 'photo', category: 'old-prints',
    eraZh: '旧相册 · 较早家庭山行', eraEn: 'Old album · earlier family hike',
    titleZh: '沿着崖壁排成一列', titleEn: 'A single line along the cliff',
    noteZh: '大家贴着山壁前行，也把紧张和互相照应一起留进了照片。',
    noteEn: 'Everyone moved close to the cliff, preserving both the tension and the way the group looked after one another.',
    image: '/assets/family-archive/photos/04-family-cliff-line.jpg',
    altZh: '一组家人在华山崖壁铁链旁排成一列', altEn: 'A family group lined up beside chains on a Mount Hua cliff',
  },
  {
    id: 'game-night-text', order: 4.5, kind: 'text', category: 'table-stories',
    eraZh: '家庭文字记忆', eraEn: 'Family text memory',
    titleZh: '登山结束，故事没有结束', titleEn: 'The hike ended, but the story continued',
    noteZh: '回家以后，我们把登山时听到的《宝莲灯》故事放到桌面上。每个人选择一个角色，用卡片重新讲一次劈山救母的旅程。有人负责规则，有人坚持改变结局，最后往往是讨论比游戏更久。',
    noteEn: 'After returning home, we brought The Lotus Lantern to the table. Each person chose a role and used cards to retell the rescue journey. Someone guarded the rules, someone tried to change the ending, and the discussion usually lasted longer than the game.',
  },
  {
    id: 'game-night-audio', order: 4.6, kind: 'audio', category: 'table-stories',
    eraZh: '桌游口述记忆 · 示例', eraEn: 'Table-game oral memory · sample',
    titleZh: '故事在桌面上继续', titleEn: 'The story continues at the table',
    noteZh: '一段关于家人如何在登山后继续讲《宝莲灯》的录音。',
    noteEn: 'A short recording about retelling The Lotus Lantern together after the hike.',
    audio: '/assets/family-archive/audio/02-lotus-lantern-game-night.wav',
  },
  {
    id: 'mountain-panorama', order: 5, kind: 'photo', category: 'mountain-views',
    eraZh: '近年山行', eraEn: 'Recent family hikes',
    titleZh: '远处的花岗岩山脊', titleEn: 'Granite ridges in the distance',
    noteZh: '每次回看山脊，都会重新感受到路线的尺度。',
    noteEn: 'Looking back at the ridges restores the scale of the journey.',
    image: '/assets/family-archive/photos/05-mountain-panorama.jpg',
    altZh: '蓝天下的华山花岗岩山峰全景', altEn: 'Panoramic view of Mount Hua granite peaks under a blue sky',
  },
  {
    id: 'winter-stairs', order: 6, kind: 'photo', category: 'trail-days',
    eraZh: '近年 · 冬季山行', eraEn: 'Recent years · winter hike',
    titleZh: '一步一步向上', titleEn: 'One step at a time',
    noteZh: '冬天的石阶更冷，也更能听见一家人的脚步声。',
    noteEn: 'The winter steps felt colder, and every family footstep sounded clearer.',
    image: '/assets/family-archive/photos/06-winter-stairs.jpg',
    altZh: '穿橙色外套的人沿华山石阶向上攀登', altEn: 'A hiker in an orange jacket climbing Mount Hua stone steps',
  },
  {
    id: 'summit-ribbons', order: 7, kind: 'photo', category: 'trail-days',
    eraZh: '近年 · 山顶', eraEn: 'Recent years · summit',
    titleZh: '山顶的红色祈愿', titleEn: 'Red wishes at the summit',
    noteZh: '风把祈福带吹得很响，我们在这里停下来等齐所有人。',
    noteEn: 'The prayer ribbons snapped in the wind while we paused for the whole family to regroup.',
    image: '/assets/family-archive/photos/07-summit-ribbons.jpg',
    altZh: '华山山顶围栏上的红色祈福带', altEn: 'Red prayer ribbons tied to a Mount Hua summit railing',
  },
  {
    id: 'spring-valley', order: 8, kind: 'photo', category: 'discoveries',
    eraZh: '近年 · 春季', eraEn: 'Recent years · spring',
    titleZh: '山谷里的春天', titleEn: 'Spring in the valley',
    noteZh: '黄色和粉色的花把灰色岩壁变得很柔和。',
    noteEn: 'Yellow and pink blossoms softened the gray stone of the valley.',
    image: '/assets/family-archive/photos/08-spring-valley.jpg',
    altZh: '春天华山山谷中的黄色花朵和粉色花树', altEn: 'Yellow flowers and pink-blossoming trees in a Mount Hua valley',
  },
  {
    id: 'roujiamo-break', order: 9, kind: 'photo', category: 'discoveries',
    eraZh: '近年 · 途中休息', eraEn: 'Recent years · trail break',
    titleZh: '爬山后的肉夹馍', titleEn: 'Roujiamo after the climb',
    noteZh: '爬完山来一个肉夹馍真是惬意:）',
    noteEn: 'A roujiamo after the climb feels perfect :)',
    image: '/assets/family-archive/photos/09-roujiamo-break.jpg',
    altZh: '两只手在华山步道旁拿着肉夹馍', altEn: 'Two hands holding roujiamo beside a Mount Hua trail',
  },
  {
    id: 'orange-cat', order: 10, kind: 'photo', category: 'discoveries',
    eraZh: '近年 · 沿途偶遇', eraEn: 'Recent years · trail encounter',
    titleZh: '石头旁的小猫', titleEn: 'A cat beside the rocks',
    noteZh: '发现一只很好看的小猫咪！',
    noteEn: 'We found such a beautiful little cat!',
    image: '/assets/family-archive/photos/10-orange-white-cat.jpg',
    altZh: '石头与落叶旁的一只橘白猫', altEn: 'An orange-and-white cat beside rocks and fallen leaves',
  },
  {
    id: 'cat-audio', order: 10.2, kind: 'audio', category: 'discoveries',
    eraZh: '现场口述 · 示例', eraEn: 'Trail voice note · sample',
    titleZh: '山路边的意外伙伴', titleEn: 'An unexpected trail companion',
    noteZh: '把当时最想记住的一句话直接录下来。',
    noteEn: 'A short voice note capturing the moment before it disappears.',
    audio: '/assets/family-archive/audio/03-trail-cat-note.wav',
  },
  {
    id: 'calico-cat', order: 11, kind: 'photo', category: 'discoveries',
    eraZh: '近年 · 沿途偶遇', eraEn: 'Recent years · trail encounter',
    titleZh: '另一位山中向导', titleEn: 'Another mountain guide',
    noteZh: '它在树林里慢慢探路，像是比我们更熟悉这座山。',
    noteEn: 'It moved through the brush as if it knew the mountain better than we did.',
    image: '/assets/family-archive/photos/11-calico-cat.jpg',
    altZh: '树林和枯枝间的一只三花猫', altEn: 'A calico cat among branches and woodland plants',
  },
  {
    id: 'stair-pause', order: 12, kind: 'photo', category: 'trail-days',
    eraZh: '近年 · 山路', eraEn: 'Recent years · mountain trail',
    titleZh: '在石阶上休息一下', titleEn: 'A pause on the stone steps',
    noteZh: '走累了就坐下来拍一张，休息也成为旅程的一部分。',
    noteEn: 'A quick portrait during a rest made the pause part of the journey.',
    image: '/assets/family-archive/photos/12-stair-pause.jpg',
    altZh: '一位穿蓝色外套的人坐在华山石阶上', altEn: 'A person in a blue jacket resting on Mount Hua stone steps',
  },
  {
    id: 'red-ribbon-viewpoint', order: 13, kind: 'photo', category: 'trail-days',
    eraZh: '近年 · 观景台', eraEn: 'Recent years · viewpoint',
    titleZh: '红色祈愿带旁的合影', titleEn: 'A portrait beside the red ribbons',
    noteZh: '同一座山，每次来都会留下不一样的照片。',
    noteEn: 'The same mountain produces a different family portrait every year.',
    image: '/assets/family-archive/photos/13-red-ribbon-viewpoint.jpg',
    altZh: '一位女士站在华山红色祈福带旁的观景台', altEn: 'A woman at a Mount Hua viewpoint lined with red prayer ribbons',
  },
  {
    id: 'family-sword-pose', order: 14, kind: 'photo', category: 'trail-days',
    eraZh: '最近一次家庭山行', eraEn: 'Most recent family hike',
    titleZh: '旧动作，新照片', titleEn: 'An old pose in a new photograph',
    noteZh: '我们在“华山论剑”旁重新演了一次旧相册里的侠客游戏。',
    noteEn: 'Beside the Huashan Swordplay marker, we recreated the martial-arts play found in the old album.',
    image: '/assets/family-archive/photos/14-family-sword-pose.jpg',
    altZh: '两位家人在华山论剑石碑两侧持剑摆姿势', altEn: 'Two family members posing with swords beside the Huashan Swordplay monument',
  },
  {
    id: 'reference-ridges', order: 15, kind: 'photo', category: 'mountain-views', referenceOnly: true,
    eraZh: '本次加入 · 山景资料', eraEn: 'Added now · landscape reference',
    titleZh: '山脊路线参考', titleEn: 'Ridge-route reference',
    noteZh: '作为路线与地貌资料收录，不作为家庭照片。',
    noteEn: 'Filed as route and landscape reference rather than a family photograph.',
    image: '/assets/family-archive/photos/15-route-reference-ridges.png',
    altZh: '华山绿色山脊景观资料图', altEn: 'Reference landscape image of green Mount Hua ridges',
  },
  {
    id: 'reference-clouds', order: 16, kind: 'photo', category: 'mountain-views', referenceOnly: true,
    eraZh: '本次加入 · 山景资料', eraEn: 'Added now · landscape reference',
    titleZh: '云雾中的亭子', titleEn: 'A pavilion in the clouds',
    noteZh: '记录华山天气与光线的视觉参考。',
    noteEn: 'A visual reference for Mount Hua weather and light.',
    image: '/assets/family-archive/photos/16-route-reference-clouds.png',
    altZh: '云雾和暖色光线中的华山亭子', altEn: 'A Mount Hua pavilion surrounded by warm clouds',
  },
  {
    id: 'reference-west-peak', order: 17, kind: 'photo', category: 'mountain-views', referenceOnly: true,
    eraZh: '本次加入 · 山景资料', eraEn: 'Added now · landscape reference',
    titleZh: '西峰的尺度', titleEn: 'The scale of West Peak',
    noteZh: '帮助档案中的家庭照片与真实地貌建立对应。',
    noteEn: 'Helps connect family photographs with the mountain’s real geography.',
    image: '/assets/family-archive/photos/17-route-reference-west-peak.png',
    altZh: '从崖壁远望华山西峰的资料图', altEn: 'Reference view toward West Peak from a cliff edge',
  },
  {
    id: 'reference-granite', order: 18, kind: 'photo', category: 'mountain-views', referenceOnly: true,
    eraZh: '本次加入 · 山景资料', eraEn: 'Added now · landscape reference',
    titleZh: '花岗岩山体', titleEn: 'Granite mountain forms',
    noteZh: '补充路线中不同山体与峰顶关系的视觉记录。',
    noteEn: 'A visual record of how the route sits among the granite peaks.',
    image: '/assets/family-archive/photos/18-route-reference-granite.png',
    altZh: '华山花岗岩山体与远处山峰资料图', altEn: 'Reference image of Mount Hua granite formations and distant peaks',
  },
];

const openDatabase = () => new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onupgradeneeded = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'id' });
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const loadUserMemories = async (): Promise<UserMemory[]> => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve((request.result as UserMemory[]).sort((a, b) => a.createdAt - b.createdAt));
    request.onerror = () => reject(request.error);
  });
};

const saveUserMemory = async (memory: UserMemory) => {
  const db = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(memory);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const deleteUserMemory = async (id: string) => {
  const db = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

interface FamilyTrailArchiveProps { lang: Language; }

export const FamilyTrailArchive: React.FC<FamilyTrailArchiveProps> = ({ lang }) => {
  const zh = lang === 'zh';
  const [filter, setFilter] = useState<'all' | CategoryId>('all');
  const [composerOpen, setComposerOpen] = useState(false);
  const [kind, setKind] = useState<MemoryKind>('text');
  const [category, setCategory] = useState<CategoryId>('trail-days');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [era, setEra] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recording, setRecording] = useState(false);
  const [userMemories, setUserMemories] = useState<UserMemory[]>([]);
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});
  const [selectedPhoto, setSelectedPhoto] = useState<StaticMemory | null>(null);
  const [sessionOnly, setSessionOnly] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    loadUserMemories().then(setUserMemories).catch(() => {
      setUserMemories([]);
      setSessionOnly(true);
    });
  }, []);

  useEffect(() => {
    const next: Record<string, string> = {};
    userMemories.forEach((memory) => {
      if (memory.blob) next[memory.id] = URL.createObjectURL(memory.blob);
    });
    setMediaUrls(next);
    return () => Object.values(next).forEach((url) => URL.revokeObjectURL(url));
  }, [userMemories]);

  const visibleStatic = useMemo(
    () => staticMemories.filter((memory) => filter === 'all' || memory.category === filter).sort((a, b) => a.order - b.order),
    [filter],
  );
  const visibleUser = useMemo(
    () => userMemories.filter((memory) => filter === 'all' || memory.category === filter),
    [filter, userMemories],
  );

  const resetComposer = () => {
    setTitle(''); setNote(''); setEra(''); setPhotoFile(null); setAudioBlob(null); setKind('text');
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
    recorder.onstop = () => {
      setAudioBlob(new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' }));
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
    recorder.start();
    recorderRef.current = recorder;
    setRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  const addMemory = async () => {
    if (!title.trim() || !note.trim()) return;
    const blob = kind === 'photo' ? photoFile || undefined : kind === 'audio' ? audioBlob || undefined : undefined;
    if (kind !== 'text' && !blob) return;
    const memory: UserMemory = {
      id: `family-memory-${Date.now()}`,
      kind, category,
      era: era.trim() || (zh ? '刚刚加入' : 'Added just now'),
      title: title.trim(), note: note.trim(), createdAt: Date.now(), blob,
    };
    try {
      await saveUserMemory(memory);
    } catch {
      setSessionOnly(true);
    }
    setUserMemories((previous) => [...previous, memory]);
    resetComposer();
    setComposerOpen(false);
  };

  const removeMemory = async (id: string) => {
    try {
      await deleteUserMemory(id);
    } catch {
      setSessionOnly(true);
    }
    setUserMemories((previous) => previous.filter((memory) => memory.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0B0E11] overflow-x-hidden">
      <section className="relative border-b border-[#47BBC1]/20 overflow-hidden">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_15%_20%,rgba(71,187,193,.35),transparent_34%),radial-gradient(circle_at_85%_75%,rgba(235,195,147,.2),transparent_34%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid lg:grid-cols-[1.05fr_.95fr] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#EBC393]/40 bg-[#181A18]/80 text-[#EBC393] text-xs uppercase tracking-[.18em] font-bold">
              <Archive className="w-4 h-4" />
              <span>{zh ? '家庭记忆 · 本地档案' : 'Family Memory · Local Archive'}</span>
            </div>
            <h1 className="mt-5 text-4xl sm:text-6xl font-serif font-bold text-[#E6E9D1] leading-[1.03]">
              {zh ? '家族山迹档案' : 'Family Trail Archive'}
            </h1>
            <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-[#CBD5E1]">
              {zh
                ? '把几代人的华山旧影、近年山行、沿途发现和桌游故事放在同一条时间线上。照片记录地点，文字和声音保存当时没有被拍下来的部分。'
                : 'A shared timeline for generations of Mount Hua photographs, recent hikes, small trail discoveries, and table-game stories. Images preserve the place; text and voice preserve what the camera missed.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#94A3B8]">
              <span className="px-3 py-1.5 rounded-full border border-[#304147]">18 {zh ? '张原图' : 'original images'}</span>
              <span className="px-3 py-1.5 rounded-full border border-[#304147]">3 {zh ? '段声音' : 'voice memories'}</span>
              <span className="px-3 py-1.5 rounded-full border border-[#304147]">5 {zh ? '个子分类' : 'collections'}</span>
              <span className="px-3 py-1.5 rounded-full border border-[#304147]">{zh ? '由旧到新' : 'oldest to newest'}</span>
            </div>
            <button
              id="archive-open-composer-btn"
              onClick={() => setComposerOpen(true)}
              className="mt-6 min-h-[48px] px-5 py-3 rounded-xl bg-[#47BBC1] text-black font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-[.98] transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>{zh ? '加入一段家庭记忆' : 'Add a family memory'}</span>
            </button>
          </div>

          <div className="grid grid-cols-12 grid-rows-6 h-[360px] sm:h-[440px] gap-2.5" aria-label={zh ? '家族山迹档案照片拼贴' : 'Family Trail Archive photo collage'}>
            <img src="/assets/family-archive/photos/01-early-swordplay.jpg" alt="" className="col-span-7 row-span-3 w-full h-full object-cover rounded-2xl border border-[#EBC393]/30 sepia-[.18]" />
            <img src="/assets/family-archive/photos/14-family-sword-pose.jpg" alt="" className="col-span-5 row-span-4 w-full h-full object-cover rounded-2xl border border-[#47BBC1]/30" />
            <img src="/assets/family-archive/photos/10-orange-white-cat.jpg" alt="" className="col-span-4 row-span-3 w-full h-full object-cover rounded-2xl border border-[#47BBC1]/30" />
            <img src="/assets/family-archive/photos/09-roujiamo-break.jpg" alt="" className="col-span-3 row-span-3 w-full h-full object-cover rounded-2xl border border-[#EBC393]/30" />
            <img src="/assets/family-archive/photos/13-red-ribbon-viewpoint.jpg" alt="" className="col-span-5 row-span-2 w-full h-full object-cover rounded-2xl border border-[#EBC393]/30" />
          </div>
        </div>
      </section>

      <section className="sticky top-16 sm:top-20 z-30 bg-[#0B0E11]/95 backdrop-blur-md border-b border-[#26373D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {categories.map((item) => {
            const Icon = item.icon;
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                id={`archive-filter-${item.id}`}
                onClick={() => setFilter(item.id)}
                className={`shrink-0 min-h-[44px] px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 transition-colors ${active ? 'bg-[#132B2A] border-[#47BBC1] text-[#47BBC1]' : 'bg-[#10171B] border-[#304147] text-[#94A3B8] hover:text-[#E6E9D1]'}`}
              >
                <Icon className="w-4 h-4" />
                <span>{zh ? item.zh : item.en}</span>
              </button>
            );
          })}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {sessionOnly && (
          <div className="mb-5 rounded-xl border border-[#EBC393]/40 bg-[#EBC393]/5 px-4 py-3 text-xs leading-relaxed text-[#CBD5E1]">
            {zh ? '当前浏览器阻止了 IndexedDB，因此这次新增的记忆只会保留到页面关闭。静态家族档案不受影响；若要长期保存，请允许网站数据存储。' : 'This browser blocked IndexedDB, so newly added memories will last only for this session. The built-in family archive is unaffected. Allow site storage to keep new entries permanently.'}
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-[#EBC393] font-bold">{zh ? '记忆时间线' : 'Memory Timeline'}</p>
            <h2 className="mt-1.5 text-3xl sm:text-4xl font-serif font-bold text-[#E6E9D1]">
              {zh ? '从旧相册走到今天' : 'From old albums to today'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md sm:text-right">
            {zh ? '旧照片未保留拍摄日期，因此年代依据画面特征作大致排序，不代表精确年份。' : 'The old photographs contain no capture dates, so their order is an informed visual estimate rather than an exact chronology.'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleStatic.map((memory, index) => (
            <article key={memory.id} data-archive-memory={memory.id} data-memory-kind={memory.kind} className="rounded-2xl border border-[#304147] bg-[#0E161B] overflow-hidden shadow-xl flex flex-col min-w-0">
              {memory.image && (
                <button onClick={() => setSelectedPhoto(memory)} className="relative group text-left overflow-hidden bg-[#07110F]">
                  <img src={memory.image} alt={zh ? memory.altZh : memory.altEn} loading="lazy" className="w-full aspect-[4/3] object-cover group-hover:scale-[1.025] transition-transform duration-500" />
                  <span className="absolute left-3 top-3 min-w-[34px] h-[34px] px-2 rounded-full bg-black/75 border border-white/20 flex items-center justify-center text-xs font-mono font-bold text-white">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {memory.referenceOnly && <span className="absolute right-3 top-3 px-2.5 py-1 rounded-full bg-[#EBC393] text-black text-[10px] uppercase tracking-wider font-bold">{zh ? '资料图' : 'Reference'}</span>}
                </button>
              )}
              {memory.kind === 'audio' && (
                <div className="p-6 bg-[radial-gradient(circle_at_top_right,rgba(71,187,193,.18),transparent_50%)] border-b border-[#304147]">
                  <div className="w-12 h-12 rounded-full bg-[#132B2A] border border-[#47BBC1] flex items-center justify-center text-[#47BBC1]"><Headphones className="w-6 h-6" /></div>
                  <audio controls preload="metadata" className="w-full mt-5" src={memory.audio}>{zh ? '浏览器不支持音频播放。' : 'Your browser does not support audio playback.'}</audio>
                </div>
              )}
              {memory.kind === 'text' && (
                <div className="p-7 min-h-[190px] flex items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(235,195,147,.13),transparent_55%)] border-b border-[#304147]">
                  <FileText className="w-10 h-10 text-[#EBC393]" />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-[11px] uppercase tracking-[.14em] text-[#47BBC1] font-bold">{zh ? memory.eraZh : memory.eraEn}</div>
                <h3 className="mt-2 text-xl font-serif font-bold text-[#E6E9D1] leading-tight">{zh ? memory.titleZh : memory.titleEn}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">{zh ? memory.noteZh : memory.noteEn}</p>
              </div>
            </article>
          ))}

          {visibleUser.map((memory) => (
            <article key={memory.id} className="rounded-2xl border border-[#47BBC1]/50 bg-[#10201E] overflow-hidden shadow-xl flex flex-col">
              {memory.kind === 'photo' && mediaUrls[memory.id] && <img src={mediaUrls[memory.id]} alt={memory.title} className="w-full aspect-[4/3] object-cover" />}
              {memory.kind === 'audio' && mediaUrls[memory.id] && <div className="p-6 border-b border-[#304147]"><audio controls src={mediaUrls[memory.id]} className="w-full" /></div>}
              {memory.kind === 'text' && <div className="p-7 border-b border-[#304147]"><FileText className="w-10 h-10 text-[#47BBC1]" /></div>}
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[.14em] text-[#47BBC1] font-bold">{memory.era}</div>
                    <h3 className="mt-2 text-xl font-serif font-bold">{memory.title}</h3>
                  </div>
                  <button onClick={() => removeMemory(memory.id)} aria-label={zh ? '删除这条本地记忆' : 'Delete this local memory'} className="min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#FF766F] hover:bg-[#FF766F]/10"><Trash2 className="w-4 h-4" /></button>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">{memory.note}</p>
                <p className="mt-4 text-[11px] text-[#94A3B8]">{sessionOnly ? (zh ? '仅保留到本次页面关闭' : 'Saved for this session only') : (zh ? '仅保存在这台设备' : 'Saved only on this device')}</p>
              </div>
            </article>
          ))}
        </div>
      </main>

      {composerOpen && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center" role="dialog" aria-modal="true">
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-[#47BBC1]/50 bg-[#0E161B] shadow-2xl">
            <div className="sticky top-0 bg-[#0E161B]/95 backdrop-blur border-b border-[#304147] p-5 flex items-center justify-between z-10">
              <div>
                <p className="text-xs uppercase tracking-[.16em] text-[#47BBC1] font-bold">{zh ? '本地保存' : 'Saved locally'}</p>
                <h2 className="text-2xl font-serif font-bold mt-1">{zh ? '加入一段家庭记忆' : 'Add a family memory'}</h2>
              </div>
              <button onClick={() => { setComposerOpen(false); resetComposer(); }} className="min-w-[44px] min-h-[44px] rounded-lg border border-[#304147] flex items-center justify-center"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-3 gap-2">
                {([
                  ['text', FileText, zh ? '文字' : 'Text'],
                  ['audio', Mic, zh ? '录音' : 'Audio'],
                  ['photo', Camera, zh ? '照片' : 'Photo'],
                ] as const).map(([value, Icon, label]) => (
                  <button key={value} id={`archive-kind-${value}`} onClick={() => setKind(value)} className={`min-h-[48px] rounded-xl border flex items-center justify-center gap-2 font-bold text-sm ${kind === value ? 'border-[#47BBC1] bg-[#132B2A] text-[#47BBC1]' : 'border-[#304147] text-[#94A3B8]'}`}>
                    <Icon className="w-4 h-4" /><span>{label}</span>
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="text-sm text-[#CBD5E1]">{zh ? '子分类' : 'Collection'}
                  <select value={category} onChange={(event) => setCategory(event.target.value as CategoryId)} className="mt-2 w-full min-h-[48px] rounded-xl border border-[#304147] bg-[#0B0E11] px-3 text-[#E6E9D1]">
                    {categories.filter((item) => item.id !== 'all').map((item) => <option key={item.id} value={item.id}>{zh ? item.zh : item.en}</option>)}
                  </select>
                </label>
                <label className="text-sm text-[#CBD5E1]">{zh ? '时间标签（可以是大致年份）' : 'Time label (an approximate year is fine)'}
                  <input value={era} onChange={(event) => setEra(event.target.value)} placeholder={zh ? '例如：2024年春天' : 'For example: Spring 2024'} className="mt-2 w-full min-h-[48px] rounded-xl border border-[#304147] bg-[#0B0E11] px-3 text-[#E6E9D1]" />
                </label>
              </div>

              <label className="block text-sm text-[#CBD5E1]">{zh ? '标题' : 'Title'}
                <input id="archive-title-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder={zh ? '给这段记忆取一个名字' : 'Give this memory a name'} className="mt-2 w-full min-h-[48px] rounded-xl border border-[#304147] bg-[#0B0E11] px-3 text-[#E6E9D1]" />
              </label>

              {kind === 'photo' && (
                <label className="min-h-[140px] rounded-2xl border border-dashed border-[#47BBC1]/60 bg-[#132B2A]/40 flex flex-col items-center justify-center text-center p-5 cursor-pointer">
                  <Upload className="w-7 h-7 text-[#47BBC1]" />
                  <span className="mt-2 text-sm font-bold text-[#E6E9D1]">{photoFile ? photoFile.name : (zh ? '拍照或从相册选择' : 'Take a photo or choose from library')}</span>
                  <span className="mt-1 text-xs text-[#94A3B8]">{zh ? '图片只保存在当前设备' : 'The image remains on this device'}</span>
                  <input type="file" accept="image/*" capture="environment" onChange={(event) => setPhotoFile(event.target.files?.[0] || null)} className="sr-only" />
                </label>
              )}

              {kind === 'audio' && (
                <div className="rounded-2xl border border-[#304147] bg-[#0B0E11] p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div>
                    <p className="font-bold">{recording ? (zh ? '正在录音…' : 'Recording…') : audioBlob ? (zh ? '录音已准备好' : 'Recording ready') : (zh ? '录下一段口述记忆' : 'Record an oral memory')}</p>
                    <p className="text-xs text-[#94A3B8] mt-1">{zh ? '浏览器会询问麦克风权限，录音不会上传。' : 'The browser will request microphone access. Audio is not uploaded.'}</p>
                  </div>
                  <button onClick={recording ? stopRecording : startRecording} className={`min-h-[48px] px-5 rounded-xl font-bold flex items-center justify-center gap-2 ${recording ? 'bg-[#C04838] text-white' : 'bg-[#47BBC1] text-black'}`}>
                    {recording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    <span>{recording ? (zh ? '停止' : 'Stop') : (zh ? '开始录音' : 'Start recording')}</span>
                  </button>
                </div>
              )}

              <label className="block text-sm text-[#CBD5E1]">{kind === 'photo' ? (zh ? '照片下面的评论' : 'Comment below the photo') : (zh ? '记忆内容' : 'Memory note')}
                <textarea id="archive-note-input" value={note} onChange={(event) => setNote(event.target.value)} rows={4} placeholder={kind === 'photo' ? (zh ? '例如：发现一只很好看的小猫咪！' : 'For example: We found such a beautiful little cat!') : (zh ? '写下当时发生了什么，以及为什么想记住它。' : 'Write what happened and why you want to remember it.')} className="mt-2 w-full rounded-xl border border-[#304147] bg-[#0B0E11] p-3 text-[#E6E9D1] resize-y" />
              </label>

              <div className="rounded-xl border border-[#EBC393]/30 bg-[#EBC393]/5 p-3 text-xs leading-relaxed text-[#CBD5E1]">
                {zh ? '隐私说明：新增文字、照片和录音通过 IndexedDB 保存在当前浏览器中，不会发送到 Gemini、服务器或其他访客。清除浏览器数据会删除这些本地记忆。' : 'Privacy: new text, photos, and recordings are stored in this browser through IndexedDB. They are not sent to Gemini, a server, or other visitors. Clearing browser data removes these local memories.'}
              </div>

              <button id="archive-save-memory-btn" disabled={!title.trim() || !note.trim() || (kind === 'photo' && !photoFile) || (kind === 'audio' && !audioBlob)} onClick={addMemory} className="w-full min-h-[52px] rounded-xl bg-[#47BBC1] text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed">
                {zh ? '保存到家族山迹档案' : 'Save to Family Trail Archive'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPhoto?.image && (
        <div className="fixed inset-0 z-[90] bg-black/95 p-3 sm:p-6 flex flex-col" role="dialog" aria-modal="true">
          <div className="flex items-center justify-between gap-3 mb-3 max-w-6xl mx-auto w-full">
            <div className="min-w-0"><p className="text-xs text-[#47BBC1]">{zh ? selectedPhoto.eraZh : selectedPhoto.eraEn}</p><h2 className="font-serif font-bold truncate">{zh ? selectedPhoto.titleZh : selectedPhoto.titleEn}</h2></div>
            <button onClick={() => setSelectedPhoto(null)} className="min-w-[44px] min-h-[44px] rounded-lg border border-white/20 flex items-center justify-center"><X className="w-5 h-5" /></button>
          </div>
          <img src={selectedPhoto.image} alt={zh ? selectedPhoto.altZh : selectedPhoto.altEn} className="flex-1 min-h-0 max-w-full max-h-[78vh] object-contain mx-auto rounded-xl" />
          <p className="mt-3 max-w-3xl mx-auto text-center text-sm text-[#CBD5E1]">{zh ? selectedPhoto.noteZh : selectedPhoto.noteEn}</p>
        </div>
      )}
    </div>
  );
};
