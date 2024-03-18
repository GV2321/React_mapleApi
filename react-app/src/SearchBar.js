import React, { useState, useEffect, useRef } from 'react';
import { callCharacterApi, callCharacterStatApi, callItemApi, callRoidApi } from './callCharacterApi';
import callIdApi from './callIdApi';
import getYesterdayDate from './DateUtils';
import formatKoreanNumber from './formatKoreanNumber';
import './App.css';

function SearchBar() {
  const [characterName, setCharacterName] = useState('');
  const [selectedDate, setSelectedDate] = useState(getYesterdayDate());
  const [charData, setCharData] = useState(null);
  const [statData, setStatData] = useState(null);
  const [itemData, setItemData] = useState(null);
  const [roidData, setRoidData] = useState(null);
  const [presetNumber, setPresetNumber] = useState(1);
  const [itemPopupPositions, setItemPopupPositions] = useState({});
  const [statPopupPosition, setStatPopupPosition] = useState({ top: 0, left: 0 });
  const [isItemHovered, setIsItemHovered] = useState(false);
  const [isStatHovered, setIsStatHovered] = useState(false);
  const itemRefs = useRef({});
  const statRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isItemHovered) {
        const itemId = e.target.getAttribute('data-item-id');
        const itemElement = itemRefs.current[itemId];
        if (itemElement) {
          const rect = itemElement.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          setItemPopupPositions(prevPositions => ({
            ...prevPositions,
            [itemId]: { top: mouseY, left: mouseX }
          }));
        }
      }
      if (isStatHovered) {
        const rect = statRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        setStatPopupPosition({ top: mouseY, left: mouseX });
      }
    };
  
    const handleMouseOut = () => {
      // Reset popup positions when mouse leaves the popup area
      setItemPopupPositions({});
      setStatPopupPosition({ top: 0, left: 0 });
    };
  
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseout', handleMouseOut);
  
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isItemHovered, isStatHovered]);

  const handleSearch = async () => {
    if (characterName || selectedDate) {
      try {
        const idData = await callIdApi(characterName);
        console.log('ID Api Data',idData);
        const fetchedCharData = await callCharacterApi(idData, selectedDate);
        console.log('Char Api Data',fetchedCharData);
        const fetchedStatData = await callCharacterStatApi(idData, selectedDate);
        console.log('Stat Api Data',fetchedStatData);
        const fetchedItemData = await callItemApi(idData, selectedDate);
        console.log('Item Api Data',fetchedItemData);
        const fetchedRoidData = await callRoidApi(idData, selectedDate);
        console.log('Android Api Data',fetchedRoidData);
        setCharData(fetchedCharData);
        setStatData(fetchedStatData);
        setItemData(fetchedItemData);
        setRoidData(fetchedRoidData);
      } catch (error) {
        console.error('Error during API calls:', error.message);
      }
    }
  };

  const getStatValue = (statName) => {
    if (!statData || !statData.final_stat) {
      return null;
    }
    const stat = statData.final_stat.find((s) => s.stat_name === statName);
    return stat ? stat.stat_value : null;
  };

  const formatNumber = (value) => {
    if (!value) return '';
    return formatKoreanNumber(value);
  };

  const handleItemHover = (e, itemName) => {
    setIsItemHovered(true);
    const rect = e.target.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setItemPopupPositions(prevPositions => ({
      ...prevPositions,
      [itemName]: { top: mouseY, left: mouseX }
    }));
  };

  const handleItemHoverOut = () => {
    setIsItemHovered(false);
  };

  const handleStatHover = () => {
    setIsStatHovered(true);
  };

  const handleStatHoverOut = () => {
    setIsStatHovered(false);
  };

  const getItemDataBySlot = (itemSlot) => {
    if (!itemData || !itemData[`item_equipment_preset_${presetNumber}`]) {
      return null;
    }
    const presetItemData = itemData[`item_equipment_preset_${presetNumber}`];
    return presetItemData.find((item) => item.item_equipment_slot === itemSlot);
  };

  const renderItemIcon = (itemSlot) => {
    const item = getItemDataBySlot(itemSlot);
    if (item) {
      return (
        <div
          key={item.item_name}
          ref={(ref) => itemRefs.current[item.item_name] = ref}
          className="icon-item"
          onMouseOver={(e) => handleItemHover(e, item.item_name)}
          onMouseOut={handleItemHoverOut}
          style={{ position: 'relative', display: 'inline-block' }}
          data-item-id={item.item_name}
        >
          <img
            src={item.item_shape_icon}
            alt={item.item_shape_name}
            style={{ width: 'auto'}}
          />
          {isItemHovered && itemPopupPositions[item.item_name] && (
            <div className="item-popup"
              style={{
                top: itemPopupPositions[item.item_name].top,
                left: itemPopupPositions[item.item_name].left,
              }}
            >
              <p>{item.item_name}</p>
            </div>
          )}
        </div>
      );
    } else {
      return <div className="icon-item"></div>;
    }
  };

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

  const handlePresetClick = (presetNumber) => {
    setPresetNumber(presetNumber);
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
            ref={statRef}
            onMouseOver={handleStatHover}
            onMouseOut={handleStatHoverOut}
            style={{ position: 'relative', display: 'inline-block' }}
          >
            <img
              src={charData.character_image}
              alt="Character"
              style={{ width: '200px', height: '200px' }}
            />
            {isStatHovered && (
              <div className="popup"
                style={{
                  top: statPopupPosition.top,
                  left: statPopupPosition.left,
                }}
              >
                <p>스탯공격력 : {formatNumber(getStatValue('최소 스탯공격력'))} ~ {formatNumber(getStatValue('최대 스탯공격력'))}</p>
                <p>데미지 : {getStatValue('데미지')}%</p>
                <p>보스 몬스터 데미지 : {getStatValue('보스 몬스터 데미지')}%</p>
                <p>방어율 무시 : {getStatValue('방어율 무시')}%</p>
                <p>크리티컬 확률 : {getStatValue('크리티컬 확률')}%</p>
                <p>크리티컬 데미지 : {getStatValue('크리티컬 데미지')}%</p>
                <p>메소 획득량 : {getStatValue('메소 획득량')}%</p>
                <p>아이템 드롭률 : {getStatValue('아이템 드롭률')}%</p>
              </div>
            )}
          </div>
          <p>Lv. {charData.character_level} {charData.character_name} ({charData.character_exp_rate}%)</p>
          <p>직업 : {charData.character_class} ({charData.character_class_level}차)</p>
          <p>길드 : {charData.character_guild_name} ({charData.world_name})</p>
        </div>
      )}
      <div className="button-container">
        <p>장비 프리셋</p>
        <div className="buttons">
          <button onClick={() => handlePresetClick(1)}>1</button>
          <button onClick={() => handlePresetClick(2)}>2</button>
          <button onClick={() => handlePresetClick(3)}>3</button>
        </div>
      </div>
      <div className="icon-grid">
        <div className="icon-item">{renderItemIcon('반지4')}</div> 
        <div className="icon-item"></div> 
        <div className="icon-item">{renderItemIcon('모자')}</div>
        <div className="icon-item"></div> 
        <div className="icon-item">{renderItemIcon('엠블렘')}</div>
        <div className="icon-item">{renderItemIcon('반지3')}</div>
        <div className="icon-item">{renderItemIcon('펜던트2')}</div>
        <div className="icon-item">{renderItemIcon('얼굴장식')}</div>
        <div className="icon-item"></div> 
        <div className="icon-item">{renderItemIcon('뱃지')}</div>
        <div className="icon-item">{renderItemIcon('반지2')}</div>
        <div className="icon-item">{renderItemIcon('펜던트')}</div>
        <div className="icon-item">{renderItemIcon('눈장식')}</div>
        <div className="icon-item">{renderItemIcon('귀고리')}</div>
        <div className="icon-item">{renderItemIcon('훈장')}</div>
        <div className="icon-item">{renderItemIcon('반지1')}</div>
        <div className="icon-item">{renderItemIcon('무기')}</div>
        <div className="icon-item">{renderItemIcon('상의')}</div>
        <div className="icon-item">{renderItemIcon('어깨장식')}</div>
        <div className="icon-item">{renderItemIcon('보조무기')}</div>
        <div className="icon-item">{renderItemIcon('포켓 아이템')}</div>
        <div className="icon-item">{renderItemIcon('벨트')}</div>
        <div className="icon-item">{renderItemIcon('하의')}</div>
        <div className="icon-item">{renderItemIcon('장갑')}</div>
        <div className="icon-item">{renderItemIcon('망토')}</div> 
        <div className="icon-item"></div> 
        <div className="icon-item"></div> 
        <div className="icon-item">{renderItemIcon('신발')}</div>
        {roidData && roidData.android_icon && (
          <div className="icon-item">
            <img src={roidData.android_icon} alt="안드로이드" />
          </div>
        )}
        <div className="icon-item">{renderItemIcon('기계 심장')}</div>  
      </div>
    </div>
  );
}

export default SearchBar;