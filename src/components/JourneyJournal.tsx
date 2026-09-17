import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  Check,
  ImagePlus,
  Mic,
  NotebookPen,
  Save,
  ShieldCheck,
  Square,
  Trash2,
} from 'lucide-react';
import { Language } from '../types';

type CaptureMode = 'text' | 'voice' | 'photo';

interface JourneyJournalProps {
  checkpointId: number;
  locationTitle: string;
  lang: Language;
}

interface StoredJournalEntry {
  key: string;
  value: string | Blob;
  updatedAt: number;
}

const DB_NAME = 'mythtrial-journey-journal';
const STORE_NAME = 'entries';
const DB_VERSION = 1;

const entryKey = (checkpointId: number, kind: CaptureMode) => `${checkpointId}:${kind}`;

const openJournalDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is unavailable'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open the journey journal'));
  });

const readEntry = async (key: string): Promise<string | Blob | null> => {
  const db = await openJournalDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).get(key);
    request.onsuccess = () => resolve((request.result as StoredJournalEntry | undefined)?.value ?? null);
    request.onerror = () => reject(request.error ?? new Error('Could not read the journey journal'));
    transaction.oncomplete = () => db.close();
  });
};

const writeEntry = async (key: string, value: string | Blob): Promise<void> => {
  const db = await openJournalDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put({ key, value, updatedAt: Date.now() } satisfies StoredJournalEntry);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not save the journey journal'));
  });
};

