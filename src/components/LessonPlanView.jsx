import React, { useEffect, useRef, useState } from 'react';
import { FileText, Lock } from 'lucide-react';
import { STAGES } from '../constants/stages';

const PAGE_WIDTH = 794; // ~210mm @96dpi
const PAGE_HEIGHT = 1123; // ~297mm @96dpi

const LessonPlanView = ({
  tracks,
  selectedId,
  setSelectedId,
  totalTime,
  width,
  startResizeHorizontal
}) => {
  const viewportRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!viewportRef.current) return;

    const updateScale = () => {
      const bounds = viewportRef.current.getBoundingClientRect();
      const next = Math.min(1, Math.max(0.45, (bounds.width - 32) / PAGE_WIDTH));
      setScale(next);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ width: `${width}%` }} className="flex flex-col bg-slate-100 border-r border-slate-700 relative min-w-[360px]" id="lesson-plan-view">
      <div className="h-8 bg-white border-b flex items-center px-3 md:px-4 justify-between shrink-0">
        <span className="text-[11px] md:text-xs font-black text-slate-800 uppercase flex items-center gap-2">
          <FileText size={13} /> 교수학습과정안 (WORD Preview)
        </span>
        <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs">
          <span className="font-bold text-slate-500">Total: {totalTime} min</span>
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded border">
            <Lock size={10} /> 비율 고정·줌만 변경
          </span>
        </div>
      </div>

      <div ref={viewportRef} className="flex-1 overflow-auto p-3 md:p-5 bg-slate-200">
        <div className="mx-auto" style={{ width: PAGE_WIDTH * scale, height: PAGE_HEIGHT * scale }}>
          <div
            className="bg-white shadow-xl origin-top-left"
            style={{ width: PAGE_WIDTH, minHeight: PAGE_HEIGHT, transform: `scale(${scale})` }}
          >
            <div className="p-8">
              <h1 className="text-center font-batang text-2xl font-bold mb-8 text-black">교수 · 학습 과정안</h1>
              <table className="w-full border-collapse border border-black font-batang text-black text-sm table-fixed">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-black p-2 w-16 text-center bg-slate-100">단계</th>
                    <th className="border border-black p-2 w-16 text-center bg-slate-100">시간</th>
                    <th className="border border-black p-2 text-center bg-slate-100">교수 활동</th>
                    <th className="border border-black p-2 text-center bg-slate-100">학습 활동</th>
                    <th className="border border-black p-2 text-center bg-slate-100">PPT 내용</th>
                    <th className="border border-black p-2 w-28 text-center bg-slate-100">자료</th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map((t) => (
                    <tr
                      key={t.id}
                      className={`cursor-pointer hover:bg-blue-50 ${selectedId === t.id ? 'bg-blue-100' : ''}`}
                      onClick={() => setSelectedId(t.id)}
                    >
                      <td className="border border-black p-2 text-center align-top">{STAGES.find((s) => s.id === t.stage)?.label || t.stage}</td>
                      <td className="border border-black p-2 text-center align-top">{t.time}</td>
                      <td className="border border-black p-2 align-top whitespace-pre-wrap">{t.teacher}</td>
                      <td className="border border-black p-2 align-top whitespace-pre-wrap">{t.student}</td>
                      <td className="border border-black p-2 align-top whitespace-pre-wrap">{t.pptContent || '-'}</td>
                      <td className="border border-black p-2 text-xs text-slate-600 align-top">
                        <div className="flex flex-col gap-2 text-left">
                          {t.items && t.items.length > 0
                            ? t.items.map((item, idx) => (
                                <div key={idx} className="leading-snug">
                                  <div className="font-bold break-words">□ [{(item.type || 'ppt').toUpperCase()}] {item.title}</div>
                                  {item.url && <div className="text-blue-600 break-all">↗ {item.url}</div>}
                                  {item.note && <div className="text-slate-500 whitespace-pre-wrap">◆ {item.note}</div>}
                                </div>
                              ))
                            : '-'}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tracks.length === 0 && (
                    <tr>
                      <td colSpan="6" className="border border-black p-8 text-center text-slate-400 italic">
                        데이터가 없습니다. 아래 타임라인에서 추가해주세요.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-indigo-500 z-20 transition-colors"
        onMouseDown={startResizeHorizontal}
      />
    </div>
  );
};

export default LessonPlanView;
