function Ranking() {
  return (
    <div className="page">
      <h1>Bảng xếp hạng</h1>
      <p>Xếp hạng người chơi theo tổng điểm BO2</p>

      <div className="list-card">
        <table>
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Người chơi</th>
              <th>Game 1</th>
              <th>Game 2</th>
              <th>Tổng điểm</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>Nguyễn Văn A</td>
              <td>8</td>
              <td>7</td>
              <td>15</td>
            </tr>

            <tr>
              <td>2</td>
              <td>Nguyễn Văn B</td>
              <td>7</td>
              <td>6</td>
              <td>13</td>
            </tr>

            <tr>
              <td>3</td>
              <td>Nguyễn Văn C</td>
              <td>6</td>
              <td>5</td>
              <td>11</td>
            </tr>

            <tr>
              <td>4</td>
              <td>Nguyễn Văn D</td>
              <td>5</td>
              <td>4</td>
              <td>9</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Ranking;