function CreateTournament() {
  return (
    <div className="page">
      <h1>Tạo giải đấu</h1>
      <p>Tạo một giải đấu TFT mới</p>

      <div className="form-card">
        <div className="form-group">
          <label>Tên giải đấu</label>
          <input
            type="text"
            placeholder="Ví dụ: TFT Championship 2026"
          />
        </div>

        <div className="form-group">
          <label>Số lượng người chơi</label>

          <select>
            <option value="8">8 người</option>
            <option value="16">16 người</option>
            <option value="32">32 người</option>
            <option value="64">64 người</option>
            <option value="128">128 người</option>
          </select>
        </div>

        <div className="form-group">
          <label>Số ngày thi đấu</label>

          <select>
            <option value="1">1 ngày</option>
            <option value="2">2 ngày</option>
            <option value="3">3 ngày</option>
          </select>
        </div>

        <button className="primary-button">
          Tạo giải đấu
        </button>
      </div>
    </div>
  );
}

export default CreateTournament;