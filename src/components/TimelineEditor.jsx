import React from 'react';
import { FileSpreadsheet, Plus, Presentation, Printer } from 'lucide-react';
import TrackColumn from './TrackColumn';

const TimelineEditor = ({
  tracks,
  selectedTrackId,
  setSelectedTrackId,
  selectedItemId,
  setSelectedItemId,
  addTrack,
  updateTrack,
  deleteTrack,
  moveTrack,
  duplicateTrack,
  addItem,
  updateItem,
  deleteItem,
  moveItem,
  exportExcel,
  exportPPT,
  exportPDF
}) => {
  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] min-h-0">
      <div className="h-10 border-b border-slate-700 flex items-center px-2 md:px-4 justify-between shrink-0 bg-[#252526]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[11px] md:text-xs text-slate-400 uppercase tracking-wider">Timeline Sequence</span>
          <button title="트랙 추가" onClick={addTrack} className="w-8 h-8 inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded transition">
            <Plus size={14} />
          </button>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <button title="교수학습과정안 표 Excel 다운로드" onClick={exportExcel} className="w-8 h-8 inline-flex items-center justify-center bg-[#333] hover:bg-[#444] text-slate-300 rounded border border-slate-600">
            <FileSpreadsheet size={14} />
          </button>
          <button title="PPT 다운로드" onClick={exportPPT} className="w-8 h-8 inline-flex items-center justify-center bg-[#333] hover:bg-[#444] text-slate-300 rounded border border-slate-600">
            <Presentation size={14} />
          </button>
          <button title="Word/PPT 미리보기 PDF로 인쇄" onClick={exportPDF} className="w-8 h-8 inline-flex items-center justify-center bg-[#333] hover:bg-[#444] text-slate-300 rounded border border-slate-600">
            <Printer size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[#1e1e1e] relative custom-scrollbar">
        <div className="flex min-w-max h-full">
          <div className="sticky left-0 z-20 w-28 md:w-32 bg-[#252526] border-r border-slate-700 flex flex-col shrink-0 shadow-xl h-full">
            <div className="h-8 border-b border-slate-700 bg-[#2d2d30] flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase shrink-0">Tracks</div>
            <div className="h-10 border-b border-slate-700 flex items-center px-2 md:px-3 text-xs font-bold text-slate-400 shrink-0">Stage</div>
            <div className="h-10 border-b border-slate-700 flex items-center px-2 md:px-3 text-xs font-bold text-slate-400 shrink-0">Time</div>
            <div className="h-32 border-b border-slate-700 flex items-center px-2 md:px-3 text-xs font-bold text-slate-400 shrink-0">Teacher</div>
            <div className="h-32 border-b border-slate-700 flex items-center px-2 md:px-3 text-xs font-bold text-slate-400 shrink-0">Student</div>
            <div className="h-32 border-b border-slate-700 flex items-center px-2 md:px-3 text-xs font-bold text-slate-400 shrink-0">PPT</div>
            <div className="flex-1 border-b border-slate-700 flex items-start pt-3 px-2 md:px-3 text-xs font-bold text-slate-400 min-h-[200px]">Materials</div>
            <div className="h-8 border-b border-slate-700 flex items-center px-2 md:px-3 text-xs font-bold text-slate-400 shrink-0">Actions</div>
          </div>

          <div className="flex h-full">
            {tracks.map((track, index) => (
              <TrackColumn
                key={track.id}
                track={track}
                index={index}
                selectedTrackId={selectedTrackId}
                setSelectedTrackId={setSelectedTrackId}
                selectedItemId={selectedItemId}
                setSelectedItemId={setSelectedItemId}
                updateTrack={updateTrack}
                moveTrack={moveTrack}
                duplicateTrack={duplicateTrack}
                deleteTrack={deleteTrack}
                addItem={addItem}
                updateItem={updateItem}
                moveItem={moveItem}
                deleteItem={deleteItem}
              />
            ))}

            <div title="트랙 추가" className="w-14 border-r border-slate-700 flex items-center justify-center shrink-0 bg-[#1e1e1e] hover:bg-[#252526] cursor-pointer transition-colors" onClick={addTrack}>
              <Plus size={22} className="text-slate-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineEditor;
