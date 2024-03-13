import React, { useEffect, useState } from 'react';
import callIdApi from './callIdApi';
import callCharacterApi from './callCharacterApi';

function CharacterInfo({ characterName, selectedDate }) {
  const [charData, setCharData] = useState(null);

  useEffect(() => {
    const fetchCharacterInfo = async () => {
      try {
        const idData = await callIdApi(characterName);
        console.log('ID API Response:', idData);

        const charData = await callCharacterApi(idData, selectedDate);
        console.log('Character Info API Response:', charData);

        setCharData(charData);
        // 필요한 동작 수행
      } catch (error) {
        console.error('Error during API calls:', error.message);
      }
    };

    if (characterName && selectedDate) {
      fetchCharacterInfo();
    }
  }, [characterName, selectedDate]);

  if (!charData) {
    return null; // 또는 로딩 상태 처리
  }

  // 결과를 화면에 출력하는 로직 추가

  return (
    <div>
      {/* 결과 출력 예시 */}
      <p>Character Name: {charData.character_name}</p>
      <p>Level: {charData.character_level}</p>
      {/* 추가 필요한 내용은 여기에 */}
    </div>
  );
}

export default CharacterInfo;