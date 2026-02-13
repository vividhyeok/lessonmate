import React, { useMemo } from 'react';
import { ExternalLink, Link as LinkIcon, Presentation, Video } from 'lucide-react';

const MaterialPreview = ({ selectedItem, updateItem, selectedTrackId, tracks }) => {
  const currentTrack = useMemo(() => tracks?.find((t) => t.id === selectedTrackId), [tracks, selectedTrackId]);

  const activeContent = useMemo(() => {
    const currentTrackIndex = tracks ? tracks.findIndex((t) => t.id === selectedTrackId) : -1;

    if (currentTrackIndex === -1) return '';

    for (let i = currentTrackIndex; i >= 0; i--) {
      const track = tracks[i];
      if (track.pptContent && track.pptContent.trim().length > 0) {
        return track.pptContent;
      }
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

  const selectedTrackIdSafe = currentTrack?.id;
  const updateSelectedItem = (field, value) => {
    if (!selectedTrackIdSafe || !selectedItem?.id) return;
    updateItem(selectedTrackIdSafe, selectedItem.id, field, value);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-800 relative border-l border-slate-700 min-w-0">
      <div className="h-10 bg-[#252526] border-b border-slate-700 flex items-center px-4 justify-between shrink-0">
        <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-wider">
          <Presentation size={14} className="text-orange-400" /> Material Preview
        </span>
        <span className="text-[10px] font-mono text-slate-500 bg-[#1e1e1e] px-2 py-1 rounded border border-slate-700">
          {selectedItem ? selectedItem.type.toUpperCase() : 'PPT'}
        </span>
      </div>

      <div className="flex-1 min-h-0 flex flex-col bg-[#1e1e1e] overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-6 overflow-auto custom-scrollbar">
          <div className="aspect-video w-full max-w-4xl bg-white shadow-2xl flex flex-col transition-all duration-300 rounded-lg overflow-hidden relative transform hover:scale-[1.01]">
            <div className="h-20 bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center px-8 shrink-0 shadow-md">
              <h1 className="text-3xl font-black text-white drop-shadow-sm tracking-tight truncate w-full">{slideTitle}</h1>
            </div>

            <div className="flex-1 p-10 bg-white overflow-y-auto custom-scrollbar">
              <div className="text-2xl font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">
                {slideBody ? (
                  slideBody.split('\n').map((line, i) => (
                    <p key={i} className="mb-4">
                      {line}
                    </p>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300 italic gap-2">
                    <Presentation size={48} className="opacity-20" />
                    <span>슬라이드 내용이 없습니다.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="h-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between px-6 text-xs text-slate-400 font-medium shrink-0">
              <span>LessonMate AI Class</span>
              <span>
                {(tracks ? tracks.findIndex((t) => t.id === selectedTrackId) : -1) + 1} / {tracks ? tracks.length : '-'}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 bg-[#252526] p-3 space-y-2">
          {selectedItem ? (
            <>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                {selectedItem.type === 'ppt' && <Presentation size={12} className="text-orange-400" />}
                {selectedItem.type === 'url' && <LinkIcon size={12} className="text-blue-400" />}
                {selectedItem.type === 'video' && <Video size={12} className="text-red-400" />}
                Selected Material Editor
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
                    <a
                      href={selectedItem.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                    >
                      링크 열기 <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              )}

              <textarea
                value={selectedItem.content || ''}
                onChange={(e) => updateSelectedItem('content', e.target.value)}
                placeholder="자료 내용 / 설명"
                className="w-full h-20 bg-[#1e1e1e] border border-slate-600 rounded px-2 py-1.5 text-sm outline-none focus:border-indigo-500 resize-none"
              />
            </>
          ) : (
            <div className="text-xs text-slate-500 italic">트랙의 자료를 선택하면 여기서 제목/링크/내용을 편집할 수 있습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialPreview;
