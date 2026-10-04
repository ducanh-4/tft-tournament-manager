function Bracket() {
  return (
    <div className="page">
      <h1>Bảng đấu TFT</h1>
      <p>Quản lý vòng đấu và các lobby</p>

      <div className="round-header">
        <div>
          <h2>Round 1</h2>
          <p>Vòng đấu loại</p>
        </div>

        <div>
          <strong>64 người chơi</strong>
        </div>
      </div>

      <div className="lobby-grid">
        <div className="lobby-card">
          <h3>Lobby 1</h3>
          <p>8 người chơi</p>

          <ol>
            <li>Nguyễn Văn A</li>
            <li>Nguyễn Văn B</li>
            <li>Nguyễn Văn C</li>
            <li>Nguyễn Văn D</li>
            <li>Nguyễn Văn E</li>
            <li>Nguyễn Văn F</li>
            <li>Nguyễn Văn G</li>
            <li>Nguyễn Văn H</li>
          </ol>

          <button className="primary-button">
            Nhập kết quả
          </button>
        </div>

        <div className="lobby-card">
          <h3>Lobby 2</h3>
          <p>8 người chơi</p>

          <ol>
            <li>Nguyễn Văn I</li>
            <li>Nguyễn Văn J</li>
            <li>Nguyễn Văn K</li>
            <li>Nguyễn Văn L</li>
            <li>Nguyễn Văn M</li>
            <li>Nguyễn Văn N</li>
            <li>Nguyễn Văn O</li>
            <li>Nguyễn Văn P</li>
          </ol>

          <button className="primary-button">
            Nhập kết quả
          </button>
        </div>

        <div className="lobby-card">
          <h3>Lobby 3</h3>
          <p>8 người chơi</p>

          <ol>
            <li>Nguyễn Văn Q</li>
            <li>Nguyễn Văn R</li>
            <li>Nguyễn Văn S</li>
            <li>Nguyễn Văn T</li>
            <li>Nguyễn Văn U</li>
            <li>Nguyễn Văn V</li>
            <li>Nguyễn Văn W</li>
            <li>Nguyễn Văn X</li>
          </ol>

          <button className="primary-button">
            Nhập kết quả
          </button>
        </div>

        <div className="lobby-card">
          <h3>Lobby 4</h3>
          <p>8 người chơi</p>

          <ol>
            <li>Nguyễn Văn Y</li>
            <li>Nguyễn Văn Z</li>
            <li>Trần Văn A</li>
            <li>Trần Văn B</li>
            <li>Trần Văn C</li>
            <li>Trần Văn D</li>
            <li>Trần Văn E</li>
            <li>Trần Văn F</li>
          </ol>

          <button className="primary-button">
            Nhập kết quả
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bracket;