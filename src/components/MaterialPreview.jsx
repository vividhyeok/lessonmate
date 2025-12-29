import React from 'react';
import { Monitor } from 'lucide-react';

const MaterialPreview = ({ selectedItem, updateItem, selectedTrackId }) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-800 relative">
      <div className="h-8 bg-slate-900 border-b border-slate-700 flex items-center px-4 justify-between shrink-0">
        <span className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
          <Monitor size={14} /> Material Preview
        </span>
        {selectedItem && (
          <span className="text-xs font-mono text-indigo-400 bg-indigo-900/30 px-2 py-0.5 rounded">
            {selectedItem.type.toUpperCase()}
          </span>
        )}
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8 bg-[#1e1e1e] overflow-hidden relative">
        {selectedItem ? (
          <div className="aspect-video w-full max-w-3xl bg-white shadow-2xl flex flex-col transition-all duration-300">
            {/* Header */}
            <div className="p-6 pb-4 border-b-4 border-indigo-500 flex gap-4">
              <div className="flex-1">
                <input 
                  type="text" 
                  value={selectedItem.title}
                  onChange={(e) => updateItem(selectedTrackId, selectedItem.id, 'title', e.target.value)}
                  placeholder="Title"
                  className="w-full text-3xl font-black text-slate-900 placeholder-slate-300 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 p-8 pt-6 overflow-auto flex flex-col gap-4">
              <div className="flex-1">
                {selectedItem.type === 'ppt' && (
                  <textarea 
                    value={selectedItem.content}
                    onChange={(e) => updateItem(selectedTrackId, selectedItem.id, 'content', e.target.value)}
                    placeholder="Slide Content (Bullets)..."
                    className="w-full h-full text-xl font-medium text-slate-600 placeholder-slate-200 outline-none bg-transparent resize-none leading-relaxed"
                  />
                )}
                {(selectedItem.type === 'url' || selectedItem.type === 'video') && (
                  <div className="flex flex-col gap-4 h-full">
                    <input 
                      type="text" 
                      value={selectedItem.url || selectedItem.content} // Fallback to content if url is missing (for backward compatibility)
                      onChange={(e) => updateItem(selectedTrackId, selectedItem.id, 'url', e.target.value)}
                      placeholder="https://..."
                      className="w-full text-lg text-blue-600 underline placeholder-slate-300 outline-none bg-slate-50 p-2 rounded"
                    />
                    <div className="flex-1 bg-slate-100 rounded flex items-center justify-center text-slate-400 overflow-hidden">
                      {(selectedItem.url || selectedItem.content) ? (
                        <iframe 
                          src={(selectedItem.url || selectedItem.content).replace('watch?v=', 'embed/')} 
                          className="w-full h-full" 
                          title="Preview"
                          frameBorder="0"
                          allowFullScreen
                        />
                      ) : (
                        <span>Enter URL to preview</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Note Section */}
              <div className="border-t pt-4 mt-auto">
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Note (유의점)</label>
                <textarea 
                  value={selectedItem.note || ''}
                  onChange={(e) => updateItem(selectedTrackId, selectedItem.id, 'note', e.target.value)}
                  placeholder="유의점을 입력하세요..."
                  className="w-full h-20 text-sm text-slate-600 bg-slate-50 p-2 rounded outline-none resize-none border border-transparent focus:border-indigo-300"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-slate-600 font-black text-xl">SELECT AN ITEM TO EDIT</div>
        )}
      </div>
    </div>
  );
};

export default MaterialPreview;
