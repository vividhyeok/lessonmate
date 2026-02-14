import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Link as LinkIcon, Presentation, SlidersHorizontal, Type, Video } from 'lucide-react';

const MaterialPreview = ({ selectedItem, updateItem, selectedTrackId, tracks, updateTrack, lessonName }) => {
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [tab, setTab] = useState('content');

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

  const pptFontSize = Number(currentTrack?.pptFontSize || 28);

  const updateSelectedItem = (field, value) => {
    if (!currentTrack?.id || !selectedItem?.id) return;
    updateItem(currentTrack.id, selectedItem.id, field, value);
  };

  return (
    <div className="flex-1 flex bg-slate-800 border-l border-slate-700 min-w-0 relative">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-10 bg-[#252526] border-b border-slate-700 flex items-center px-4 justify-between shrink-0">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-wider">
            <Presentation size={14} className="text-orange-400" /> PPT Preview
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-2 py-1 rounded">FONT {pptFontSize}px</span>
            <button
              onClick={() => setIsInspectorOpen((prev) => !prev)}
              className="text-[10px] inline-flex items-center gap-1 px-2 py-1 rounded bg-[#1e1e1e] border border-slate-600 hover:border-indigo-500"
            >
              <SlidersHorizontal size={11} /> Inspector {isInspectorOpen ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 bg-[#1e1e1e] overflow-auto custom-scrollbar">
          <div className="aspect-video w-full max-w-4xl bg-white shadow-2xl flex flex-col rounded-lg overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center px-8 shrink-0 shadow-md">
              <h1 className="text-3xl font-black text-white drop-shadow-sm tracking-tight truncate w-full">{slideTitle}</h1>
            </div>

            <div className="flex-1 p-10 bg-white overflow-y-auto custom-scrollbar">
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

      {isInspectorOpen && (
        <div className="w-[320px] border-l border-slate-700 bg-[#252526] flex flex-col shrink-0">
          <div className="p-2 border-b border-slate-700 grid grid-cols-3 gap-1">
            <button onClick={() => setTab('content')} className={`text-xs py-1 rounded ${tab === 'content' ? 'bg-indigo-600 text-white' : 'bg-[#1e1e1e] text-slate-400'}`}>내용</button>
            <button onClick={() => setTab('style')} className={`text-xs py-1 rounded ${tab === 'style' ? 'bg-indigo-600 text-white' : 'bg-[#1e1e1e] text-slate-400'}`}>스타일</button>
            <button onClick={() => setTab('material')} className={`text-xs py-1 rounded ${tab === 'material' ? 'bg-indigo-600 text-white' : 'bg-[#1e1e1e] text-slate-400'}`}>자료</button>
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-3 custom-scrollbar">
            {tab === 'content' && currentTrack && (
              <>
                <div className="text-[11px] text-slate-400 font-bold uppercase">슬라이드 본문 편집</div>
                <textarea
                  value={currentTrack.pptContent || ''}
                  onChange={(e) => updateTrack(currentTrack.id, 'pptContent', e.target.value)}
                  placeholder="[슬라이드 제목]\n슬라이드 본문"
                  className="w-full h-48 bg-[#1e1e1e] border border-slate-600 rounded px-2 py-1.5 text-sm outline-none focus:border-indigo-500 resize-none"
                />
              </>
            )}

            {tab === 'style' && currentTrack && (
              <>
                <div className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-1"><Type size={12} /> 타이포그래피</div>
                <div className="text-xs text-slate-500">문서 미리보기는 고정 비율로 유지되고, 여기서 폰트만 조절됩니다.</div>
                <input
                  type="range"
                  min="14"
                  max="54"
                  value={pptFontSize}
                  onChange={(e) => updateTrack(currentTrack.id, 'pptFontSize', parseInt(e.target.value, 10))}
                  className="w-full"
                />
                <div className="flex items-center gap-2">
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
                    className="w-20 bg-[#1e1e1e] border border-slate-600 rounded px-1.5 py-1 text-xs"
                  />
                  <button
                    onClick={() => updateTrack(currentTrack.id, 'pptFontSize', 28)}
                    className="text-xs px-2 py-1 rounded bg-[#1e1e1e] border border-slate-600 hover:border-indigo-500"
                  >
                    기본값
                  </button>
                </div>
              </>
            )}

            {tab === 'material' && (
              <>
                {selectedItem ? (
                  <>
                    <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                      {selectedItem.type === 'ppt' && <Presentation size={12} className="text-orange-400" />}
                      {selectedItem.type === 'url' && <LinkIcon size={12} className="text-blue-400" />}
                      {selectedItem.type === 'video' && <Video size={12} className="text-red-400" />}
                      선택 자료 편집
                    </div>
                    <input
                      value={selectedItem.title || ''}
                      onChange={(e) => updateSelectedItem('title', e.target.value)}
                      placeholder="자료 제목"
                      className="w-full bg-[#1e1e1e] border border-slate-600 rounded px-2 py-1.5 text-sm outline-none focus:border-indigo-500"
                    />

                    {(selectedItem.type === 'url' || selectedItem.type === 'video') && (
                      <div className="space-y-1">
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
        </div>
      )}
    </div>
  );
};

export default MaterialPreview;
