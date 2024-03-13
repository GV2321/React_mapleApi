const callIdApi = async (name) => {
    const API_KEY = 'test_7b313a47a964f9c8327f1a38719513991c6c0a1413a493b5b08a99c25f14cfa3b1f7bc16310b71b97d5ac7108cd5fcf9';
  
    try {
      const response = await fetch(`https://open.api.nexon.com/maplestory/v1/id?character_name=${name}`, {
        headers: {
          'x-nxopen-api-key': API_KEY,
        },
      });
  
      if (!response.ok) {
        throw new Error(`ID API HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (!data.ocid) {
        throw new Error('ocid not found in the response data');
      }
  
      return data.ocid; // 이 부분이 ocid를 반환합니다.
    } catch (error) {
      console.error('Error during ID API call:', error.message);
      throw error;
    }
  };
  
  export default callIdApi;