const STORAGE_KEY = 'lessonmate_files';

const SAMPLE_LESSON = {
  id: 'lesson_ai_intro',
  name: '인공지능의 이해 (AI Basic)',
  updatedAt: new Date().toISOString(),
  tracks: [
    {
      id: 't_1',
      stage: 'intro',
      time: 3,
      teacher: '- Google Form/Docs 설문 제시 (출석+워밍업 질문) 예시 문항: ① 이름/번호 (출석) ② "오늘 아침에 AI를 어디에서 접했나요?"',
      student: '- 이름·번호 입력 (출석) - 간단히 응답 (예: "유튜브 추천 영상", "카카오톡 챗봇", "없음")',
      items: [
        { id: 'i_1', type: 'url', title: 'Google Form/Docs', content: '' },
        { id: 'i_2', type: 'ppt', title: '유의점', content: '출석 관리와 학습 참여 동시 달성, "없음" 응답도 존중' }
      ]
    },
    {
      id: 't_2',
      stage: 'intro',
      time: 4,
      teacher: '- MBCNEWS AI 사례 영상 제시 ([더AI①] 사람처럼 학습해 운전하고 계산하고…"이미 상업화 문턱 넘었다" (2025.07.14/뉴스데스크/MBC)) - 제시 전 "방금 여러분 답변이랑 연결되는 장면이 있어요" 멘트',
      student: '- 스마트폰으로 단어 입력 - 화면에 자신의 답이 결과에 반영됨을 실시간 확인 - 다른 친구들의 의견도 확인 가능',
      items: [
        { id: 'i_3', type: 'video', title: '유튜브 영상(PPT 삽입)', content: '' },
        { id: 'i_4', type: 'ppt', title: '유의점', content: '4분 이하의 자극적이지 않으면서 신기한 사례 위주의 영상 사용' }
      ]
    },
    {
      id: 't_3',
      stage: 'intro',
      time: 2,
      teacher: '- 질문: "인공지능 하면 떠오르는 단어는?" 제시 - 워드클라우드 화면 공유 - 예상 단어 유추 제시',
      student: '- 단어 입력 (예: "로봇", "챗GPT", "알파고", "자율주행차", "스마트폰", "AI 스피커", "편리함", "두려움") - 결과 시각화 확인',
      items: [
        { id: 'i_5', type: 'url', title: 'Mentimeter', content: '' },
        { id: 'i_6', type: 'ppt', title: '유의점', content: '실시간 참여·시각화로 몰입 유도, 긍정/부정 단어 모두 허용' }
      ]
    },
    {
      id: 't_4',
      stage: 'intro',
      time: 3,
      teacher: '- Mentimeter 워드클라우드 결과를 화면에 띄운 채로 진행. - 학생들이 제시한 키워드를 토대로 학습 목표를 확장 설명. - PPT로 학습 목표 2가지를 제시한다.',
      student: '- 목표 확인 - 필기',
      items: [
        { id: 'i_7', type: 'ppt', title: 'PPT 자료', content: '' },
        { id: 'i_8', type: 'ppt', title: '유의점', content: '목표를 간단·명료하게 제시' }
      ]
    },
    {
      id: 't_5',
      stage: 'dev',
      time: 3,
      teacher: '- PPT로 AI 개념과 세 가지 특성(학습·추론·자율성) 체계적으로 설명 - 일상 사례(추천 시스템, 체스 엔진, 자율주행차) 시각자료 제시',
      student: '- 필기 - 생활 경험과 연결 ("저거 본 적 있어요")',
      items: [
        { id: 'i_9', type: 'ppt', title: 'PPT', content: '' },
        { id: 'i_10', type: 'ppt', title: '교과서', content: '' },
        { id: 'i_11', type: 'ppt', title: '유의점', content: '설명은 짧고 예시는 풍부하게\n"여러분이 아까 말한 답이 여기에 들어가요" 연결 강조' }
      ]
    },
    {
      id: 't_6',
      stage: 'dev',
      time: 2,
      teacher: '- YTN 사이언스 「컴퓨터와 인공지능의 아버지, 앨런 튜링」 영상(2분) 제시 - 시청 전 발문: "튜링은 \'컴퓨터가 사람처럼 생각할 수 있는가\'를 어떻게 확인했을까요?"',
      student: '- 영상 집중 시청 - 간단한 메모(키워드: 대화, 구분, 지능적 판단)',
      items: [
        { id: 'i_12', type: 'video', title: 'YTN 사이언스 영상', content: '' },
        { id: 'i_13', type: 'ppt', title: '유의점', content: '영상은 길지 않아 집중도 유지 가능\n시청 전·후 질문으로 \'단순 시청\'에 그치지 않게 함' }
      ]
    },
    {
      id: 't_7',
      stage: 'dev',
      time: 5,
      teacher: '- Mentimeter OX/객관식 2~3문항 제시 - 정답 공개 후 간단 해설',
      student: '- 스마트폰으로 응답 - 결과 보고 환호·실망',
      items: [
        { id: 'i_14', type: 'url', title: 'Mentimeter', content: '' },
        { id: 'i_15', type: 'ppt', title: '유의점', content: '다수 오답일 때 "좋은 착각이에요. 이건 이렇게 보면 맞아요" 식으로 부드럽게 교정' }
      ]
    },
    {
      id: 't_8',
      stage: 'dev',
      time: 5,
      teacher: '- PPT로 사회 각 분야 사례(교통·의료·교육 등) 제시 - 학생 답변 기반(도입부에서 나온 키워드)과 교사가 준비한 사례를 대조 정리',
      student: '- "아, 이건 우리가 말한 거랑 비슷해요" - "그건 생각 못 했네요"',
      items: [
        { id: 'i_16', type: 'ppt', title: 'PPT', content: '' },
        { id: 'i_17', type: 'ppt', title: '유의점', content: '학생 답을 먼저 인정 → 그 뒤 교사 준비 사례 추가\n틀린 답은 "좋은 아이디어지만 여기선 ---에 가까워요" 식으로 정정' }
      ]
    },
    {
      id: 't_9',
      stage: 'dev',
      time: 5,
      teacher: '- PPT에 "자주 혼동하는 부분" 슬라이드 제시 예: 학습 vs 추론 혼동, 자율성=자동화로만 오해 - "이런 생각 많이 해요 → 사실은 이렇게 구분해요" 식으로 정리',
      student: '- "저도 그렇게 생각했어요" 반응 - 수정된 개념 받아 적기',
      items: [
        { id: 'i_18', type: 'ppt', title: 'PPT', content: '' },
        { id: 'i_19', type: 'ppt', title: '유의점', content: '"틀린 게 아니다, 과정에서 흔히 생기는 생각"으로 언어 톤 조절\n학생 발언 활용해 정정 연결' }
      ]
    },
    {
      id: 't_10',
      stage: 'dev',
      time: 9,
      teacher: '- \'문장들 활동\' 진행 - 방금 사례와 특성을 연결해 문장 완성하기 과제 제시 예: "---은(는) AI의 --- 특성과 관련 있다. 이유는 --- 때문이다."',
      student: '- 개별로 작성 (상위권: 구체적, 중하위권: 단순 표현)',
      items: [
        { id: 'i_20', type: 'ppt', title: '문장들 카드', content: '' },
        { id: 'i_21', type: 'ppt', title: '유의점', content: '최소 1개 이상 작성 강제\n중하위권엔 키워드 카드 보조 제공' }
      ]
    },
    {
      id: 't_11',
      stage: 'dev',
      time: 9,
      teacher: '- 개별 활동(문장들 활동) 내용 공유 후 서로 첨삭 - 규칙: "서로의 문장 읽어주고, 이유 부분만 질문해주기" - 교사 순회하며 부족한 이유 보완',
      student: '- 서로 문장 읽어주고 간단 피드백 - 발표 대비 준비',
      items: [
        { id: 'i_22', type: 'ppt', title: '활동지', content: '' },
        { id: 'i_23', type: 'ppt', title: '유의점', content: '무시 방지 위해 질문 보완 규칙 제시\n교사가 중하위 답변에 V 표시해 발표 유도' }
      ]
    },
    {
      id: 't_12',
      stage: 'dev',
      time: 5,
      teacher: '- 휴식 후 수업 분위기 환기 멘트 - 오늘 활동 절차 안내: "조별 카드 꾸미기 → 게시 → 발표 → 정리"',
      student: '- 주의 집중 - 활동 절차 확인',
      items: [
        { id: 'i_24', type: 'ppt', title: 'PPT 활동 절차 슬라이드', content: '' },
        { id: 'i_25', type: 'ppt', title: '유의점', content: '쉬는 시간 이후 집중력 저하를 고려해 간단하고 명확한 지시' }
      ]
    },
    {
      id: 't_13',
      stage: 'dev',
      time: 3,
      teacher: '- 조별로 카드(빈칸 문장 틀)+꾸미기 도구 배부 - 활동 방법 안내 ("앞서 배운 AI 정의·활용 키워드를 정리하고 그림·도형·색으로 꾸며 표현") - 책상 배치를 모둠형으로 유도',
      student: '- 교사 안내에 따라 팀별로 책상 재배치 - 활동지 카드 및 꾸미기 도구 수령',
      items: [
        { id: 'i_26', type: 'ppt', title: '활동지 카드, 사인펜, 색연필', content: '' },
        { id: 'i_27', type: 'ppt', title: '유의점', content: '자리 재배치가 지체되지 않도록 교사가 순서·위치 미리 안내' }
      ]
    },
    {
      id: 't_14',
      stage: 'dev',
      time: 9,
      teacher: '- 모둠별 논의 진행 상황 확인 - 학생 간 역할 분담 지도 (기록·그림·발표 준비자) - 소극적 학생에게 단순 기록·그리기 역할 배정',
      student: '- 조원들과 논의하며 AI 정의·활용 키워드 정리 - 카드에 개념·사례 기록 - 그림·도형·색으로 꾸며 표현',
      items: [
        { id: 'i_28', type: 'ppt', title: '활동지 카드, 사인펜, 색연필', content: '' },
        { id: 'i_29', type: 'ppt', title: '유의점', content: '참여 격차 방지: 역할 분담 필수화 ("한 명 그림, 한 명 기록")' }
      ]
    },
    {
      id: 't_15',
      stage: 'dev',
      time: 3,
      teacher: '- 저참여 학생에게 직접 질문 유도 예시 발문: "이 사례는 어떤 특성과 연결될까?" "영상에서 본 사례랑 어떻게 비슷하지?" - 답변이 짧아도 긍정 피드백 후 보완 질문',
      student: '- 교사의 질문에 응답 - 부족한 부분을 추가로 보완하여 카드 완성',
      items: [
        { id: 'i_30', type: 'ppt', title: '활동지 카드', content: '' },
        { id: 'i_31', type: 'ppt', title: '유의점', content: '질문은 단순→심화 순서로 제시\n소극적 학생에게 우선 기회 제공' }
      ]
    },
    {
      id: 't_16',
      stage: 'dev',
      time: 5,
      teacher: '- 각 조별 대표를 지정해 완성된 카드를 칠판에 부착하도록 안내 - 다른 조의 카드를 관찰하며 비교할 수 있도록 유도 - "비슷한 점은 무엇인지, 다른 점은 무엇인지 눈여겨보세요" 발문',
      student: '- 조별 대표가 카드 부착 - 다른 조의 카드를 살펴보며 유사점·차이점 관찰',
      items: [
        { id: 'i_32', type: 'ppt', title: '완성된 카드, 칠판', content: '' },
        { id: 'i_33', type: 'ppt', title: '유의점', content: '게시 시간 지체 방지를 위해 순서와 위치 미리 지정\n학생들이 단순히 붙이고 끝내지 않도록 관찰 포인트 제시' }
      ]
    },
    {
      id: 't_17',
      stage: 'dev',
      time: 7,
      teacher: '- 각 조 대표가 앞에 나와 카드 내용을 설명하도록 진행 - 발표마다 격려 및 칭찬, 전체 박수 유도 - 틀린 개념은 직접 지적하지 않고 "좋은 시도인데, 조금 더 정확히는…" 방식으로 정정 - 발표하지 않은 학생에게도 참여 기회 부여',
      student: '- 조별 대표가 카드 설명 발표 - 다른 학생들은 경청 후 필요시 질문 - 박수와 피드백 참여',
      items: [
        { id: 'i_34', type: 'ppt', title: '조별 카드', content: '' },
        { id: 'i_35', type: 'ppt', title: '유의점', content: '특정 우수 학생만 반복적으로 발표하지 않도록 지도\n유사 발표 내용은 교사가 묶어서 간단히 정리\n발표 태도 및 언어 사용도 함께 피드백' }
      ]
    },
    {
      id: 't_18',
      stage: 'dev',
      time: 2,
      teacher: '- "각 조가 제시한 AI 사례가 해결하는 문제에는 어떤 공통점과 차이점이 있나요?" 질문 - 학생 답변을 칠판에 기록하여 공통점과 차이점 분류 - 필요한 경우 추가 질문으로 사고 확장 유도',
      student: '- 학생들이 모둠별 결과를 서로 비교 - 공통점/차이점 의견을 제시 - 발표자 외 학생들도 짧게 의견 제시',
      items: [
        { id: 'i_36', type: 'ppt', title: '칠판, 판서 도구', content: '' },
        { id: 'i_37', type: 'ppt', title: '유의점', content: '중복된 의견은 교사가 묶어 정리\n발표 기회를 다양한 학생에게 배분\n시간 관리 철저 (짧고 간결하게)' }
      ]
    },
    {
      id: 't_19',
      stage: 'dev',
      time: 3,
      teacher: '- "아직 발표하지 못한 친구가 정리해볼까요?" 발문 - 개별 학생을 지명하여 발표 기회 제공 - 학생 답변을 긍정적으로 수용하면서 보완 설명',
      student: '- 새로 지명된 학생이 비슷한 점·다른 점을 요약 발표 - 나머지 학생들은 피드백 및 박수',
      items: [
        { id: 'i_38', type: 'ppt', title: '조별 카드, 학생 발표 메모', content: '' },
        { id: 'i_39', type: 'ppt', title: '유의점', content: '발표 기회는 참여도가 낮은 학생 위주로 배분\n시간 부족 시 1~2명만 발표 후 마무리\n발표자가 부담 가지지 않도록 교사가 적극 격려' }
      ]
    },
    {
      id: 't_20',
      stage: 'dev',
      time: 5,
      teacher: '- 학생 발표 및 모둠 분석에서 나온 핵심 키워드 정리 - PPT로 "AI의 정의와 특성(학습·추론·자율성)" 다시 강조 - "오늘 활동에서 나온 사례는 AI의 ○○ 특성과 연결됩니다" 식으로 보완 설명 - 학생들이 잘못 이해한 부분을 부드럽게 수정',
      student: '- 교사 설명을 들으며 정리 - 필요한 경우 수정된 개념 받아 적기',
      items: [
        { id: 'i_40', type: 'ppt', title: 'PPT 정리 슬라이드', content: '' },
        { id: 'i_41', type: 'ppt', title: '유의점', content: '학생 답변을 먼저 인정 후 정정\n언어 톤을 "틀린 게 아니다, 과정에서 생긴 생각"으로 조절\n발표 내용 활용해 정리 연결' }
      ]
    },
    {
      id: 't_21',
      stage: 'wrap',
      time: 3,
      teacher: '- PPT로 최종 학습 목표 2가지 제시 - "오늘 수업에서 목표를 달성했나요?" 질문 - 학생들 스스로 달성 여부를 체크하도록 유도',
      student: '- 학습 목표를 함께 읽고 - 달성 여부를 손들기/멘트로 표현 - 자기 학습 수준을 점검',
      items: [
        { id: 'i_42', type: 'ppt', title: 'PPT 학습 목표 슬라이드', content: '' },
        { id: 'i_43', type: 'ppt', title: '유의점', content: '단순 낭독이 아닌 성취 강조\n하위권 학생도 "나는 이해가 조금 부족했어요" 표현 가능하게 분위기 조성' }
      ]
    },
    {
      id: 't_22',
      stage: 'wrap',
      time: 5,
      teacher: '- 간단한 자기평가지 배포 또는 Mentimeter 활용 - "오늘 배운 것 중 가장 기억에 남는 키워드는 무엇인가요?" 질문 - 다음 차시와 연결되는 발문("AI 탐색 방법은 어떻게 될까요?") 던지고 마무리',
      student: '- 자기평가지 작성 또는 Mentimeter에 키워드 입력 - 다음 차시 학습 주제 예측 - 인사 후 수업 종료',
      items: [
        { id: 'i_44', type: 'url', title: '자기평가지 / Mentimeter', content: '' },
        { id: 'i_45', type: 'ppt', title: '유의점', content: '자기평가는 짧고 간단히 (예: 키워드 1개, 오늘 배운 점 1개)\n다음 차시와의 연결 발문으로 연속성 확보\n시간 초과 시 구두 확인으로 대체 가능' }
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
