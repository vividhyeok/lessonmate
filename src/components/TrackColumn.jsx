import React from 'react';
import { 
  Presentation, 
  Link as LinkIcon, 
  Video, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Copy 
} from 'lucide-react';
import { STAGES } from '../constants/stages';

const TrackColumn = ({
  track,
  index,
  selectedTrackId,
  setSelectedTrackId,
  selectedItemId,
  setSelectedItemId,
  updateTrack,
  moveTrack,
  duplicateTrack,
  deleteTrack,
  addItem,
  updateItem,
  moveItem,
  deleteItem
}) => {
  return (
    <div 
      className={`w-80 border-r border-slate-700 flex flex-col shrink-0 transition-all duration-200 h-full ${
        selectedTrackId === track.id ? 'bg-[#2a2a2d] shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]' : 'bg-[#1e1e1e]'
      }`}
      onClick={() => setSelectedTrackId(track.id)}
    >
      {/* Header (Step Number) */}
      <div className={`h-8 border-b border-slate-700 flex items-center justify-between px-3 text-xs font-bold shrink-0 ${
        selectedTrackId === track.id ? 'bg-indigo-900/30 text-indigo-400' : 'bg-[#252526] text-slate-500'
      }`}>
        <span>Step {index + 1}</span>
        {selectedTrackId === track.id && <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />}
      </div>

      {/* Stage Row */}
      <div className="h-10 border-b border-slate-700 p-1 shrink-0 bg-[#252526]">
        <select 
          value={track.stage}
          onChange={(e) => updateTrack(track.id, 'stage', e.target.value)}
          className={`w-full h-full bg-[#1e1e1e] text-xs font-bold rounded px-2 outline-none border border-slate-600 focus:border-indigo-500 transition-colors ${
            track.stage === 'intro' ? 'text-emerald-400' :
            track.stage === 'dev' ? 'text-indigo-400' : 'text-rose-400'
          }`}
        >
          {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      {/* Time Row */}
      <div className="h-10 border-b border-slate-700 p-1 shrink-0 bg-[#252526]">
        <div className="relative w-full h-full">
            <input 
            type="number" 
            value={track.time}
            onChange={(e) => updateTrack(track.id, 'time', e.target.value)}
            className="w-full h-full bg-[#1e1e1e] text-slate-300 text-xs text-center rounded outline-none border border-slate-600 focus:border-indigo-500 font-mono transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 pointer-events-none">min</span>
        </div>
      </div>

      {/* Teacher Row */}
      <div className="h-32 border-b border-slate-700 p-2 shrink-0 group">
        <textarea 
          value={track.teacher}
          onChange={(e) => updateTrack(track.id, 'teacher', e.target.value)}
          placeholder="Teacher Activity..."
          className="w-full h-full bg-[#252526] text-slate-300 text-xs rounded p-2 outline-none border border-slate-600 focus:border-indigo-500 focus:bg-[#1e1e1e] resize-none leading-relaxed transition-colors placeholder-slate-600"
        />
      </div>

      {/* Student Row */}
      <div className="h-32 border-b border-slate-700 p-2 shrink-0 group">
        <textarea 
          value={track.student}
          onChange={(e) => updateTrack(track.id, 'student', e.target.value)}
          placeholder="Student Activity..."
          className="w-full h-full bg-[#252526] text-slate-300 text-xs rounded p-2 outline-none border border-slate-600 focus:border-indigo-500 focus:bg-[#1e1e1e] resize-none leading-relaxed transition-colors placeholder-slate-600"
        />
      </div>

      {/* PPT Content Row */}
      <div className="h-32 border-b border-slate-700 p-2 shrink-0 group">
        <textarea 
          value={track.pptContent || ''}
          onChange={(e) => updateTrack(track.id, 'pptContent', e.target.value)}
          placeholder="[Title]&#10;Slide Content..."
          className="w-full h-full bg-[#252526] text-slate-300 text-xs rounded p-2 outline-none border border-slate-600 focus:border-indigo-500 focus:bg-[#1e1e1e] resize-none leading-relaxed transition-colors placeholder-slate-600 font-sans"
        />
      </div>

      {/* Materials Row (Dynamic List) */}
      <div className="flex-1 border-b border-slate-700 p-2 flex flex-col gap-2 min-h-[200px] bg-[#1a1a1a] overflow-y-auto custom-scrollbar">
        {track.items.map((item, i) => (
          <div 
            key={item.id}
            onClick={(e) => { e.stopPropagation(); setSelectedItemId(item.id); setSelectedTrackId(track.id); }}
            className={`p-2 rounded border flex flex-col gap-1 group transition-all ${
              selectedItemId === item.id 
                ? 'bg-[#37373d] border-indigo-500 shadow-md' 
                : 'bg-[#252526] border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                {item.type === 'ppt' && <Presentation size={12} className="text-orange-400" />}
                {item.type === 'url' && <LinkIcon size={12} className="text-blue-400" />}
                {item.type === 'video' && <Video size={12} className="text-red-400" />}
                <span className="truncate max-w-[140px]">{item.title || 'Untitled'}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); moveItem(track.id, i, 'up'); }} className="p-1 hover:bg-slate-600 rounded"><ChevronUp size={10} /></button>
                <button onClick={(e) => { e.stopPropagation(); moveItem(track.id, i, 'down'); }} className="p-1 hover:bg-slate-600 rounded"><ChevronDown size={10} /></button>
                <button onClick={(e) => { e.stopPropagation(); deleteItem(track.id, item.id); }} className="p-1 hover:bg-rose-900/50 text-rose-400 rounded"><Trash2 size={10} /></button>
              </div>
            </div>
            
            {/* Note Input */}
            <div className="relative mt-1">
                <textarea 
                value={item.note || ''}
                onChange={(e) => updateItem(track.id, item.id, 'note', e.target.value)}
                placeholder="유의점 (Notes)..."
                className="w-full h-10 bg-[#1e1e1e] text-slate-400 text-[10px] rounded p-1.5 outline-none border border-slate-700 focus:border-indigo-500 resize-none transition-colors"
                onClick={(e) => e.stopPropagation()}
                />
            </div>
          </div>
        ))}
        
        {/* Add Item Buttons */}
        <div className="grid grid-cols-3 gap-1 mt-2 opacity-50 hover:opacity-100 transition-opacity">
          <button onClick={() => addItem(track.id, 'ppt')} className="flex flex-col items-center justify-center gap-1 p-2 bg-[#252526] hover:bg-[#333] rounded border border-slate-700 text-[10px] text-slate-400 hover:text-orange-400 transition">
            <Presentation size={14} /> PPT
          </button>
          <button onClick={() => addItem(track.id, 'url')} className="flex flex-col items-center justify-center gap-1 p-2 bg-[#252526] hover:bg-[#333] rounded border border-slate-700 text-[10px] text-slate-400 hover:text-blue-400 transition">
            <LinkIcon size={14} /> URL
          </button>
          <button onClick={() => addItem(track.id, 'video')} className="flex flex-col items-center justify-center gap-1 p-2 bg-[#252526] hover:bg-[#333] rounded border border-slate-700 text-[10px] text-slate-400 hover:text-red-400 transition">
            <Video size={14} /> Video
          </button>
        </div>
      </div>

      {/* Actions Row */}
      <div className="h-8 border-b border-slate-700 flex items-center justify-center gap-2 p-1 shrink-0 bg-[#252526]">
        <button onClick={(e) => { e.stopPropagation(); moveTrack(index, 'left'); }} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><ChevronLeft size={14} /></button>
        <button onClick={(e) => { e.stopPropagation(); moveTrack(index, 'right'); }} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><ChevronRight size={14} /></button>
        <div className="w-px h-3 bg-slate-700" />
        <button onClick={(e) => { e.stopPropagation(); duplicateTrack(track); }} className="p-1 hover:bg-indigo-900/30 text-indigo-400 rounded transition-colors"><Copy size={14} /></button>
        <button onClick={(e) => { e.stopPropagation(); deleteTrack(track.id); }} className="p-1 hover:bg-rose-900/30 text-rose-400 rounded transition-colors"><Trash2 size={14} /></button>
      </div>
    </div>
  );
};

export default TrackColumn;