const deleteEntry = async (key: string): Promise<void> => {
  const db = await openJournalDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).delete(key);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not delete the journey journal entry'));
  });
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remaining = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remaining}`;
};

export const JourneyJournal: React.FC<JourneyJournalProps> = ({ checkpointId, locationTitle, lang }) => {
  const [mode, setMode] = useState<CaptureMode>('text');
  const [note, setNote] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const zh = lang === 'zh';

  useEffect(() => {
    let cancelled = false;
    setStatus('');
    setError('');
    setNote('');
    setAudioBlob(null);
    setPhotoBlob(null);

    Promise.all([
      readEntry(entryKey(checkpointId, 'text')),
      readEntry(entryKey(checkpointId, 'voice')),
      readEntry(entryKey(checkpointId, 'photo')),
    ])
      .then(([savedText, savedAudio, savedPhoto]) => {
        if (cancelled) return;
        setNote(typeof savedText === 'string' ? savedText : '');
        setAudioBlob(savedAudio instanceof Blob ? savedAudio : null);
        setPhotoBlob(savedPhoto instanceof Blob ? savedPhoto : null);
      })
      .catch(() => {
        if (!cancelled) {
          setError(zh ? '此浏览器无法读取设备上的旅途记录。' : 'This browser could not read your on-device journal.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [checkpointId, zh]);

  useEffect(() => {
    if (!audioBlob) {
      setAudioUrl(null);
      return;
    }
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [audioBlob]);

  useEffect(() => {
    if (!photoBlob) {
      setPhotoUrl(null);
      return;
    }
    const url = URL.createObjectURL(photoBlob);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photoBlob]);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    },
    [],
  );

  const showSaved = (message: string) => {
    setError('');
    setStatus(message);
    window.setTimeout(() => setStatus(''), 2400);
  };

  const saveNote = async () => {
    try {
      await writeEntry(entryKey(checkpointId, 'text'), note.trim());
      showSaved(zh ? '文字记录已保存在此设备' : 'Text note saved on this device');
    } catch {
      setError(zh ? '文字记录保存失败，请重试。' : 'Could not save the text note. Please try again.');
    }
  };

  const startRecording = async () => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError(zh ? '当前浏览器不支持录音，请使用文字或照片记录。' : 'Audio recording is not supported here. Try a text note or photo.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const preferredType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : '';
      const recorder = new MediaRecorder(stream, preferredType ? { mimeType: preferredType } : undefined);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        if (timerRef.current) window.clearInterval(timerRef.current);
        timerRef.current = null;
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setIsRecording(false);
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        if (blob.size === 0) return;
        setAudioBlob(blob);
        try {
          await writeEntry(entryKey(checkpointId, 'voice'), blob);
          showSaved(zh ? '语音记录已保存在此设备' : 'Voice note saved on this device');
        } catch {
          setError(zh ? '录音已完成，但未能保存在设备上。' : 'Recording finished, but it could not be saved on this device.');
        }
      };

      recorder.start();
      setRecordingSeconds(0);
      setIsRecording(true);
      timerRef.current = window.setInterval(() => setRecordingSeconds((value) => value + 1), 1000);
    } catch {
      setError(zh ? '未获得麦克风权限。你仍然可以使用文字或照片记录。' : 'Microphone access was not granted. You can still use text or photo.');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
  };

  const removeAudio = async () => {
    try {
      await deleteEntry(entryKey(checkpointId, 'voice'));
      setAudioBlob(null);
      showSaved(zh ? '语音记录已删除' : 'Voice note removed');
    } catch {
      setError(zh ? '无法删除语音记录，请重试。' : 'Could not remove the voice note.');
    }
  };

  const handlePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError(zh ? '请选择照片文件。' : 'Please choose an image file.');
      return;
    }
    setPhotoBlob(file);
    try {
      await writeEntry(entryKey(checkpointId, 'photo'), file);
      showSaved(zh ? '照片已保存在此设备' : 'Photo saved on this device');
    } catch {
      setError(zh ? '照片无法保存在设备上，请重试。' : 'Could not save the photo on this device.');
    } finally {
      event.target.value = '';
    }
  };

  const removePhoto = async () => {
    try {
      await deleteEntry(entryKey(checkpointId, 'photo'));
      setPhotoBlob(null);
      showSaved(zh ? '照片记录已删除' : 'Photo removed');
    } catch {
      setError(zh ? '无法删除照片，请重试。' : 'Could not remove the photo.');
    }
  };

  const captureModes: Array<{
    id: CaptureMode;
    label: string;
    icon: React.ReactNode;
    hasEntry: boolean;
  }> = [
    { id: 'text', label: zh ? '文字' : 'Text', icon: <NotebookPen className="h-4 w-4" />, hasEntry: note.trim().length > 0 },
    { id: 'voice', label: zh ? '录音' : 'Voice', icon: <Mic className="h-4 w-4" />, hasEntry: Boolean(audioBlob) },
    { id: 'photo', label: zh ? '拍照' : 'Photo', icon: <Camera className="h-4 w-4" />, hasEntry: Boolean(photoBlob) },
  ];

  return (
    <section className="rounded-2xl border border-[#47BBC1]/30 bg-[#10191E] overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-[#2A3B42] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[#EBC393] font-bold">
            <NotebookPen className="h-5 w-5 text-[#47BBC1]" />
            <h3>{zh ? '记录此刻' : 'Save This Moment'}</h3>
          </div>
          <p className="mt-1 text-sm text-[#AEBCC1]">
            {zh
              ? `为「${locationTitle}」留下文字、声音或照片。`
              : `Keep a thought, a voice note, or a photo from ${locationTitle}.`}
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs text-[#8FA8A8]">
          <ShieldCheck className="h-4 w-4 text-[#47BBC1]" />
          <span>{zh ? '仅保存在此设备' : 'Stored only on this device'}</span>
        </div>
      </div>

      <div className="p-3 sm:p-5">
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl border border-[#2B3B41] bg-[#0B1216]" role="tablist">
          {captureModes.map((item) => (
            <button
              key={item.id}
              id={`journal-mode-${item.id}`}
              type="button"
              role="tab"
              aria-selected={mode === item.id}
              onClick={() => {
                setMode(item.id);
                setError('');
                setStatus('');
              }}
              className={`relative min-h-[46px] rounded-lg px-2 sm:px-4 flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                mode === item.id
                  ? 'bg-[#173033] border border-[#47BBC1] text-[#A9F0ED] shadow-[0_0_14px_rgba(71,187,193,.12)]'
                  : 'border border-transparent text-[#94A3B8] hover:text-[#E6E9D1] hover:bg-[#121D22]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.hasEntry && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#EBC393]" aria-label={zh ? '已有记录' : 'Saved'} />}
            </button>
          ))}
        </div>

        <div className="mt-4 min-h-[220px]">
          {mode === 'text' && (
            <div>
              <label htmlFor={`journey-note-${checkpointId}`} className="block text-sm font-medium text-[#CBD5E1] mb-2">
                {zh ? '你想记住什么？' : 'What would you like to remember?'}
              </label>
              <textarea
                id={`journey-note-${checkpointId}`}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={5}
                maxLength={1200}
                placeholder={zh ? '写下眼前的景色、同行的人，或这段故事带来的感受…' : 'Write about the view, the people with you, or what this part of the story made you feel…'}
                className="w-full resize-y rounded-xl border border-[#35505A] bg-[#0A1115] px-4 py-3 text-base leading-relaxed text-[#E6E9D1] placeholder:text-[#607078] focus:outline-none focus:ring-2 focus:ring-[#47BBC1]/50 focus:border-[#47BBC1]"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs text-[#73858C]">{note.length} / 1200</span>
                <button
                  id="save-journey-note"
                  type="button"
                  onClick={saveNote}
                  className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#47BBC1] text-[#061012] font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-[.98]"
                >
                  <Save className="h-4 w-4" />
                  <span>{zh ? '保存文字' : 'Save Note'}</span>
                </button>
              </div>
            </div>
          )}

          {mode === 'voice' && (
            <div className="rounded-xl border border-[#33474E] bg-[#0C1418] p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-[#E6E9D1]">{zh ? '留下沿途的声音' : 'Capture the sound of the journey'}</p>
                  <p className="mt-1 text-sm text-[#94A3B8]">
                    {zh ? '讲述此刻的感受，也可以录下风声、脚步声或同行者的故事。' : 'Speak a memory, or record the wind, footsteps, and stories around you.'}
                  </p>
                </div>
                <button
                  id={isRecording ? 'stop-journey-recording' : 'start-journey-recording'}
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`min-h-[52px] shrink-0 px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    isRecording
                      ? 'bg-[#C04838] text-white shadow-[0_0_18px_rgba(192,72,56,.28)]'
                      : 'bg-[#173033] border border-[#47BBC1] text-[#A9F0ED] hover:bg-[#1C3B3E]'
                  }`}
                >
                  {isRecording ? <Square className="h-4 w-4 fill-current" /> : <Mic className="h-5 w-5" />}
                  <span>{isRecording ? `${zh ? '停止录音' : 'Stop Recording'} · ${formatDuration(recordingSeconds)}` : zh ? '开始录音' : 'Start Recording'}</span>
                </button>
              </div>

              {audioUrl && !isRecording && (
                <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-[#2F4148] bg-[#111D22] p-3">
                  <audio controls src={audioUrl} className="w-full sm:flex-1 h-10" />
                  <button
                    type="button"
                    onClick={removeAudio}
                    className="min-h-[44px] px-3 rounded-lg border border-[#C04838]/50 text-[#E98778] hover:bg-[#C04838]/10 flex items-center justify-center gap-2 text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{zh ? '删除' : 'Remove'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {mode === 'photo' && (
            <div className="rounded-xl border border-[#33474E] bg-[#0C1418] p-4 sm:p-5">
              <input
                ref={photoInputRef}
                className="sr-only"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhoto}
                aria-label={zh ? '拍摄或选择照片' : 'Take or choose a photo'}
              />
              {photoUrl ? (
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                  <img src={photoUrl} alt={zh ? `${locationTitle}的旅途照片` : `Journey photo from ${locationTitle}`} className="w-full max-h-[360px] object-contain rounded-xl border border-[#35505A] bg-black/20" />
                  <div className="flex sm:flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="min-h-[46px] flex-1 px-4 rounded-xl border border-[#47BBC1]/60 text-[#A9F0ED] hover:bg-[#173033] flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Camera className="h-4 w-4" />
                      <span>{zh ? '重新拍摄' : 'Replace'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="min-h-[46px] flex-1 px-4 rounded-xl border border-[#C04838]/50 text-[#E98778] hover:bg-[#C04838]/10 flex items-center justify-center gap-2 text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{zh ? '删除' : 'Remove'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  id="add-journey-photo"
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="w-full min-h-[210px] rounded-xl border border-dashed border-[#47BBC1]/55 bg-[#102126] text-[#CBD5E1] hover:border-[#EBC393] hover:bg-[#14262A] flex flex-col items-center justify-center gap-3 px-6 transition-all"
                >
                  <span className="h-12 w-12 rounded-full bg-[#47BBC1]/12 border border-[#47BBC1]/40 flex items-center justify-center text-[#47BBC1]">
                    <ImagePlus className="h-6 w-6" />
                  </span>
                  <span className="font-bold text-[#E6E9D1]">{zh ? '拍摄或选择一张照片' : 'Take or choose a photo'}</span>
                  <span className="text-sm text-[#94A3B8]">{zh ? '保存眼前的风景、同行者或旅途细节' : 'Keep the view, your companions, or a detail from the trail'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {(status || error) && (
          <div className={`mt-3 min-h-[24px] flex items-center gap-2 text-sm ${error ? 'text-[#F09A8D]' : 'text-[#8FE0D8]'}`} role="status">
            {error ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : <Check className="h-4 w-4" />}
            <span>{error || status}</span>
          </div>
        )}
      </div>
    </section>
  );
};
