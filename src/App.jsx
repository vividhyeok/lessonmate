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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Layout State
  const [topHeight, setTopHeight] = useState(50); // Percentage
  const [leftWidth, setLeftWidth] = useState(50); // Percentage
  const containerRef = useRef(null);
  const isResizingVertical = useRef(false);
  const isResizingHorizontal = useRef(false);

  // --- File Actions ---
  function loadLesson(file) {
    setCurrentFile(file);
    setTracks(file.tracks || []);
    if (file.tracks && file.tracks.length > 0) {
      setSelectedTrackId(file.tracks[0].id);
      const firstItems = file.tracks[0].items || [];
      if (firstItems.length > 0) {
        setSelectedItemId(firstItems[0].id);
      } else {
        setSelectedItemId(null);
      }
    } else {
      setSelectedTrackId(null);
      setSelectedItemId(null);
    }
  }

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

  const normalizeCsvUrl = (rawUrl) => {
    if (!rawUrl) return '';

    try {
      const url = new URL(rawUrl.trim());

      if (url.hostname.includes('docs.google.com') && url.pathname.includes('/spreadsheets/')) {
        const match = url.pathname.match(/\/d\/([^/]+)/);
        const gid = url.searchParams.get('gid') || '0';
        if (match?.[1]) {
          return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv&gid=${gid}`;
        }
      }

      if (url.hostname.includes('drive.google.com')) {
        const fileMatch = url.pathname.match(/\/file\/d\/([^/]+)/);
        if (fileMatch?.[1]) {
          return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
        }
      }

      return url.toString();
    } catch {
      return rawUrl.trim();
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

  const handleImportFromUrl = async () => {
    const rawUrl = prompt('CSV URL 또는 Google Drive/Sheets 공개 링크를 입력하세요.');
    if (!rawUrl) return;

    const url = normalizeCsvUrl(rawUrl);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const text = await response.text();
      const rows = parseCSV(text);
      if (rows.length === 0) {
        alert('CSV 데이터가 비어 있습니다.');
        return;
      }

      const lessonName = prompt('가져온 수업 이름', 'Google Drive Import') || 'Google Drive Import';
      const newTracks = processRows(rows);
      const newFile = createFile(lessonName);
      newFile.tracks = newTracks;
      saveFile(newFile);
      setFiles(getFiles());
      loadLesson(newFile);
      alert('URL에서 가져오기 완료!');
    } catch (error) {
      console.error(error);
      alert('URL 가져오기에 실패했습니다. 공개 링크/CSV 링크인지 확인해주세요.');
    }
  };

  function processRows(rows) {
      return rows.map((row, index) => {
          // row: [Stage, Activity, Teacher, Student, PPT Content, Time, Materials]
          
          let stage = 'dev';
          if (row[0] && row[0].includes('도입')) stage = 'intro';
          else if (row[0] && row[0].includes('정리')) stage = 'wrap';

          const cleanText = (text) => text ? text.replace(/<br>/gi, '\n').trim() : '';

          const teacherText = cleanText(row[2]);
          const studentText = cleanText(row[3]);
          const activity = cleanText(row[1]);
          
          // Determine format based on column count or content
          // New format (7 cols): Time is at index 5
          // Old format (6 cols): Time is at index 4
          
          let time = 0;
          let pptContent = '';
          let materialsText = '';

          // Simple heuristic: Check if col 5 is a number (Time) -> New Format
          // Or check if col 4 is a number (Time) -> Old Format
          const isCol5Time = !isNaN(parseInt(row[5]));
          const isCol4Time = !isNaN(parseInt(row[4]));

          if (isCol5Time) {
              // New 7-column format
              pptContent = cleanText(row[4]);
              time = parseInt(row[5]) || 0;
              materialsText = row[6] || '';
          } else if (isCol4Time) {
              // Old 6-column format
              time = parseInt(row[4]) || 0;
              materialsText = row[5] || '';
          } else {
              // Fallback, maybe header or malformed
              // Try to guess
              if (row.length >= 7) {
                  pptContent = cleanText(row[4]);
                  time = parseInt(row[5]) || 0;
                  materialsText = row[6] || '';
              } else {
                  time = parseInt(row[4]) || 0;
                  materialsText = row[5] || '';
              }
          }

          // Parse items from materialsText
          const items = [];
          if (materialsText) {
              const cleanMaterials = materialsText.replace(/<br>/gi, '\n');
              const parts = cleanMaterials.split('□');
              for (let i = 1; i < parts.length; i++) {
                  const part = parts[i];
                  const subParts = part.split('◆');
                  const title = subParts[0].trim();
                  const note = subParts.slice(1).join('\n').trim();
                  
                  items.push({
                      id: Date.now() + index * 100 + i,
                      type: 'ppt',
                      title: title,
                      content: '',
                      note: note
                  });
              }
          }

          return {
            id: Date.now() + index,
            stage: stage,
            time: time,
            teacher: `[${activity}]\n${teacherText}`,
            student: studentText,
            pptContent: pptContent,
            pptFontSize: 28,
            items: items
          };
        });
  }

  function parseCSV(text) {
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
  }

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
    
    // Prototype: Always load default lesson if not present or just force it for now
    // Check if "인공지능의 이해" exists, if not create it from default CSV
    const defaultLessonName = "인공지능의 이해";
    
    // Filter out the old "AI 수업 예시" if it exists to avoid duplicates/confusion
    const cleanedFiles = loadedFiles.filter(f => f.name !== "AI 수업 예시");
    
    const existingDefault = cleanedFiles.find(f => f.name === defaultLessonName);

    if (existingDefault) {
       setFiles(cleanedFiles);
       loadLesson(existingDefault);
    } else {
       // Parse default CSV and create file
       const rows = parseCSV(DEFAULT_LESSON_CSV);
       if (rows.length > 0) {
          const newTracks = processRows(rows);
          const newFile = createFile(defaultLessonName);
          newFile.tracks = newTracks;
          saveFile(newFile);
          
          // Update files list
          const newFiles = [...cleanedFiles, newFile];
          setFiles(newFiles);
          loadLesson(newFile);
       } else {
          setFiles(cleanedFiles);
       }
    }
    
  }, []);

  const handleSaveCurrent = () => {
    if (!currentFile) return;
    const updatedFile = { ...currentFile, tracks };
    saveFile(updatedFile);
    setFiles(getFiles()); // Refresh list to show updated time if we added that
    // alert("Saved!"); // Optional feedback
  };

  useEffect(() => {
    if (!currentFile?.id) return;

    const timer = setTimeout(() => {
      saveFile({ ...currentFile, tracks });
    }, 800);

    return () => clearTimeout(timer);
  }, [tracks, currentFile]);

  // Auto-save effect (optional, but user asked for "save button", so maybe manual is better. 
  // But keeping state in sync with currentFile object in memory is good practice)

  // --- Resize Logic ---
  const startResizeVertical = () => {
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

  const startResizeHorizontal = () => {
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
    if (newWidth > 35 && newWidth < 75) setLeftWidth(newWidth);
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
      pptContent: '',
      pptFontSize: 28,
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
    pptx.layout = 'LAYOUT_WIDE';

    pptx.addSlide().addText('교수학습 과정안', { x: 1, y: 2.5, w: 11, fontSize: 34, align: 'center', bold: true });

    tracks.forEach((track) => {
      const stageLabel = STAGES.find((st) => st.id === track.stage)?.label || track.stage;
      const baseFont = parseInt(track.pptFontSize, 10) || 28;
      const content = track.pptContent || '';
      const titleMatch = content.match(/^\[(.*?)\]([\s\S]*)$/);
      const title = titleMatch?.[1] || `${stageLabel} 단계`;
      const body = titleMatch?.[2]?.trim() || content;

      const slide = pptx.addSlide();
      slide.addText(title, { x: 0.5, y: 0.4, w: 12, h: 0.7, fontSize: 28, bold: true, color: '1F2937' });
      slide.addText(body || ' ', { x: 0.7, y: 1.3, w: 10.8, h: 3.8, fontSize: Math.max(14, Math.min(54, baseFont)), color: '334155' });

      let y = 5.3;
      track.items.forEach((item) => {
        const typeLabel = (item.type || 'ppt').toUpperCase();
        const line = `[${typeLabel}] ${item.title || 'Untitled'}`;

        if (item.url) {
          slide.addText(line, { x: 0.7, y, w: 10.8, h: 0.35, fontSize: 14, color: '2563EB', hyperlink: { url: item.url } });
          y += 0.4;
          slide.addText(item.url, { x: 1.0, y, w: 10.5, h: 0.3, fontSize: 10, color: '3B82F6', hyperlink: { url: item.url } });
        } else {
          slide.addText(line, { x: 0.7, y, w: 10.8, h: 0.35, fontSize: 14, color: '475569' });
        }

        y += 0.45;
        if (item.note) {
          slide.addText(`- ${item.note}`, { x: 1.0, y, w: 10.3, h: 0.5, fontSize: 11, color: '6B7280' });
          y += 0.55;
        }

        if (y > 6.7) y = 6.7;
      });

      slide.addNotes(`[${stageLabel}] ${track.teacher || ''}`);
    });

    pptx.writeFile({ fileName: '수업자료.pptx' });
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
          onImportFromUrl={handleImportFromUrl}
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
            totalTime={totalTime}
            width={leftWidth}
            startResizeHorizontal={startResizeHorizontal}
          />

          {/* Right: Item Preview (Editable) */}
          <MaterialPreview 
            selectedItem={selectedItem}
            updateItem={updateItem}
            selectedTrackId={selectedTrackId}
            tracks={tracks}
            updateTrack={updateTrack}
            lessonName={currentFile?.name}
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
          exportPDF={exportPDF}
        />
      </div>
    </div>
  );
};

export default App;
