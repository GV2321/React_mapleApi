import React, { useState, useEffect, useRef } from 'react';
import { callCharacterApi, callCharacterStatApi } from './callCharacterApi';
import callIdApi from './callIdApi';
import getYesterdayDate from './DateUtils';


function SearchBar() {
  const [characterName, setCharacterName] = useState('');
  const [selectedDate, setSelectedDate] = useState(getYesterdayDate());
  const [charData, setCharData] = useState(null);
  const [statData, setStatData] = useState(null);

  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [isMouseOverImage, setIsMouseOverImage] = useState(false);

  const imageRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isMouseOverImage) {
        const rect = imageRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        setPopupPosition({ top: mouseY, left: mouseX });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMouseOverImage]);

  const handleSearch = async () => {
    if (characterName || selectedDate) {
      try {
        const idData = await callIdApi(characterName);
        console.log('ID API Response:', idData);

        const fetchedCharData = await callCharacterApi(idData, selectedDate);
        console.log('Character Info API Response:', fetchedCharData);

        const fetchedStatData = await callCharacterStatApi(idData, selectedDate);
        console.log('Character Stat Info API Response:', fetchedStatData);

        setCharData(fetchedCharData);
        setStatData(fetchedStatData);
      } catch (error) {
        console.error('Error during API calls:', error.message);
      }
    }
  };


  // 특정 stat_name에 해당하는 데이터를 추출하는 함수
  const getStatValue = (statName) => {
  // statData가 null이거나 final_stat가 없을 때 처리
    if (!statData || !statData.final_stat) {
      return null;
    }

    const stat = statData.final_stat.find((s) => s.stat_name === statName);
    return stat ? stat.stat_value : null;
  };

  // 필요한 stat_name에 따라 데이터를 추출합니다.
  const 최소_스탯공격력 = getStatValue('최소 스탯공격력');
  const 최대_스탯공격력 = getStatValue('최대 스탯공격력');
  const 데미지 = getStatValue('데미지');
  const 보스_몬스터_데미지 = getStatValue('보스 몬스터 데미지');
  const 최종_데미지 = getStatValue('최종 데미지');
  const 방어율_무시 = getStatValue('방어율 무시');


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleButtonClick = () => {
    handleSearch();
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleImageMouseOver = () => {
    setIsMouseOverImage(true);
  };

  const handleImageMouseOut = () => {
    setIsMouseOverImage(false);
  };

  

  return (
    <div>
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
      />
      <br />
      <input
        type="text"
        placeholder="캐릭터 이름을 입력하세요."
        value={characterName}
        onChange={(e) => setCharacterName(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleButtonClick}>검색</button>

      {charData && (
        <div>
          <div
            ref={imageRef}
            onMouseOver={handleImageMouseOver}
            onMouseOut={handleImageMouseOut}
            style={{ position: 'relative', display: 'inline-block' }}
          >
            <img
              src={charData.character_image}
              alt="Character"
              style={{ width: '200px', height: '200px' }}
            />
            {isMouseOverImage && (
              <div
                style={{
                  position: 'absolute',
                  top: popupPosition.top,
                  left: popupPosition.left,
                  background: 'white',
                  border: '1px solid #ccc',
                  padding: '5px',
                  zIndex: 1,
                  width: 'auto',
                  whiteSpace: 'nowrap', 
                }}
              >
                <p>스탯공격력 : {최소_스탯공격력}~{최대_스탯공격력} </p>
                <p>데미지 : {데미지}% </p>
                <p>보스 몬스터 데미지 : {보스_몬스터_데미지}% </p>
              </div>
            )}
          </div>
          <p>캐릭터 이름: {charData.character_name}</p>
          <p>레벨: {charData.character_level}</p>
          <p>직업: {charData.character_class} ({charData.character_class_level}차)</p>
          <p>월드: {charData.world_name}</p>
          <p>길드: {charData.character_guild_name}</p>
          <p>경험치: {charData.character_exp_rate}%</p>
        </div>
      )}
    </div>
  );
}

export default SearchBar;