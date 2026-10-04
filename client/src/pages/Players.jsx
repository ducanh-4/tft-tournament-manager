function Players() {
  return (
    <div className="page">
      <h1>Quản lý người chơi</h1>
      <p>Thêm và quản lý danh sách người chơi trong giải đấu</p>

      <div className="form-card">
        <div className="form-group">
          <label>Tên người chơi</label>

          <input
            type="text"
            placeholder="Nhập tên người chơi"
          />
        </div>

        <button className="primary-button">
          Thêm người chơi
        </button>
      </div>

      <div className="list-card">
        <h2>Danh sách người chơi</h2>

        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên người chơi</th>
              <th>Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>Nguyễn Văn A</td>
              <td>Đã đăng ký</td>
            </tr>

            <tr>
              <td>2</td>
              <td>Nguyễn Văn B</td>
              <td>Đã đăng ký</td>
            </tr>

            <tr>
              <td>3</td>
              <td>Nguyễn Văn C</td>
              <td>Đã đăng ký</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Players;