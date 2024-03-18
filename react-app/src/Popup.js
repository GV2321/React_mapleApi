const Popup = ({ item }) => {
    return (
      <div className="popup">
        <p>{item.item_name}</p>
        {/* 추가적인 아이템 정보 표시 가능 */}
      </div>
    );
  };

  export default Popup;