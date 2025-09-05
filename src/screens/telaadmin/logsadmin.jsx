import { useState, useEffect, useMemo, useRef } from "react";
import styles from "./logsadmin.module.css";
import SidebarAdmin from "../../components/SideBarAdmin/sidebaradmin";

function LogsAdmin() {
  const [logs, setLogs] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [menuAbertoId, setMenuAbertoId] = useState(null);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch("https://tcc-escolar-backend-production.up.railway.app/logs", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Erro ao buscar logs");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Erro ao buscar logs:", err);
      }
    }
    fetchLogs();
  }, []);

  const logsFiltrados = useMemo(() => {
    return logs
      .filter(log => {
        const buscaLower = busca.toLowerCase();
        return (
          (log.usuario?.toLowerCase().includes(buscaLower) ||
            log.id.toString().includes(buscaLower) ||
            log.id_usuario?.toString().includes(buscaLower))
        );
      })
      .filter(log => filtroTipo === "Todos" || log.tipo === filtroTipo)
      .sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao));
  }, [logs, busca, filtroTipo]);

  const abrirMenu = (e, logId) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuAbertoId(logId);
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  const fecharMenu = () => setMenuAbertoId(null);

  const copiarParaAreaTransferencia = (texto) => {
    navigator.clipboard.writeText(texto)
      .then(() => alert("IP copiado!"))
      .catch(() => alert("Falha ao copiar IP"));
    fecharMenu();
  };

  let touchTimer = null;
  const iniciarTouchLongo = (e, logId) => {
    e.preventDefault();
    touchTimer = setTimeout(() => {
      const touch = e.touches[0];
      abrirMenu({ clientX: touch.clientX, clientY: touch.clientY, stopPropagation: () => {} }, logId);
    }, 600);
  };
  const cancelarTouchLongo = () => { if (touchTimer) clearTimeout(touchTimer); };

  return (
    <div className={styles.logsContainer} onClick={fecharMenu}>
      <SidebarAdmin />
      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Logs Administrativo</h1>
          <p className={styles.pageDescription}>Visão geral do sistema</p>
        </div>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar por ID Log, ID Usuário ou Nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className={styles.filterSelect}
          >
            <option>Todos</option>
            <option>cadastro_sucesso</option>
            <option>cadastro_erro</option>
            <option>login_sucesso</option>
            <option>login_erro</option>
            <option>recuperar_senha_enviar</option>
            <option>recuperar_senha_validar</option>
            <option>recuperar_senha_redefinir</option>
          </select>
        </div>

        <div className={styles.logsTableContainer}>
          <table className={styles.logsTable}>
            <thead>
              <tr>
                <th>ID Log</th>
                <th>ID Usuário</th>
                <th>Tipo</th>
                <th>Usuário</th>
                <th>Data/Hora</th>
                <th>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {logsFiltrados.map((log) => (
                <tr
                  key={log.id}
                  onContextMenu={(e) => abrirMenu(e, log.id)}
                  onTouchStart={(e) => iniciarTouchLongo(e, log.id)}
                  onTouchEnd={cancelarTouchLongo}
                  className={styles.logRow}
                >
                  <td>{log.id}</td>
                  <td>{log.id_usuario}</td>
                  <td>{log.tipo}</td>
                  <td>{log.usuario || "—"}</td>
                  <td>{new Date(log.data_criacao).toLocaleString("pt-BR")}</td>
                  <td>{log.detalhes}</td>
                </tr>
              ))}
              {logsFiltrados.length === 0 && (
                <tr>
                  <td colSpan="6" className={styles.noLogs}>Nenhum log encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {menuAbertoId && (
          <div
            ref={menuRef}
            className={styles.menuContexto}
            style={{
              top: menuPos.y,
              left: menuPos.x,
              position: "fixed",
              zIndex: 9999,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.menuItem}>
              <label>IP do usuário:</label>
              <input
                type="text"
                value={logs.find(l => l.id === menuAbertoId)?.ip_origem || ""}
                readOnly
              />
              <button
                className={styles.copiarBtn}
                onClick={() => copiarParaAreaTransferencia(logs.find(l => l.id === menuAbertoId)?.ip_origem)}
              >
                Copiar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default LogsAdmin;
