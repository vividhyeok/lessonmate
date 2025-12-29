const STORAGE_KEY = 'lessonmate_files';

const SAMPLE_LESSON = {
  id: 'test_lesson_1',
  name: 'Test Lesson Plan',
  updatedAt: new Date().toISOString(),
  tracks: [
    {
      id: 't_1',
      stage: 'intro',
      time: 5,
      teacher: 'Greet students and check attendance.',
      student: 'Sit down and prepare books.',
      items: [
        { id: 'i_1', type: 'ppt', title: 'Welcome Slide', content: '- Hello\n- Today\'s Topic' }
      ]
    },
    {
      id: 't_2',
      stage: 'dev',
      time: 15,
      teacher: 'Explain the core concept of gravity.',
      student: 'Take notes and ask questions.',
      items: [
        { id: 'i_2', type: 'video', title: 'Gravity Demo', url: 'https://www.youtube.com/watch?v=7a8eF8jW1_o' }
      ]
    }
  ]
};

export const getFiles = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with sample if empty
    const initial = [SAMPLE_LESSON];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

export const saveFile = (file) => {
  const files = getFiles();
  const index = files.findIndex(f => f.id === file.id);
  if (index >= 0) {
    files[index] = { ...file, updatedAt: new Date().toISOString() };
  } else {
    files.push({ ...file, updatedAt: new Date().toISOString() });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  return files;
};

export const deleteFile = (fileId) => {
  const files = getFiles().filter(f => f.id !== fileId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  return files;
};

export const createFile = (name) => {
  const newFile = {
    id: `f_${Date.now()}`,
    name: name || 'Untitled Lesson',
    updatedAt: new Date().toISOString(),
    tracks: []
  };
  saveFile(newFile);
  return newFile;
};
