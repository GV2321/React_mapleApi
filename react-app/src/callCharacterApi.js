const callCharacterApi = async (ocid, date) => {
    const API_KEY = 'test_7b313a47a964f9c8327f1a38719513991c6c0a1413a493b5b08a99c25f14cfa3b1f7bc16310b71b97d5ac7108cd5fcf9';
  
    try {
      const response = await fetch(`https://open.api.nexon.com/maplestory/v1/character/basic?ocid=${ocid}&date=${date}`, {
        headers: {
          'x-nxopen-api-key': API_KEY,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Character API HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // 데이터 가공 또는 검증 로직 추가
  
      return data; // 이 부분이 Character API에서 받아온 데이터를 반환합니다.
    } catch (error) {
      console.error('Error during Character API call:', error.message);
      throw error;
    }
  };
  
  const callCharacterStatApi = async (ocid, date) => {
    const API_KEY = 'test_7b313a47a964f9c8327f1a38719513991c6c0a1413a493b5b08a99c25f14cfa3b1f7bc16310b71b97d5ac7108cd5fcf9';
  
    try {
      const response = await fetch(`https://open.api.nexon.com/maplestory/v1/character/stat?ocid=${ocid}&date=${date}`, {
        headers: {
          'x-nxopen-api-key': API_KEY,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Character API HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // 데이터 가공 또는 검증 로직 추가
  
      return data;
    } catch (error) {
      console.error('Error during CharacterStat API call:', error.message);
      throw error;
    }
  };

  const callItemApi = async (ocid, date) => {
    const API_KEY = 'test_7b313a47a964f9c8327f1a38719513991c6c0a1413a493b5b08a99c25f14cfa3b1f7bc16310b71b97d5ac7108cd5fcf9';
  
    try {
      const response = await fetch(`https://open.api.nexon.com/maplestory/v1/character/item-equipment?ocid=${ocid}&date=${date}`, {
        headers: {
          'x-nxopen-api-key': API_KEY,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Item API HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // 데이터 가공 또는 검증 로직 추가
  
      return data; // 이 부분이 Character API에서 받아온 데이터를 반환합니다.
    } catch (error) {
      console.error('Error during Item API call:', error.message);
      throw error;
    }
  };

  const callRoidApi = async (ocid, date) => {
    const API_KEY = 'test_7b313a47a964f9c8327f1a38719513991c6c0a1413a493b5b08a99c25f14cfa3b1f7bc16310b71b97d5ac7108cd5fcf9';
  
    try {
      const response = await fetch(`https://open.api.nexon.com/maplestory/v1/character/android-equipment?ocid=${ocid}&date=${date}`, {
        headers: {
          'x-nxopen-api-key': API_KEY,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Item API HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // 데이터 가공 또는 검증 로직 추가
  
      return data; // 이 부분이 Character API에서 받아온 데이터를 반환합니다.
    } catch (error) {
      console.error('Error during Roid API call:', error.message);
      throw error;
    }
  };

  export { callCharacterApi , callCharacterStatApi , callItemApi , callRoidApi };