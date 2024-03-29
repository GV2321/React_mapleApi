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
  const [roidPopupPosition, setRoidPopupPosition] = useState({});
  const [statPopupPosition, setStatPopupPosition] = useState({});
  const [isItemHovered, setIsItemHovered] = useState(false);
  const [isStatHovered, setIsStatHovered] = useState(false);
  const [isRoidHovered, setIsRoidHovered] = useState(false);
  const itemRefs = useRef({});
  const roidRef = useRef({});
  const statRef = useRef({});


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
      if (isRoidHovered) {
        const rect = roidRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        setRoidPopupPosition({ top: mouseY, left: mouseX });
      }
    };
  
    const handleMouseOut = () => {
      setItemPopupPositions({});
      setStatPopupPosition({});
      setRoidPopupPosition({});
    };
  
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseout', handleMouseOut);
  
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isItemHovered, isStatHovered, isRoidHovered, itemPopupPositions]);

  


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

  const handleItemHover = () => {
    setIsItemHovered(true);
  };

  const handleItemHoverOut = () => {
    setIsItemHovered(false);
  };

  const handleRoidIconHover = (e) => {
    setIsRoidHovered(true);
  };
  
  const handleRoidIconHoverOut = () => {
    setIsRoidHovered(false);
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
          style={{ position: 'relative', display: 'inline-block'}}
          data-item-id={item.item_name}
        >
          <img
            src={item.item_icon}
            alt={item.item_name}            
            style={{ width: 'auto'}}
          />
          {isItemHovered && itemPopupPositions[item.item_name] && (
            <div className="itempopup"
              style={{
                top: itemPopupPositions[item.item_name].top,
                left: itemPopupPositions[item.item_name].left,
              }}
            >
              <div class='itempopup-item'>
                {item.starforce !== '0' || item.scroll_upgrade !== '0' ? (
                  <p>
                    {item.starforce !== '0' && `★${item.starforce} `}
                    {item.item_name}
                    {item.scroll_upgrade !== '0' && ` (+${item.scroll_upgrade})`}
                  </p>
                ) : (
                  <p>
                    {item.item_name}
                  </p>
                )}
                {item.potential_option_grade !== null && (
                  <p>({item.potential_option_grade} 아이템)</p>
                )}
              </div>
              <div class='itempopup-item'>
                <img src={item.item_icon} alt={item.item_name} style={{ width: '80px'}}/>
              </div>
              <div class='itempopup-item'>
                {Object.entries(item.item_total_option).map(([key, value], index) => (
                  (value !== '0' && value !== 0) ? (
                    <div key={index}>
                      {key === 'attack_power' && (
                        <p>
                          <span style={{ color: '#66FFFF' }}>공격력 : +{item.item_total_option[key]} </span>
                          <span>({item.item_base_option[key]}</span>
                          {item.item_add_option[key] !== '0' && (
                            <span style={{ color: '#CCFF00' }}>+{item.item_add_option[key]}</span>
                          )}
                          {item.item_etc_option[key] !== '0' && (
                            <span style={{ color: '#AAAAFF' }}>+{item.item_etc_option[key]}</span>
                          )}
                          {item.item_starforce_option[key] !== '0' && (
                            <span style={{ color: '#FFCC00' }}>+{item.item_starforce_option[key]}</span>
                          )}
                          )
                        </p>
                      )}
                      {key === 'magic_power' && (
                        <p>
                        <span style={{ color: '#66FFFF' }}>마력 : +{item.item_total_option[key]} </span>
                        <span>({item.item_base_option[key]}</span>
                        {item.item_add_option[key] !== '0' && (
                          <span style={{ color: '#CCFF00' }}>+{item.item_add_option[key]}</span>
                        )}
                        {item.item_etc_option[key] !== '0' && (
                          <span style={{ color: '#AAAAFF' }}>+{item.item_etc_option[key]}</span>
                        )}
                        {item.item_starforce_option[key] !== '0' && (
                          <span style={{ color: '#FFCC00' }}>+{item.item_starforce_option[key]}</span>
                        )}
                        )
                      </p>
                      )}
                      {key === 'boss_damage' && (
                        <p>
                        <span style={{ color: '#66FFFF' }}>보스 몬스터 공격 시 데미지 : +{item.item_total_option[key]}% </span>
                        <span>({item.item_base_option[key]}</span>
                        {item.item_add_option[key] !== '0' && (
                          <span style={{ color: '#CCFF00' }}>+{item.item_add_option[key]}%</span>
                        )}
                        {item.item_etc_option[key] !== '0' && (
                          <span style={{ color: '#AAAAFF' }}>+{item.item_etc_option[key]}%</span>
                        )}
                        {item.item_starforce_option[key] !== '0' && (
                          <span style={{ color: '#FFCC00' }}>+{item.item_starforce_option[key]}%</span>
                        )}
                        )
                      </p>
                      )}
                      {key === 'ignore_monster_armor' && (
                        <p>몬스터 방어율 무시 : {item.item_total_option[key]}%</p>
                      )}
                      {key === 'damage' && (
                        <p>
                        <span style={{ color: '#66FFFF' }}>데미지 : +{item.item_total_option[key]}% </span>
                        <span>({item.item_base_option[key]}</span>
                        {item.item_add_option[key] !== '0' && (
                          <span style={{ color: '#CCFF00' }}>+{item.item_add_option[key]}%</span>
                        )}
                        {item.item_etc_option[key] !== '0' && (
                          <span style={{ color: '#AAAAFF' }}>+{item.item_etc_option[key]}%</span>
                        )}
                        {item.item_starforce_option[key] !== '0' && (
                          <span style={{ color: '#FFCC00' }}>+{item.item_starforce_option[key]}%</span>
                        )}
                        )
                      </p>
                      )}
                      {key === 'max_hp' && (
                        <p>
                        <span style={{ color: '#66FFFF' }}>최대 HP : +{item.item_total_option[key]} </span>
                        <span>({item.item_base_option[key]}</span>
                        {item.item_add_option[key] !== '0' && (
                          <span style={{ color: '#CCFF00' }}>+{item.item_add_option[key]}</span>
                        )}
                        {item.item_etc_option[key] !== '0' && (
                          <span style={{ color: '#AAAAFF' }}>+{item.item_etc_option[key]}</span>
                        )}
                        {item.item_starforce_option[key] !== '0' && (
                          <span style={{ color: '#FFCC00' }}>+{item.item_starforce_option[key]}</span>
                        )}
                        )
                      </p>
                      )}
                      {key === 'max_mp' && (
                        <p>
                        <span style={{ color: '#66FFFF' }}>최대 MP : +{item.item_total_option[key]} </span>
                        <span>({item.item_base_option[key]}</span>
                        {item.item_add_option[key] !== '0' && (
                          <span style={{ color: '#CCFF00' }}>+{item.item_add_option[key]}</span>
                        )}
                        {item.item_etc_option[key] !== '0' && (
                          <span style={{ color: '#AAAAFF' }}>+{item.item_etc_option[key]}</span>
                        )}
                        {item.item_starforce_option[key] !== '0' && (
                          <span style={{ color: '#FFCC00' }}>+{item.item_starforce_option[key]}</span>
                        )}
                        )
                      </p>
                      )}
                      {key === 'str' && (
                        <p>
                        <span style={{ color: '#66FFFF' }}>STR : +{item.item_total_option[key]} </span>
                        <span>({item.item_base_option[key]}</span>
                        {item.item_add_option[key] !== '0' && (
                          <span style={{ color: '#CCFF00' }}>+{item.item_add_option[key]}</span>
                        )}
                        {item.item_etc_option[key] !== '0' && (
                          <span style={{ color: '#AAAAFF' }}>+{item.item_etc_option[key]}</span>
                        )}
                        {item.item_starforce_option[key] !== '0' && (
                          <span style={{ color: '#FFCC00' }}>+{item.item_starforce_option[key]}</span>
                        )}
                        )
                      </p>
                      )}
                      {key === 'dex' && (
                        <p>
                        <span style={{ color: '#66FFFF' }}>DEX : +{item.item_total_option[key]} </span>
                        <span>({item.item_base_option[key]}</span>
                        {item.item_add_option[key] !== '0' && (
                          <span style={{ color: '#CCFF00' }}>+{item.item_add_option[key]}</span>
                        )}
                        {item.item_etc_option[key] !== '0' && (
                          <span style={{ color: '#AAAAFF' }}>+{item.item_etc_option[key]}</span>
                        )}
                        {item.item_starforce_option[key] !== '0' && (
                          <span style={{ color: '#FFCC00' }}>+{item.item_starforce_option[key]}</span>
                        )}
                        )
                      </p>
                      )}
                      {key === 'int' && (
                        <p>
                        <span style={{ color: '#66FFFF' }}>INT : +{item.item_total_option[key]} </span>
                        <span>({item.item_base_option[key]}</span>
                        {item.item_add_option[key] !== '0' && (
                          <span style={{ color: '#CCFF00' }}>+{item.item_add_option[key]}</span>
                        )}
                        {item.item_etc_option[key] !== '0' && (
                          <span style={{ color: '#AAAAFF' }}>+{item.item_etc_option[key]}</span>
                        )}
                        {item.item_starforce_option[key] !== '0' && (
                          <span style={{ color: '#FFCC00' }}>+{item.item_starforce_option[key]}</span>
                        )}
                        )
                      </p>
                      )}
                      {key === 'luk' && (
                        <p>
                        <span style={{ color: '#66FFFF' }}>LUK : +{item.item_total_option[key]} </span>
                        <span>({item.item_base_option[key]}</span>
                        {item.item_add_option[key] !== '0' && (
                          <span style={{ color: '#CCFF00' }}>+{item.item_add_option[key]}</span>
                        )}
                        {item.item_etc_option[key] !== '0' && (
                          <span style={{ color: '#AAAAFF' }}>+{item.item_etc_option[key]}</span>
                        )}
                        {item.item_starforce_option[key] !== '0' && (
                          <span style={{ color: '#FFCC00' }}>+{item.item_starforce_option[key]}</span>
                        )}
                        )
                      </p>
                      )}
                      {key === 'all_stat' && (
                        <p>
                        <span style={{ color: '#66FFFF' }}>올스탯 : +{item.item_total_option[key]}% </span>
                        <span>({item.item_base_option[key]}</span>
                        {item.item_add_option[key] !== '0' && (
                          <span style={{ color: '#CCFF00' }}>+{item.item_add_option[key]}%</span>
                        )}
                        {item.item_etc_option[key] !== '0' && (
                          <span style={{ color: '#AAAAFF' }}>+{item.item_etc_option[key]}%</span>
                        )}
                        )
                      </p>
                      )}
                    </div>
                  ) : null
                ))}
              </div>
              <div class='itempopup-item'>
              {item.potential_option_grade !== null && (
                <>
                {item.potential_option_grade === '레어' && (
                  <p style={{ color: '#22BBFF' }}>
                    잠재옵션                 
                  </p>
                )}
          
                {item.potential_option_grade === '에픽' && (
                  <p style={{ color: '#AA11EE' }}>
                    잠재옵션                 
                  </p>
                )}
          
                {item.potential_option_grade === '유니크' && (
                  <p style={{ color: '#FFBB00' }}>
                    잠재옵션                 
                  </p>
                )}
          
                {item.potential_option_grade === '레전드리' && (

                    <p style={{ color: '#77EE00' }}>
                      <div class='L-box'>L</div>
                      <div style={{display: 'inline'}}>잠재옵션</div>
                    </p>                 

                )}
                <p>
                  <div>{item.potential_option_1}</div>
                  <div>{item.potential_option_2}</div>
                  <div>{item.potential_option_3}</div>
                </p>
              </>
            )}
            </div>

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
      <div className="icon-grid" style={{ marginTop: '20px' }}>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('반지4')}</div>
        </div> 
        <div className="icon-container">
          <div className="icon-item"></div>
        </div> 
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('모자')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item"></div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('엠블렘')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('반지3')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('펜던트2')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('얼굴장식')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item"></div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('뱃지')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('반지2')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('펜던트')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('눈장식')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('귀고리')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('훈장')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('반지1')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('무기')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('상의')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('어깨장식')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('보조무기')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('포켓 아이템')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('벨트')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('하의')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('장갑')}</div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('망토')}</div>
        </div> 
        <div className="icon-container">
          <div className="icon-item"></div>
        </div>
        <div className="icon-container">
          <div className="icon-item"></div>
        </div>
        <div className="icon-container">
          <div className="icon-item">{renderItemIcon('신발')}</div>
        </div>
        <div className="icon-container" ref={roidRef}>
        {roidData && roidData.android_icon && (
          <div className="icon-item"            
            onMouseEnter={handleRoidIconHover}
            onMouseOut={handleRoidIconHoverOut}
            style={{ position: 'relative', display: 'inline-block' }}
            >
            <img src={roidData.android_icon}
              alt="안드로이드" />
            {isRoidHovered && (
              <div className="popup"
              style={{
                top: roidPopupPosition.top,
                left: roidPopupPosition.left,
              }}>
              <p>{roidData.android_name}</p>
              </div>
            )}
          </div>
        )}
        </div>
        <div className="icon-item">{renderItemIcon('기계 심장')}</div>  
      </div>
    </div>
  );
}

export default SearchBar;