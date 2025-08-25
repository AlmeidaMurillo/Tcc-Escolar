import React, { useState, useEffect } from "react";
import { FaUserPlus, FaDownload, FaLock, FaUnlock, FaEllipsisV } from "react-icons/fa";
import styles from "./clientesadmin.module.css";
import SidebarAdmin from "../../components/SideBarAdmin/sidebaradmin";
import axios from "axios";

function ClientesAdmin() {
  const [clientesData, setClientesData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/usuarios", {
          params: { search, status: statusFilter }
        });
        setClientesData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [search, statusFilter]);

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
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className={styles.selectStatus}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Ativo">Ativo</option>
            <option value="Bloqueado">Bloqueado</option>
          </select>
          <button className={styles.exportButton}>
            <FaDownload /> Exportar
          </button>
          <button className={styles.newClientButton}>
            <FaUserPlus /> Novo Cliente
          </button>
        </div>
        <div className={styles.tableContainer}>
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
                clientesData.map(cliente => (
                  <tr key={cliente.id}>
                    <td>
                      <div className={styles.clienteInfo}>
                        <span className={styles.clienteAvatar}>{cliente.avatar}</span>
                        <span className={styles.clienteNome}>{cliente.nome}</span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.saldo}>{cliente.saldo}</span>
                    </td>
                    <td>
                      <span className={
                        cliente.status === "Ativo" ? styles.statusAtivo : styles.statusBloqueado
                      }>
                        {cliente.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.acaoBtns}>
                        {cliente.status === "Ativo" ? (
                          <button className={styles.acaoBtn} title="Bloquear"><FaLock /></button>
                        ) : (
                          <button className={styles.acaoBtn} title="Desbloquear"><FaUnlock /></button>
                        )}
                        <button className={styles.acaoBtn} title="Ver Mais"><FaEllipsisV /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className={styles.tableFooter}>
            <span>{clientesData.length} clientes</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ClientesAdmin;
