import React, { useState, useRef } from 'react';
import { Folder, File, Plus, Trash2, Save, Upload, Link2 } from 'lucide-react';

const FileExplorer = ({
  files,
  currentFileId,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onSaveCurrent,
  onImportFile,
  onImportFromUrl,
  onToggleSidebar
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImportFile(file);
    }
    e.target.value = null;
  };

  return (
    <div className="w-64 bg-[#252526] border-r border-slate-700 flex flex-col h-full shrink-0">
      <div className="h-8 px-4 flex items-center justify-between bg-[#333333] text-slate-300 text-xs font-bold uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <button onClick={onToggleSidebar} className="hover:text-white"><Folder size={14} /></button>
          <span>Explorer</span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => fileInputRef.current.click()} className="p-1 hover:bg-slate-600 rounded" title="Import CSV">
            <Upload size={14} />
          </button>
          <button onClick={onImportFromUrl} className="p-1 hover:bg-slate-600 rounded" title="Import CSV from URL / Google Drive">
            <Link2 size={14} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          <button onClick={onCreateFile} className="p-1 hover:bg-slate-600 rounded" title="New File">
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="mb-2">
          <div
            className="flex items-center gap-1 text-slate-400 text-xs font-bold px-2 py-1 cursor-pointer hover:text-slate-200"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Folder size={14} className={isExpanded ? 'text-indigo-400' : 'text-slate-500'} />
            <span>MY LESSONS</span>
          </div>

          {isExpanded && (
            <div className="mt-1 ml-2 flex flex-col gap-0.5">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`group flex items-center justify-between px-2 py-1.5 rounded cursor-pointer text-xs ${
                    currentFileId === file.id
                      ? 'bg-[#37373d] text-white'
                      : 'text-slate-400 hover:bg-[#2a2d2e] hover:text-slate-200'
                  }`}
                  onClick={() => onSelectFile(file)}
                >
                  <div className="flex items-center gap-2 truncate">
                    <File size={14} className="text-blue-400 shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(file.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-900/50 text-rose-400 rounded"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {files.length === 0 && (
                <div className="px-4 py-2 text-slate-600 italic text-xs">No files found</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-2 border-t border-slate-700 space-y-2">
        <div className="text-[10px] text-slate-500 leading-relaxed px-1">
          Google Drive/Sheets의 <span className="text-slate-400">공개 링크</span>를 붙여 CSV를 바로 가져올 수 있습니다.
        </div>
        <button
          onClick={onSaveCurrent}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-xs font-bold transition"
        >
          <Save size={14} /> Save Current
        </button>
      </div>
    </div>
  );
};

export default FileExplorer;
