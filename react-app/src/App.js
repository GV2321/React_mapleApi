import React, { useState } from 'react';
import Header from './Header';
import SearchBar from './SearchBar';

function App() {
  const [searchTerm] = useState('');

  const handleSearch = () => {
    // 검색 기능을 위한 로직 추가
    console.log(`Searching for: ${searchTerm}`);
  };

  return (
    <div>
      <Header />
      <SearchBar onSearch={handleSearch} />
      {/* 기존의 다른 부분들도 컴포넌트로 추가 */}
    </div>
    
  );
}

export default App;
