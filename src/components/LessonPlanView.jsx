import React from 'react';
import { FileText } from 'lucide-react';
import { STAGES } from '../constants/stages';

const LessonPlanView = ({ 
  tracks, 
  selectedId, 
  setSelectedId, 
  updateTrack, 
  totalTime, 
  width, 
  startResizeHorizontal 
}) => {
  return (
    <div style={{ width: `${width}%` }} className="flex flex-col bg-slate-100 border-r border-slate-700 relative" id="lesson-plan-view">
      <div className="h-8 bg-white border-b flex items-center px-4 justify-between shrink-0">
        <span className="text-xs font-black text-slate-800 uppercase flex items-center gap-2">
          <FileText size={14} /> 교수학습과정안 (HWP Style)
        </span>
        <span className="text-xs font-bold text-slate-500">Total: {totalTime} min</span>
      </div>
      <div className="flex-1 overflow-auto p-8 bg-slate-200">
        <div className="bg-white shadow-xl min-h-[800px] p-12 mx-auto max-w-[210mm]">
          <h1 className="text-center font-batang text-2xl font-bold mb-8 text-black">교수 · 학습 과정안</h1>
          <table className="w-full border-collapse border border-black font-batang text-black text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-black p-2 w-16 text-center bg-slate-100">단계</th>
                <th className="border border-black p-2 w-16 text-center bg-slate-100">시간</th>
                <th className="border border-black p-2 text-center bg-slate-100">교수 활동</th>
                <th className="border border-black p-2 text-center bg-slate-100">학습 활동</th>
                <th className="border border-black p-2 w-24 text-center bg-slate-100">자료</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((t, i) => (
                <tr 
                  key={t.id} 
                  className={`cursor-pointer hover:bg-blue-50 ${selectedId === t.id ? 'bg-blue-100' : ''}`}
                  onClick={() => setSelectedId(t.id)}
                >
                  <td className="border border-black p-2 text-center align-middle">
                    <select 
                      value={t.stage}
                      onChange={(e) => updateTrack(t.id, 'stage', e.target.value)}
                      className="w-full bg-transparent text-center outline-none font-batang appearance-none cursor-pointer"
                    >
                      {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </td>
                  <td className="border border-black p-2 text-center align-middle">
                    <input 
                      type="number" 
                      value={t.time}
                      onChange={(e) => updateTrack(t.id, 'time', e.target.value)}
                      className="w-full text-center bg-transparent outline-none font-batang"
                    />
                  </td>
                  <td className="border border-black p-2 align-top">
                    <textarea 
                      value={t.teacher}
                      onChange={(e) => updateTrack(t.id, 'teacher', e.target.value)}
                      className="w-full h-full min-h-[60px] bg-transparent outline-none resize-none font-batang leading-relaxed"
                    />
                  </td>
                  <td className="border border-black p-2 align-top">
                    <textarea 
                      value={t.student}
                      onChange={(e) => updateTrack(t.id, 'student', e.target.value)}
                      className="w-full h-full min-h-[60px] bg-transparent outline-none resize-none font-batang leading-relaxed"
                    />
                  </td>
                  <td className="border border-black p-2 text-center align-middle text-xs text-slate-500">
                    <div className="flex flex-col gap-1 items-center">
                      {t.items && t.items.length > 0 ? t.items.map((item, idx) => (
                        <span key={idx} className="px-1 rounded bg-slate-100 border border-slate-300 text-[10px]">
                          {item.type === 'ppt' ? 'PPT' : item.type === 'url' ? 'URL' : 'Video'}
                        </span>
                      )) : '-'}
                    </div>
                  </td>
                </tr>
              ))}
              {tracks.length === 0 && (
                <tr>
                  <td colSpan="5" className="border border-black p-8 text-center text-slate-400 italic">
                    데이터가 없습니다. 아래 타임라인에서 추가해주세요.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Horizontal Resizer Handle */}
      <div 
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-indigo-500 z-20 transition-colors"
        onMouseDown={startResizeHorizontal}
      />
    </div>
  );
};

export default LessonPlanView;
