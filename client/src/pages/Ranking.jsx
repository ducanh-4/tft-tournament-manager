import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Ranking() {
  const [tournaments, setTournaments] = useState([]);
  const [tournamentId, setTournamentId] = useState("");
  const [roundsState, setRoundsState] = useState({
    tournamentId: "",
    data: [],
    error: "",
  });
  const [roundId, setRoundId] = useState("");
  const [lobbyId, setLobbyId] = useState("");
  const [rankingsState, setRankingsState] = useState({
    scopeKey: "",
    data: [],
    error: "",
  });
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [error, setError] = useState("");
  const [refreshNonce, setRefreshNonce] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTournaments() {
      try {
        const response = await fetch(`${API}/tournaments`, {
          signal: controller.signal,
        });
        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(result.message || "Không tải được giải đấu.");
        }

        const data = result.data ?? [];
        setTournaments(data);
        setTournamentId(data.length > 0 ? String(data[0].id) : "");
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || "Không tải được giải đấu.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingTournaments(false);
        }
      }
    }

    loadTournaments();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!tournamentId) {
      return undefined;
    }

    const controller = new AbortController();

    async function loadRounds() {
      try {
        const response = await fetch(
          `${API}/tournaments/${tournamentId}/rounds`,
          { signal: controller.signal }
        );
        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(result.message || "Không tải được vòng đấu.");
        }

        const data = result.data ?? [];
        setRoundsState({ tournamentId, data, error: "" });
        setRoundId(data.length > 0 ? String(data[0].id) : "");
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setRoundsState({
            tournamentId,
            data: [],
            error: loadError.message || "Không tải được vòng đấu.",
          });
        }
      }
    }

    loadRounds();
    return () => controller.abort();
  }, [tournamentId]);

  const rounds =
    roundsState.tournamentId === tournamentId ? roundsState.data : [];
  const loadingRounds =
    Boolean(tournamentId) && roundsState.tournamentId !== tournamentId;
  const selectedRound = rounds.find((round) => String(round.id) === roundId);
  const lobbies = selectedRound?.lobbies ?? [];
  const selectedLobby =
    lobbies.find((lobby) => String(lobby.id) === lobbyId) ?? lobbies[0];
  const activeLobbyId = selectedLobby ? String(selectedLobby.id) : "";
  const scopeKey =
    tournamentId && roundId && activeLobbyId
      ? `${tournamentId}:${roundId}:${activeLobbyId}`
      : "";
  const currentRankings =
    rankingsState.scopeKey === scopeKey ? rankingsState.data : [];
  const loadingRankings =
    Boolean(scopeKey) && rankingsState.scopeKey !== scopeKey;
  const rankingError =
    rankingsState.scopeKey === scopeKey ? rankingsState.error : "";

  useEffect(() => {
    if (!scopeKey) {
      return undefined;
    }

    const controller = new AbortController();

    async function loadRankings() {
      try {
        const query = new URLSearchParams({
          tournamentId,
          roundId,
          lobbyId: activeLobbyId,
        });
        const response = await fetch(`${API}/rankings?${query}`, {
          signal: controller.signal,
        });
        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(result.message || "Không tải được bảng xếp hạng.");
        }

        setRankingsState({
          scopeKey,
          data: result.data ?? [],
          error: "",
        });
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setRankingsState({
            scopeKey,
            data: [],
            error: loadError.message || "Không tải được bảng xếp hạng.",
          });
        }
      }
    }

    loadRankings();
    const intervalId = window.setInterval(loadRankings, 10000);
    window.addEventListener("focus", loadRankings);

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
      window.removeEventListener("focus", loadRankings);
    };
  }, [tournamentId, roundId, activeLobbyId, scopeKey, refreshNonce]);

  const selectedTournament = tournaments.find(
    (tournament) => String(tournament.id) === tournamentId
  );
  const hasScope = Boolean(scopeKey);
  const pageError = error || roundsState.error || rankingError;

  return (
    <div className="page">
      <header className="page-heading">
        <span className="eyebrow">THÀNH TÍCH</span>
        <h1>Bảng xếp hạng</h1>
        <p>Xếp hạng người chơi theo tổng điểm BO2</p>
      </header>

      <section className="ranking-controls" aria-label="Phạm vi bảng xếp hạng">
        <div className="form-group">
          <label htmlFor="ranking-tournament">Giải đấu</label>
          <select
            id="ranking-tournament"
            value={tournamentId}
            onChange={(event) => {
              setTournamentId(event.target.value);
              setRoundId("");
              setLobbyId("");
              setError("");
            }}
            disabled={loadingTournaments || tournaments.length === 0}
          >
            <option value="">-- Chọn giải đấu --</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="ranking-round">Vòng đấu</label>
          <select
            id="ranking-round"
            value={roundId}
            onChange={(event) => setRoundId(event.target.value)}
            disabled={loadingRounds || rounds.length === 0}
          >
            <option value="">-- Chọn vòng đấu --</option>
            {rounds.map((round) => (
              <option key={round.id} value={round.id}>
                Vòng {round.roundNumber}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="ranking-lobby">Lobby / BO2</label>
          <select
            id="ranking-lobby"
            value={activeLobbyId}
            onChange={(event) => setLobbyId(event.target.value)}
            disabled={loadingRounds || lobbies.length === 0}
          >
            <option value="">-- Chọn lobby --</option>
            {lobbies.map((lobby) => (
              <option key={lobby.id} value={lobby.id}>
                Lobby {lobby.lobbyNumber}
              </option>
            ))}
          </select>
        </div>
      </section>

      {pageError && (
        <p className="status-message status-message--error" role="alert">
          {pageError}
        </p>
      )}

      {loadingTournaments && (
        <p className="status-message" role="status">
          Đang tải danh sách giải đấu...
        </p>
      )}

      {!loadingTournaments && loadingRounds && (
        <p className="status-message" role="status">
          Đang tải vòng đấu và lobby...
        </p>
      )}

      {!loadingTournaments && tournaments.length === 0 && !error && (
        <p className="empty-state">Chưa có giải đấu để xếp hạng.</p>
      )}

      {!loadingTournaments &&
        selectedTournament &&
        !loadingRounds &&
        rounds.length === 0 &&
        !pageError && (
          <p className="empty-state">
            Giải đấu này chưa có vòng đấu hoặc lobby BO2.
          </p>
        )}

      {hasScope && (
        <section className="list-card ranking-card">
          <div className="ranking-card-heading">
            <div>
              <h2>
                {selectedTournament?.name} · Vòng {selectedRound?.roundNumber} ·
                Lobby {selectedLobby?.lobbyNumber}
              </h2>
              <p>Chỉ tính điểm từ trận đã hoàn thành</p>
            </div>
            <button
              type="button"
              onClick={() => setRefreshNonce((current) => current + 1)}
              disabled={loadingRankings}
            >
              {loadingRankings ? "Đang tải..." : "Làm mới"}
            </button>
          </div>

          {loadingRankings && currentRankings.length === 0 && (
            <p className="status-message" role="status">
              Đang tải bảng xếp hạng...
            </p>
          )}

          {!loadingRankings && currentRankings.length === 0 && !pageError && (
            <p className="empty-state">
              Lobby chưa có người chơi hoặc chưa có kết quả.
            </p>
          )}

          {currentRankings.length > 0 && (
            <>
              {currentRankings.some((player) => !player.bo2Complete) && (
                <p className="ranking-incomplete-note" role="status">
                  BO2 chưa đủ hai game hoàn thành; điểm tổng và hạng sẽ hiển thị
                  sau khi đủ kết quả.
                </p>
              )}

              <div className="table-scroll">
                <table className="ranking-table">
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
                    {currentRankings.map((player) => (
                      <tr
                        key={player.playerId}
                        className={
                          player.bo2Complete
                            ? ""
                            : "ranking-row--incomplete"
                        }
                      >
                        <td>{player.rank ?? "—"}</td>
                        <td>{player.displayName}</td>
                        <td>{player.game1Points ?? "Chưa xong"}</td>
                        <td>{player.game2Points ?? "Chưa xong"}</td>
                        <td>{player.totalPoints ?? "Chưa đủ 2 game"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default Ranking;