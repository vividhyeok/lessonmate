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
    <div className="flex-1 flex flex-col bg-slate-800 relative border-l border-slate-700">
      <div className="h-10 bg-[#252526] border-b border-slate-700 flex items-center px-4 justify-between shrink-0">
        <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-wider">
          <Presentation size={14} className="text-orange-400" /> PPT Preview
        </span>
        <span className="text-[10px] font-mono text-slate-500 bg-[#1e1e1e] px-2 py-1 rounded border border-slate-700">
          16:9 Aspect Ratio
        </span>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8 bg-[#1e1e1e] overflow-hidden relative custom-scrollbar">
        {/* Slide Container */}
        <div className="aspect-video w-full max-w-4xl bg-white shadow-2xl flex flex-col transition-all duration-300 rounded-lg overflow-hidden relative transform hover:scale-[1.01]">
            
            {/* Slide Header / Title Bar */}
            <div className="h-20 bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center px-8 shrink-0 shadow-md">
               <h1 className="text-3xl font-black text-white drop-shadow-sm tracking-tight truncate w-full">
                 {slideTitle}
               </h1>
            </div>

            {/* Slide Body */}
            <div className="flex-1 p-10 bg-white overflow-y-auto custom-scrollbar">
               <div className="text-2xl font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {slideBody ? (
                    slideBody.split('\n').map((line, i) => (
                      <p key={i} className="mb-4">{line}</p>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300 italic gap-2">
                      <Presentation size={48} className="opacity-20" />
                      <span>슬라이드 내용이 없습니다.</span>
                    </div>
                  )}
               </div>
            </div>

            {/* Slide Footer */}
            <div className="h-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between px-6 text-xs text-slate-400 font-medium shrink-0">
                <span>LessonMate AI Class</span>
                <span>{currentTrackIndex + 1} / {tracks ? tracks.length : '-'}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialPreview;
