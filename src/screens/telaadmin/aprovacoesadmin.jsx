import { useState } from "react";
import { FaCheck, FaTimes, FaEye, FaFileExport, FaExclamationTriangle } from "react-icons/fa";
import styles from "./aprovacoesadmin.module.css";
import SidebarAdmin from "../../components/SideBarAdmin/sidebaradmin";

const initialUsers = [
  {
    name: "Ana Ferreira",
    initials: "AF",
    email: "ana.ferreira@email.com",
    cpf: "111.222.333-44",
    telefone: "(11) 99999-8888",
    data: "21/03/2024",
    documentos: "Completos",
    status: "complete",
    selected: false,
  },
  {
    name: "Pedro Costa",
    initials: "PC",
    email: "pedro.costa@email.com",
    cpf: "555.666.777-88",
    telefone: "(21) 98888-7777",
    data: "20/03/2024",
    documentos: "Pendentes",
    status: "pending",
    selected: false,
  },
  {
    name: "Pedro Costa",
    initials: "PC",
    email: "pedro.costa@email.com",
    cpf: "555.666.777-88",
    telefone: "(21) 98888-7777",
    data: "20/03/2024",
    documentos: "Pendentes",
    status: "pending",
    selected: false,
  },
  {
    name: "Pedro Costa",
    initials: "PC",
    email: "pedro.costa@email.com",
    cpf: "555.666.777-88",
    telefone: "(21) 98888-7777",
    data: "20/03/2024",
    documentos: "Pendentes",
    status: "pending",
    selected: false,
  },
  {
    name: "Pedro Costa",
    initials: "PC",
    email: "pedro.costa@email.com",
    cpf: "555.666.777-88",
    telefone: "(21) 98888-7777",
    data: "20/03/2024",
    documentos: "Pendentes",
    status: "pending",
    selected: false,
  },
  {
    name: "Pedro Costa",
    initials: "PC",
    email: "pedro.costa@email.com",
    cpf: "555.666.777-88",
    telefone: "(21) 98888-7777",
    data: "20/03/2024",
    documentos: "Pendentes",
    status: "pending",
    selected: false,
  },
];

function AprovacoesAdmin() {
  const [users, setUsers] = useState(initialUsers);

  const hasSelected = users.some(u => u.selected);
  const allSelected = users.every(u => u.selected);

  function handleSelectAll() {
    setUsers(prev =>
      prev.map(u => ({ ...u, selected: !allSelected }))
    );
  }

  function handleSelectOne(idx) {
    setUsers(prev =>
      prev.map((u, i) => i === idx ? { ...u, selected: !u.selected } : u)
    );
  }

  function handleApproveSelected() {
    if (!hasSelected) return;
    setUsers(prev =>
      prev.map(u =>
        u.selected && u.status === "complete"
          ? { ...u, selected: false, status: "approved" }
          : u
      )
    );
  }

  function handleRejectSelected() {
    if (!hasSelected) return;
    setUsers(prev =>
      prev.map(u =>
        u.selected ? { ...u, selected: false, status: "rejected" } : u
      )
    );
  }

  function handleExport() {
    alert("Exportação simulada.");
  }

  return (
    <div className={styles.container}>
      <SidebarAdmin />
      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Aprovações Pendentes</h1>
          <div className={styles.pageSubtitle}>
            Clientes aguardando aprovação para ativação da conta
          </div>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.actionBtn + " " + styles.selected}
            onClick={handleApproveSelected}
            disabled={!hasSelected}
          >
            <FaCheck />
            Aprovar Selecionados
          </button>
          <button
            className={styles.actionBtn + " " + styles.reject}
            onClick={handleRejectSelected}
            disabled={!hasSelected}
          >
            <FaTimes />
            Rejeitar Selecionados
          </button>
          <button
            className={styles.actionBtn + " " + styles.export}
            onClick={handleExport}
          >
            <FaFileExport />
            Exportar Lista
          </button>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              style={{ accentColor: "#2563eb", width: "1.3rem", height: "1.3rem" }}
            />
            Selecionar Todos
          </label>
        </div>
        <div className={styles.cardsGrid}>
          {users.map((user, i) => (
            <div className={styles.card} key={i}>
              <input
                type="checkbox"
                className={styles.cardCheckbox}
                checked={user.selected}
                onChange={() => handleSelectOne(i)}
              />
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>{user.initials}</div>
                <div>
                  <div className={styles.cardTitle}>{user.name}</div>
                  <div className={styles.cardEmail}>{user.email}</div>
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardField}>
                  <strong>CPF:</strong>
                  <span>{user.cpf}</span>
                </div>
                <div className={styles.cardField}>
                  <strong>Telefone:</strong>
                  <span>{user.telefone}</span>
                </div>
                <div className={styles.cardField}>
                  <strong>Data Solicitação:</strong>
                  <span>{user.data}</span>
                </div>
                <div className={styles.cardField}>
                  <strong>Documentos:</strong>
                  <span
                    className={
                      user.status === "complete"
                        ? styles.statusComplete
                        : user.status === "pending"
                        ? styles.statusPending
                        : user.status === "approved"
                        ? styles.statusComplete
                        : styles.statusPending
                    }
                  >
                    {user.status === "complete" ? (
                      <>
                        <FaCheck style={{ verticalAlign: "middle" }} /> Completos
                      </>
                    ) : user.status === "pending" ? (
                      <>
                        <FaExclamationTriangle style={{ verticalAlign: "middle" }} /> Pendentes
                      </>
                    ) : user.status === "approved" ? (
                      <>
                        <FaCheck style={{ verticalAlign: "middle" }} /> Aprovado
                      </>
                    ) : (
                      <>
                        <FaTimes style={{ verticalAlign: "middle" }} /> Rejeitado
                      </>
                    )}
                  </span>
                </div>
              </div>
              <div className={styles.cardActions}>
                <button
                  className={
                    styles.cardBtn +
                    " " +
                    styles.approve +
                    (user.status === "complete" ? "" : " " + styles.disabled)
                  }
                  disabled={user.status !== "complete"}
                  onClick={() => {
                    if (user.status === "complete") {
                      setUsers(prev =>
                        prev.map((u, idx) =>
                          idx === i ? { ...u, status: "approved" } : u
                        )
                      );
                    }
                  }}
                >
                  <FaCheck />
                  Aprovar
                </button>
                <button
                  className={styles.cardBtn + " " + styles.reject}
                  onClick={() =>
                    setUsers(prev =>
                      prev.map((u, idx) =>
                        idx === i ? { ...u, status: "rejected" } : u
                      )
                    )
                  }
                >
                  <FaTimes />
                  Rejeitar
                </button>
                <button
                  className={styles.cardBtn + " " + styles.view}
                  title="Visualizar"
                  onClick={() => alert(`Visualizar dados de ${user.name}`)}
                >
                  <FaEye />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AprovacoesAdmin;