import React from 'react';
import { Plus, FileText, Presentation, Printer } from 'lucide-react';
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
  deleteItem,
  moveItem,
  exportExcel,
  exportPPT,
  exportPDF
}) => {
  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] min-h-0">
      
      {/* Toolbar */}
      <div className="h-10 border-b border-slate-700 flex items-center px-4 justify-between shrink-0 bg-[#252526]">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xs text-slate-400 uppercase tracking-wider">Timeline Sequence</span>
          <button onClick={addTrack} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-xs font-bold transition">
            <Plus size={12} /> Add Track
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportExcel} className="flex items-center gap-2 bg-[#333] hover:bg-[#444] text-slate-300 px-3 py-1 rounded text-xs font-bold transition border border-slate-600">
            <FileText size={12} /> Excel
          </button>
          <button onClick={exportPPT} className="flex items-center gap-2 bg-[#333] hover:bg-[#444] text-slate-300 px-3 py-1 rounded text-xs font-bold transition border border-slate-600">
            <Presentation size={12} /> PPT
          </button>
          <button onClick={exportPDF} className="flex items-center gap-2 bg-[#333] hover:bg-[#444] text-slate-300 px-3 py-1 rounded text-xs font-bold transition border border-slate-600">
            <Printer size={12} /> PDF
          </button>
        </div>
      </div>

      {/* Timeline Grid Container */}
      <div className="flex-1 overflow-auto bg-[#1e1e1e] relative custom-scrollbar">
        <div className="flex min-w-max h-full">
          
          {/* Sticky Sidebar (Track Headers) */}
          <div className="sticky left-0 z-20 w-32 bg-[#252526] border-r border-slate-700 flex flex-col shrink-0 shadow-xl h-full">
            <div className="h-8 border-b border-slate-700 bg-[#2d2d30] flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase shrink-0">
              Tracks
            </div>
            <div className="h-10 border-b border-slate-700 flex items-center px-3 text-xs font-bold text-slate-400 shrink-0">Stage</div>
            <div className="h-10 border-b border-slate-700 flex items-center px-3 text-xs font-bold text-slate-400 shrink-0">Time (min)</div>
            <div className="h-32 border-b border-slate-700 flex items-center px-3 text-xs font-bold text-slate-400 shrink-0">Teacher</div>
            <div className="h-32 border-b border-slate-700 flex items-center px-3 text-xs font-bold text-slate-400 shrink-0">Student</div>
            <div className="flex-1 border-b border-slate-700 flex items-start pt-3 px-3 text-xs font-bold text-slate-400 min-h-[200px]">Materials</div>
            <div className="h-8 border-b border-slate-700 flex items-center px-3 text-xs font-bold text-slate-400 shrink-0">Actions</div>
          </div>

          {/* Timeline Content (Horizontal Scroll) */}
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
                moveItem={moveItem}
                deleteItem={deleteItem}
              />
            ))}
            
            {/* Add Button at the end */}
            <div className="w-16 border-r border-slate-700 flex items-center justify-center shrink-0 bg-[#1e1e1e] hover:bg-[#252526] cursor-pointer transition-colors" onClick={addTrack}>
              <Plus size={24} className="text-slate-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineEditor;
