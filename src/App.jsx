import React, { useState, useEffect, useMemo, useRef } from 'react';
import { STAGES } from './constants/stages';
import { DEFAULT_LESSON_CSV } from './constants/defaultLesson';
import { loadScript } from './utils/loadScript';
import { getFiles, saveFile, deleteFile, createFile } from './utils/storage';
import LessonPlanView from './components/LessonPlanView';
import MaterialPreview from './components/MaterialPreview';
import TimelineEditor from './components/TimelineEditor';
import FileExplorer from './components/FileExplorer';

const App = () => {
  // --- State ---
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Layout State
  const [topHeight, setTopHeight] = useState(50); // Percentage
  const [leftWidth, setLeftWidth] = useState(50); // Percentage
  const containerRef = useRef(null);
  const isResizingVertical = useRef(false);
  const isResizingHorizontal = useRef(false);

  // --- Effects ---
  useEffect(() => {
    const loadLibs = async () => {
      try {
        await loadScript('https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js');
      } catch (e) {
        console.error("Failed to load libraries", e);
      }
    };
    loadLibs();

    // Load Files from LocalStorage
    const loadedFiles = getFiles();
    setFiles(loadedFiles);
    
    // Prototype: Always load default lesson if not present or just force it for now
    // Check if "AI 수업 예시" exists, if not create it from default CSV
    const defaultLessonName = "AI 수업 예시";
    const existingDefault = loadedFiles.find(f => f.name === defaultLessonName);

    if (existingDefault) {
       loadLesson(existingDefault);
    } else {
       // Parse default CSV and create file
       const rows = parseCSV(DEFAULT_LESSON_CSV);
       if (rows.length > 0) {
          const newTracks = processRows(rows);
          const newFile = createFile(defaultLessonName);
          newFile.tracks = newTracks;
          saveFile(newFile);
          setFiles(getFiles());
          loadLesson(newFile);
       }
    }
    
    setIsLoaded(true);
  }, []);

  // --- File Actions ---
  const loadLesson = (file) => {
    setCurrentFile(file);
    setTracks(file.tracks || []);
    if (file.tracks && file.tracks.length > 0) {
      setSelectedTrackId(file.tracks[0].id);
      if (file.tracks[0].items.length > 0) {
        setSelectedItemId(file.tracks[0].items[0].id);
      }
    } else {
      setSelectedTrackId(null);
      setSelectedItemId(null);
    }
  };

  const handleCreateFile = () => {
    const name = prompt("Enter lesson name:", "New Lesson");
    if (name) {
      const newFile = createFile(name);
      setFiles(getFiles());
      loadLesson(newFile);
    }
  };

  const handleDeleteFile = (fileId) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      const updatedFiles = deleteFile(fileId);
      setFiles(updatedFiles);
      if (currentFile && currentFile.id === fileId) {
        if (updatedFiles.length > 0) {
          loadLesson(updatedFiles[0]);
        } else {
          setCurrentFile(null);
          setTracks([]);
        }
      }
    }
  };

  const handleImportFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      try {
        const rows = parseCSV(text);
        if (rows.length === 0) return;

        const newTracks = processRows(rows);

        const newFile = createFile(file.name.replace('.csv', ''));
        newFile.tracks = newTracks;
        saveFile(newFile);
        setFiles(getFiles());
        loadLesson(newFile);
        alert('Imported successfully!');

      } catch (err) {
        console.error(err);
        alert('Failed to parse CSV');
      }
    };
    reader.readAsText(file);
  };

  const processRows = (rows) => {
      return rows.map((row, index) => {
          // row: [Stage, Activity, Teacher, Student, Time, PPT Title, PPT Note, URL Title, URL Note, Video Title, Video Note]
          
          // Map stage
          let stage = 'dev';
          if (row[0] && row[0].includes('도입')) stage = 'intro';
          else if (row[0] && row[0].includes('정리')) stage = 'wrap';

          // Parse items
          const items = [];
          
          // 1. PPT (Col 5, 6)
          if (row[5] && row[5].trim()) {
             items.push({
                id: Date.now() + index * 100 + 1,
                type: 'ppt',
                title: row[5],
                content: '',
                note: row[6] || ''
             });
          }

          // 2. URL (Col 7, 8)
          if (row[7] && row[7].trim()) {
             items.push({
                id: Date.now() + index * 100 + 2,
                type: 'url',
                title: row[7],
                url: row[7], // Use title as initial URL
                content: '',
                note: row[8] || ''
             });
          }
          
          // 3. Video (Col 9, 10)
          if (row[9] && row[9].trim()) {
             items.push({
                id: Date.now() + index * 100 + 3,
                type: 'video',
                title: row[9],
                url: row[9], // Use title as initial URL/Search term
                content: '',
                note: row[10] || ''
             });
          }

          return {
            id: Date.now() + index,
            stage: stage,
            time: parseInt(row[4]) || 0,
            teacher: `[${row[1]}]\n${row[2]}`,
            student: row[3],
            items: items
          };
        });
  };

  const parseCSV = (text) => {
    const result = [];
    let row = [];
    let inQuotes = false;
    let current = '';
    
    // Normalize line endings
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Skip header (find first newline)
    let startIdx = normalizedText.indexOf('\n') + 1;
    if (startIdx === 0) return []; // Empty or single line

    for (let i = startIdx; i < normalizedText.length; i++) {
      const char = normalizedText[i];
      
      if (char === '"') {
        if (i + 1 < normalizedText.length && normalizedText[i+1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(current);
        current = '';
      } else if (char === '\n' && !inQuotes) {
        row.push(current);
        if (row.some(cell => cell.trim() !== '')) {
            result.push(row);
        }
        row = [];
        current = '';
      } else {
        current += char;
      }
    }
    // Push last row if exists
    if (current || row.length > 0) {
      row.push(current);
      if (row.some(cell => cell.trim() !== '')) {
        result.push(row);
      }
    }
    return result;
  };

  const handleSaveCurrent = () => {
    if (!currentFile) return;
    const updatedFile = { ...currentFile, tracks };
    saveFile(updatedFile);
    setFiles(getFiles()); // Refresh list to show updated time if we added that
    // alert("Saved!"); // Optional feedback
  };

  // Auto-save effect (optional, but user asked for "save button", so maybe manual is better. 
  // But keeping state in sync with currentFile object in memory is good practice)
  useEffect(() => {
    if (currentFile) {
      setCurrentFile(prev => ({ ...prev, tracks }));
    }
  }, [tracks]);

  // --- Resize Logic ---
  const startResizeVertical = (e) => {
    isResizingVertical.current = true;
    document.addEventListener('mousemove', handleResizeVertical);
    document.addEventListener('mouseup', stopResizeVertical);
  };

  const handleResizeVertical = (e) => {
    if (!isResizingVertical.current || !containerRef.current) return;
    const containerHeight = containerRef.current.clientHeight;
    const newHeight = (e.clientY / containerHeight) * 100;
    if (newHeight > 10 && newHeight < 90) setTopHeight(newHeight);
  };

  const stopResizeVertical = () => {
    isResizingVertical.current = false;
    document.removeEventListener('mousemove', handleResizeVertical);
    document.removeEventListener('mouseup', stopResizeVertical);
  };

  const startResizeHorizontal = (e) => {
    isResizingHorizontal.current = true;
    document.addEventListener('mousemove', handleResizeHorizontal);
    document.addEventListener('mouseup', stopResizeHorizontal);
  };

  const handleResizeHorizontal = (e) => {
    if (!isResizingHorizontal.current || !containerRef.current) return;
    e.preventDefault(); // Prevent selection
    const containerRect = containerRef.current.getBoundingClientRect();
    // Calculate relative to the container, not viewport
    const relativeX = e.clientX - containerRect.left;
    // Adjust for sidebar width if it's open
    const sidebarWidth = isSidebarOpen ? 256 : 0; // 64 * 4 = 256px (w-64)
    const availableWidth = containerRect.width - sidebarWidth;
    const adjustedX = relativeX - sidebarWidth;
    
    const newWidth = (adjustedX / availableWidth) * 100;
    if (newWidth > 10 && newWidth < 90) setLeftWidth(newWidth);
  };

  const stopResizeHorizontal = () => {
    isResizingHorizontal.current = false;
    document.removeEventListener('mousemove', handleResizeHorizontal);
    document.removeEventListener('mouseup', stopResizeHorizontal);
  };

  // --- Actions ---
  const addTrack = () => {
    const newTrack = {
      id: `t_${Date.now()}`,
      stage: 'intro',
      time: 5,
      teacher: '',
      student: '',
      items: []
    };
    setTracks([...tracks, newTrack]);
    setSelectedTrackId(newTrack.id);
    setSelectedItemId(null);
  };

  const updateTrack = (id, field, value) => {
    setTracks(tracks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const deleteTrack = (id) => {
    const newTracks = tracks.filter(t => t.id !== id);
    setTracks(newTracks);
    if (selectedTrackId === id) {
      setSelectedTrackId(newTracks.length > 0 ? newTracks[0].id : null);
      setSelectedItemId(null);
    }
  };

  const moveTrack = (index, direction) => {
    if ((direction === 'up' || direction === 'left') && index > 0) {
      const newTracks = [...tracks];
      [newTracks[index - 1], newTracks[index]] = [newTracks[index], newTracks[index - 1]];
      setTracks(newTracks);
    } else if ((direction === 'down' || direction === 'right') && index < tracks.length - 1) {
      const newTracks = [...tracks];
      [newTracks[index], newTracks[index + 1]] = [newTracks[index + 1], newTracks[index]];
      setTracks(newTracks);
    }
  };

  const duplicateTrack = (track) => {
    const newTrack = { 
      ...track, 
      id: `t_${Date.now()}`,
      items: track.items.map(i => ({ ...i, id: `i_${Date.now()}_${Math.random()}` }))
    };
    setTracks([...tracks, newTrack]);
  };

  // --- Item Actions ---
  const addItem = (trackId, type) => {
    const newItem = {
      id: `i_${Date.now()}`,
      type,
      title: type === 'ppt' ? 'New Slide' : type === 'url' ? 'New Link' : 'New Item',
      content: '',
      url: ''
    };
    setTracks(tracks.map(t => {
      if (t.id === trackId) {
        return { ...t, items: [...t.items, newItem] };
      }
      return t;
    }));
    setSelectedItemId(newItem.id);
    setSelectedTrackId(trackId);
  };

  const updateItem = (trackId, itemId, field, value) => {
    setTracks(tracks.map(t => {
      if (t.id === trackId) {
        return {
          ...t,
          items: t.items.map(i => i.id === itemId ? { ...i, [field]: value } : i)
        };
      }
      return t;
    }));
  };

  const deleteItem = (trackId, itemId) => {
    setTracks(tracks.map(t => {
      if (t.id === trackId) {
        return { ...t, items: t.items.filter(i => i.id !== itemId) };
      }
      return t;
    }));
    if (selectedItemId === itemId) setSelectedItemId(null);
  };

  const moveItem = (trackId, index, direction) => {
    setTracks(tracks.map(t => {
      if (t.id === trackId) {
        const newItems = [...t.items];
        if (direction === 'up' && index > 0) {
          [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
        } else if (direction === 'down' && index < newItems.length - 1) {
          [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        }
        return { ...t, items: newItems };
      }
      return t;
    }));
  };

  // --- Export ---
  const exportExcel = () => {
    if (!window.XLSX) return;
    const data = tracks.map((t, i) => ({
      '순서': i + 1,
      '단계': STAGES.find(s => s.id === t.stage)?.label,
      '시간(분)': t.time,
      '교수 활동': t.teacher,
      '학습 활동': t.student,
      '자료 및 유의점': t.items.map(item => {
        if (item.type === 'ppt') return `[PPT] ${item.title}`;
        if (item.type === 'url') return `[URL] ${item.title} (${item.url})`;
        return `[${item.type}] ${item.title}`;
      }).join('\n')
    }));
    const ws = window.XLSX.utils.json_to_sheet(data);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "LessonPlan");
    window.XLSX.writeFile(wb, "교수학습과정안.xlsx");
  };

  const exportPPT = () => {
    if (!window.PptxGenJS) return;
    const pptx = new window.PptxGenJS();
    pptx.addSlide().addText("교수학습 과정안", { x: 1, y: 2.5, w: 8, fontSize: 36, align: 'center', bold: true });

    tracks.forEach(t => {
      t.items.filter(i => i.type === 'ppt').forEach(item => {
        const s = pptx.addSlide();
        s.addText(item.title || "제목 없음", { x: 0.5, y: 0.5, w: 9, fontSize: 24, bold: true, color: '363636' });
        s.addText(item.content || "", { x: 0.5, y: 1.5, w: 9, fontSize: 18, color: '666666', bullet: true });
        s.addNotes(`[${STAGES.find(st => st.id === t.stage)?.label}] ${t.teacher}`);
      });
    });
    pptx.writeFile({ fileName: "수업자료.pptx" });
  };

  const exportPDF = () => {
    // Simple print-based PDF export
    // We will add a style tag to hide everything except the lesson plan view during print
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #lesson-plan-view, #lesson-plan-view * {
          visibility: visible;
        }
        #lesson-plan-view {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: auto;
          overflow: visible;
          background: white;
        }
        /* Hide scrollbars and UI elements inside the view if any */
        ::-webkit-scrollbar {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  const selectedItem = useMemo(() => {
    if (!selectedTrackId || !selectedItemId) return null;
    const track = tracks.find(t => t.id === selectedTrackId);
    return track?.items.find(i => i.id === selectedItemId);
  }, [tracks, selectedTrackId, selectedItemId]);

  const totalTime = useMemo(() => tracks.reduce((acc, t) => acc + (parseInt(t.time) || 0), 0), [tracks]);

  return (
    <div ref={containerRef} className="flex h-screen bg-slate-900 text-slate-300 font-sans overflow-hidden select-none">
      
      {/* Sidebar: File Explorer */}
      {isSidebarOpen && (
        <FileExplorer 
          files={files}
          currentFileId={currentFile?.id}
          onSelectFile={loadLesson}
          onCreateFile={handleCreateFile}
          onDeleteFile={handleDeleteFile}
          onSaveCurrent={handleSaveCurrent}
          onImportFile={handleImportFile}
          onToggleSidebar={() => setIsSidebarOpen(false)}
        />
      )}
      {!isSidebarOpen && (
        <div className="w-8 bg-[#333333] border-r border-slate-700 flex flex-col items-center py-2">
           <button onClick={() => setIsSidebarOpen(true)} className="p-1 hover:bg-slate-600 rounded text-slate-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" x2="9" y1="3" y2="21"/></svg>
           </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Top Section: Previews */}
        <div style={{ height: `${topHeight}%` }} className="flex relative">
          
          {/* Left: Table Preview (HWP Style) */}
          <LessonPlanView 
            tracks={tracks}
            selectedId={selectedTrackId}
            setSelectedId={setSelectedTrackId}
            updateTrack={updateTrack}
            totalTime={totalTime}
            width={leftWidth}
            startResizeHorizontal={startResizeHorizontal}
          />

          {/* Right: Item Preview (Editable) */}
          <MaterialPreview 
            selectedItem={selectedItem}
            updateItem={updateItem}
            selectedTrackId={selectedTrackId}
          />
        </div>

        {/* Vertical Resizer Handle */}
        <div 
          className="h-1 bg-slate-700 hover:bg-indigo-500 cursor-row-resize z-20 transition-colors"
          onMouseDown={startResizeVertical}
        />

        {/* Bottom Section: Timeline Editor */}
        <TimelineEditor 
          tracks={tracks}
          selectedTrackId={selectedTrackId}
          setSelectedTrackId={setSelectedTrackId}
          selectedItemId={selectedItemId}
          setSelectedItemId={setSelectedItemId}
          addTrack={addTrack}
          updateTrack={updateTrack}
          deleteTrack={deleteTrack}
          moveTrack={moveTrack}
          duplicateTrack={duplicateTrack}
          addItem={addItem}
          updateItem={updateItem}
          deleteItem={deleteItem}
          moveItem={moveItem}
          exportExcel={exportExcel}
          exportPPT={exportPPT}
        />
      </div>
    </div>
  );
};

export default App;
