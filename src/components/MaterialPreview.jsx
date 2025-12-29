import React from 'react';
import { Presentation } from 'lucide-react';

const MaterialPreview = ({ selectedItem, updateItem, selectedTrackId, tracks }) => {
  // Find active slide content (current or previous)
  const currentTrackIndex = tracks ? tracks.findIndex(t => t.id === selectedTrackId) : -1;
  let activeContent = "";
  
  if (currentTrackIndex !== -1) {
    for (let i = currentTrackIndex; i >= 0; i--) {
      const t = tracks[i];
      if (t.pptContent && t.pptContent.trim().length > 0) {
        activeContent = t.pptContent;
        break;
      }
    }
  }

  // Parse Title and Body from Content
  // Format: [Title] Body...
  let slideTitle = "인공지능의 이해";
  let slideBody = activeContent;

  if (activeContent) {
    const match = activeContent.match(/^\[(.*?)\]([\s\S]*)$/);
    if (match) {
      slideTitle = match[1];
      slideBody = match[2].trim();
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-800 relative">
      <div className="h-8 bg-slate-900 border-b border-slate-700 flex items-center px-4 justify-between shrink-0">
        <span className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
          <Presentation size={14} /> PPT Preview - 인공지능의 이해
        </span>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8 bg-[#1e1e1e] overflow-hidden relative">
        <div className="aspect-video w-full max-w-3xl bg-white shadow-2xl flex flex-col transition-all duration-300">
            {/* Slide Header / Title */}
            <div className="p-6 pb-4 border-b-4 border-indigo-500 flex gap-4">
               <h1 className="text-3xl font-black text-slate-900">{slideTitle}</h1>
            </div>

            {/* Slide Body */}
            <div className="flex-1 p-8 pt-6 overflow-auto">
               <div className="text-2xl font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {slideBody || <span className="text-slate-300 italic">내용 없음</span>}
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialPreview;
