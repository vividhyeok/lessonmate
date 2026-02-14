import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Link as LinkIcon,
  Palette,
  Presentation,
  Type,
  Video,
  WandSparkles
} from 'lucide-react';

const SLIDE_W = 1280;
const SLIDE_H = 720;

const MaterialPreview = ({ selectedItem, updateItem, selectedTrackId, tracks, updateTrack = () => {}, lessonName }) => {
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [tool, setTool] = useState('content');
  const viewportRef = useRef(null);
  const [slideScale, setSlideScale] = useState(1);

  const currentTrack = useMemo(() => tracks?.find((t) => t.id === selectedTrackId), [tracks, selectedTrackId]);

  const activeContent = useMemo(() => {
    const currentTrackIndex = tracks ? tracks.findIndex((t) => t.id === selectedTrackId) : -1;
    if (currentTrackIndex === -1) return '';

    for (let i = currentTrackIndex; i >= 0; i--) {
      const track = tracks[i];
      if (track.pptContent && track.pptContent.trim().length > 0) return track.pptContent;
    }

    return '';
  }, [tracks, selectedTrackId]);

  const { slideTitle, slideBody } = useMemo(() => {
    let title = '인공지능의 이해';
    let body = activeContent;

    if (activeContent) {
      const match = activeContent.match(/^\[(.*?)\]([\s\S]*)$/);
      if (match) {
        title = match[1];
        body = match[2].trim();
      }
    }

    return { slideTitle: title, slideBody: body };
  }, [activeContent]);

  useEffect(() => {
    if (!viewportRef.current) return;

    const updateScale = () => {
      const b = viewportRef.current.getBoundingClientRect();
      const inspectorWidth = isInspectorOpen ? 320 : 56;
      const availableW = Math.max(320, b.width - inspectorWidth - 32);
      const availableH = Math.max(220, b.height - 32);
      const next = Math.min(1, Math.max(0.35, Math.min(availableW / SLIDE_W, availableH / SLIDE_H)));
      setSlideScale(next);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [isInspectorOpen]);

  const pptFontSize = Number(currentTrack?.pptFontSize || 28);

  const updateSelectedItem = (field, value) => {
    if (!currentTrack?.id || !selectedItem?.id) return;
    updateItem(currentTrack.id, selectedItem.id, field, value);
  };

  const tools = [
    { id: 'content', icon: WandSparkles, label: '슬라이드 내용 편집' },
    { id: 'style', icon: Palette, label: '스타일 / 폰트 편집' },
    { id: 'material', icon: Type, label: '자료 속성 편집' }
  ];

  return (
    <div ref={viewportRef} className="flex-1 flex bg-slate-800 border-l border-slate-700 min-w-0 relative overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-10 bg-[#252526] border-b border-slate-700 flex items-center px-3 md:px-4 justify-between shrink-0">
          <span className="text-[11px] md:text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-wider">
            <Presentation size={14} className="text-orange-400" /> PPT Preview
          </span>
          <span className="text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-2 py-1 rounded">FONT {pptFontSize}px</span>
        </div>

        <div className="flex-1 p-4 md:p-6 bg-[#1e1e1e] overflow-auto custom-scrollbar">
          <div className="mx-auto" style={{ width: SLIDE_W * slideScale, height: SLIDE_H * slideScale }}>
            <div
              className="bg-white shadow-2xl rounded-lg overflow-hidden origin-top-left"
              style={{ width: SLIDE_W, height: SLIDE_H, transform: `scale(${slideScale})` }}
            >
              <div className="h-20 bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center px-8 shrink-0 shadow-md">
                <h1 className="text-3xl font-black text-white drop-shadow-sm tracking-tight truncate w-full">{slideTitle}</h1>
              </div>

              <div className="h-[612px] p-10 bg-white overflow-y-auto custom-scrollbar">
                <div className="font-medium text-slate-700 whitespace-pre-wrap leading-relaxed" style={{ fontSize: `${pptFontSize}px` }}>
                  {slideBody ? (
                    slideBody.split('\n').map((line, i) => <p key={i} className="mb-4">{line}</p>)
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300 italic gap-2">
                      <Presentation size={48} className="opacity-20" />
                      <span>슬라이드 내용이 없습니다.</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between px-6 text-xs text-slate-400 font-medium shrink-0">
                <span>{lessonName || 'LessonMate AI Class'}</span>
                <span>{(tracks ? tracks.findIndex((t) => t.id === selectedTrackId) : -1) + 1} / {tracks ? tracks.length : '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-full border-l border-slate-700 bg-[#252526] flex shrink-0">
        <div className="w-14 border-r border-slate-700 flex flex-col items-center py-2 gap-1">
          <button
            title={isInspectorOpen ? 'Inspector 접기' : 'Inspector 펼치기'}
            onClick={() => setIsInspectorOpen((prev) => !prev)}
            className="w-9 h-9 inline-flex items-center justify-center rounded bg-[#1e1e1e] text-slate-300 border border-slate-600 hover:border-indigo-500"
          >
            {isInspectorOpen ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>

          {tools.map((t) => {
            const Icon = t.icon;
            const active = tool === t.id;
            return (
              <button
                key={t.id}
                title={t.label}
                onClick={() => {
                  setTool(t.id);
                  setIsInspectorOpen(true);
                }}
                className={`w-9 h-9 inline-flex items-center justify-center rounded border transition ${active ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500' : 'bg-[#1e1e1e] text-slate-400 border-slate-600 hover:border-indigo-500'}`}
              >
                <Icon size={15} />
              </button>
            );
          })}
        </div>

        {isInspectorOpen && (
          <div className="w-[264px] p-3 overflow-auto custom-scrollbar">
            {tool === 'content' && currentTrack && (
              <>
                <div className="text-[11px] text-slate-400 font-bold uppercase mb-2">슬라이드 내용</div>
                <textarea
                  value={currentTrack.pptContent || ''}
                  onChange={(e) => updateTrack(currentTrack.id, 'pptContent', e.target.value)}
                  placeholder="[슬라이드 제목]\n슬라이드 본문"
                  className="w-full h-52 bg-[#1e1e1e] border border-slate-600 rounded px-2 py-1.5 text-sm outline-none focus:border-indigo-500 resize-none"
                />
              </>
            )}

            {tool === 'style' && currentTrack && (
              <>
                <div className="text-[11px] text-slate-400 font-bold uppercase mb-2">타이포그래피</div>
                <div className="text-xs text-slate-500 mb-2">결과물 비율은 고정되고, 폰트 스타일만 실시간 반영됩니다.</div>
                <input
                  type="range"
                  min="14"
                  max="54"
                  value={pptFontSize}
                  onChange={(e) => updateTrack(currentTrack.id, 'pptFontSize', parseInt(e.target.value, 10))}
                  className="w-full"
                />
                <div className="mt-2 flex gap-2">
                  <input
                    type="number"
                    min="14"
                    max="54"
                    value={pptFontSize}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      if (Number.isNaN(next)) return;
                      updateTrack(currentTrack.id, 'pptFontSize', Math.max(14, Math.min(54, next)));
                    }}
                    className="w-20 bg-[#1e1e1e] border border-slate-600 rounded px-2 py-1 text-xs"
                  />
                  <button
                    title="기본값 28로 복구"
                    onClick={() => updateTrack(currentTrack.id, 'pptFontSize', 28)}
                    className="text-xs px-2 py-1 rounded bg-[#1e1e1e] border border-slate-600 hover:border-indigo-500"
                  >
                    Reset
                  </button>
                </div>
              </>
            )}

            {tool === 'material' && (
              <>
                {selectedItem ? (
                  <>
                    <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2 mb-2">
                      {selectedItem.type === 'ppt' && <Presentation size={12} className="text-orange-400" />}
                      {selectedItem.type === 'url' && <LinkIcon size={12} className="text-blue-400" />}
                      {selectedItem.type === 'video' && <Video size={12} className="text-red-400" />}
                      선택 자료
                    </div>
                    <input
                      value={selectedItem.title || ''}
                      onChange={(e) => updateSelectedItem('title', e.target.value)}
                      placeholder="자료 제목"
                      className="w-full mb-2 bg-[#1e1e1e] border border-slate-600 rounded px-2 py-1.5 text-sm outline-none focus:border-indigo-500"
                    />

                    {(selectedItem.type === 'url' || selectedItem.type === 'video') && (
                      <div className="space-y-1 mb-2">
                        <input
                          value={selectedItem.url || ''}
                          onChange={(e) => updateSelectedItem('url', e.target.value)}
                          placeholder={selectedItem.type === 'url' ? 'https://example.com' : 'https://youtube.com/...'}
                          className="w-full bg-[#1e1e1e] border border-slate-600 rounded px-2 py-1.5 text-sm outline-none focus:border-indigo-500"
                        />
                        {selectedItem.url && (
                          <a href={selectedItem.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                            링크 열기 <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    )}

                    <textarea
                      value={selectedItem.content || ''}
                      onChange={(e) => updateSelectedItem('content', e.target.value)}
                      placeholder="자료 내용 / 설명"
                      className="w-full h-28 bg-[#1e1e1e] border border-slate-600 rounded px-2 py-1.5 text-sm outline-none focus:border-indigo-500 resize-none"
                    />
                  </>
                ) : (
                  <div className="text-xs text-slate-500 italic">타임라인에서 자료를 선택하면 여기서 편집할 수 있습니다.</div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialPreview;
