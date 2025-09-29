import React, { useState, useEffect } from "react";
import { FaLock, FaUnlock, FaEllipsisV } from "react-icons/fa";
import styles from "./clientesadmin.module.css";
import SidebarAdmin from "../../components/SideBarAdmin/sidebaradmin";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ClientesAdmin() {
  const [clientesData, setClientesData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [menuAberto, setMenuAberto] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/admin/loginadmin");
        return;
      }

      try {
        const res = await axios.get(
          "https://tcc-escolar-backend-production.up.railway.app/usuarios",
          {
            params: { search, status: statusFilter },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const filtrados = res.data.filter(
          (c) => c.situacao === "aprovado" || c.situacao === "bloqueado"
        );

        setClientesData(filtrados);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem("adminToken");
          navigate("/admin/loginadmin");
        }
      }
    };

    fetchData();
  }, [search, statusFilter, token, navigate]);

  const bloquearUsuario = async (id) => {
    await axios.patch(
      `https://tcc-escolar-backend-production.up.railway.app/usuarios/${id}/bloquear`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setClientesData((prev) =>
      prev.map((c) => (c.id === id ? { ...c, situacao: "bloqueado" } : c))
    );
  };

  const desbloquearUsuario = async (id) => {
    await axios.patch(
      `https://tcc-escolar-backend-production.up.railway.app/usuarios/${id}/desbloquear`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setClientesData((prev) =>
      prev.map((c) => (c.id === id ? { ...c, situacao: "aprovado" } : c))
    );
  };

  const deletarUsuario = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este cliente?")) return;

    await axios.delete(
      `https://tcc-escolar-backend-production.up.railway.app/usuarios/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setClientesData((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className={styles.container}>
      <SidebarAdmin />
      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Clientes</h1>
        </div>
        <div className={styles.clientesControls}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.inputSearch}
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className={styles.selectStatus}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="aprovado">Ativo</option>
            <option value="bloqueado">Bloqueado</option>
          </select>
        </div>
        <div className={styles.tableContainer}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Saldo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientesData.length === 0 ? (
                  <tr>
                    <td colSpan={4}>Nenhum cliente encontrado.</td>
                  </tr>
                ) : (
                  clientesData.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>
                        <div className={styles.clienteInfo}>
                          <span className={styles.clienteAvatar}>{cliente.avatar}</span>
                          <span className={styles.clienteNome}>{cliente.nome}</span>
                        </div>
                      </td>
                      <td>
                        <span className={styles.saldo}>
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(cliente.saldo)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            cliente.situacao === "aprovado"
                              ? styles.statusAtivo
                              : styles.statusBloqueado
                          }
                        >
                          {cliente.situacao === "aprovado" ? "Ativo" : "Bloqueado"}
                        </span>
                      </td>
                      <td>
                        <div className={styles.acaoBtns}>
                          {cliente.situacao === "aprovado" ? (
                            <button
                              className={styles.acaoBtn}
                              title="Bloquear"
                              onClick={() => bloquearUsuario(cliente.id)}
                            >
                              <FaLock />
                            </button>
                          ) : (
                            <button
                              className={styles.acaoBtn}
                              title="Desbloquear"
                              onClick={() => desbloquearUsuario(cliente.id)}
                            >
                              <FaUnlock />
                            </button>
                          )}
                          <div className={styles.dropdownWrapper}>
                            <button
                              className={styles.acaoBtn}
                              title="Ver Mais"
                              onClick={() =>
                                setMenuAberto(menuAberto === cliente.id ? null : cliente.id)
                              }
                            >
                              <FaEllipsisV />
                            </button>
                            {menuAberto === cliente.id && (
                              <div className={styles.dropdownMenu}>
                                <button
                                  className={styles.dropdownItem}
                                  onClick={() => deletarUsuario(cliente.id)}
                                >
                                  Deletar
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.tableFooter}>
            <span>{clientesData.length} clientes</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ClientesAdmin;
