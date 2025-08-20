<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState } from "react";
>>>>>>> 0d675033de9b6dc22a4450790f4ab1999209a66f
import { FaCheck, FaTimes, FaEye, FaFileExport, FaExclamationTriangle } from "react-icons/fa";
import styles from "./aprovacoesadmin.module.css";
import SidebarAdmin from "../../components/SideBarAdmin/sidebaradmin";

<<<<<<< HEAD
=======
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
];

>>>>>>> 0d675033de9b6dc22a4450790f4ab1999209a66f
function formatDateBRtoISO(dateBR) {
  const [d, m, y] = dateBR.split("/");
  return `${y}-${m}-${d}`;
}

function AprovacoesAdmin() {
<<<<<<< HEAD
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("http://localhost:3000/usuarios/pendentes");
        if (!res.ok) throw new Error("Erro ao buscar usuários");
        const data = await res.json();
        const usersWithStatus = data.map(u => ({
          ...u,
          selected: false,
          status: u.situacao === "analise" ? "pending" : u.situacao === "rejeitado" ? "rejected" : "approved",
          initials: u.nome ? u.nome.split(" ").map(n => n[0]).join("") : "",
          dataNascimento: u.data_nascimento ? new Date(u.data_nascimento).toLocaleDateString("pt-BR") : "",
          dataSolicitacao: u.datasolicitacao ? new Date(u.datasolicitacao).toLocaleString("pt-BR") : ""
        }));
        setUsers(usersWithStatus);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUsers();
  }, []);

=======
  const [users, setUsers] = useState(initialUsers);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");

>>>>>>> 0d675033de9b6dc22a4450790f4ab1999209a66f
  const hasSelected = users.some(u => u.selected);
  const allSelected = users.every(u => u.selected);

  function handleSelectAll() {
<<<<<<< HEAD
    setUsers(prev => prev.map(u => ({ ...u, selected: !allSelected })));
  }

  function handleSelectOne(idx) {
    setUsers(prev => prev.map((u, i) => i === idx ? { ...u, selected: !u.selected } : u));
  }

  async function handleApproveSelected() {
    const selectedUsers = users.filter(u => u.selected);
    for (let u of selectedUsers) {
      await fetch(`http://localhost:3000/usuarios/${u.id}/aprovar`, { method: "PATCH" });
    }
    setUsers(prev => prev.map(u => u.selected ? { ...u, status: "approved", situacao: "aprovado", selected: false } : u));
  }

  async function handleRejectSelected() {
    const selectedUsers = users.filter(u => u.selected);
    for (let u of selectedUsers) {
      await fetch(`http://localhost:3000/usuarios/${u.id}/rejeitar`, { method: "PATCH" });
    }
    setUsers(prev => prev.map(u => u.selected ? { ...u, status: "rejected", situacao: "rejeitado", selected: false } : u));
=======
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
>>>>>>> 0d675033de9b6dc22a4450790f4ab1999209a66f
  }

  function handleExport() {
    alert("Exportação simulada.");
  }

  const filteredUsers = users.filter(user => {
<<<<<<< HEAD
    const matchesName = user.nome.toLowerCase().includes(searchName.toLowerCase());
    if (searchDate) {
      const userDateISO = formatDateBRtoISO(user.dataSolicitacao.split(" ")[0].split("/").join("/"));
=======
    const matchesName = user.name.toLowerCase().includes(searchName.toLowerCase());
    if (searchDate) {
      const userDateISO = formatDateBRtoISO(user.data);
>>>>>>> 0d675033de9b6dc22a4450790f4ab1999209a66f
      return matchesName && userDateISO === searchDate;
    }
    return matchesName;
  });

  return (
    <div className={styles.container}>
      <SidebarAdmin />
      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Aprovações Pendentes</h1>
<<<<<<< HEAD
          <div className={styles.pageSubtitle}>Clientes aguardando aprovação para ativação da conta</div>
        </div>
        <div className={styles.actions}>
          <button className={`${styles.actionBtn} ${styles.selected}`} onClick={handleApproveSelected} disabled={!hasSelected}><FaCheck /> Aprovar Selecionados</button>
          <button className={`${styles.actionBtn} ${styles.reject}`} onClick={handleRejectSelected} disabled={!hasSelected}><FaTimes /> Rejeitar Selecionados</button>
          <button className={`${styles.actionBtn} ${styles.export}`} onClick={handleExport}><FaFileExport /> Exportar Lista</button>
          <label className={styles.selectAllLabel}>
            <input type="checkbox" checked={allSelected} onChange={handleSelectAll} className={styles.selectAllCheckbox} />
=======
          <div className={styles.pageSubtitle}>
            Clientes aguardando aprovação para ativação da conta
          </div>
        </div>
        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${styles.selected}`}
            onClick={handleApproveSelected}
            disabled={!hasSelected}
          >
            <FaCheck />
            Aprovar Selecionados
          </button>
          <button
            className={`${styles.actionBtn} ${styles.reject}`}
            onClick={handleRejectSelected}
            disabled={!hasSelected}
          >
            <FaTimes />
            Rejeitar Selecionados
          </button>
          <button
            className={`${styles.actionBtn} ${styles.export}`}
            onClick={handleExport}
          >
            <FaFileExport />
            Exportar Lista
          </button>
          <label className={styles.selectAllLabel}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              className={styles.selectAllCheckbox}
            />
>>>>>>> 0d675033de9b6dc22a4450790f4ab1999209a66f
            Selecionar Todos
          </label>
        </div>
        <div className={styles.filtersRow}>
<<<<<<< HEAD
          <input className={styles.filterInput} type="text" placeholder="Pesquisar nome..." value={searchName} onChange={e => setSearchName(e.target.value)} />
          <input className={styles.filterInput} type="date" value={searchDate} onChange={e => setSearchDate(e.target.value)} placeholder="Filtrar por data" />
=======
          <input
            className={styles.filterInput}
            type="text"
            placeholder="Pesquisar nome..."
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
          />
          <input
            className={styles.filterInput}
            type="date"
            value={searchDate}
            onChange={e => setSearchDate(e.target.value)}
            placeholder="Filtrar por data"
          />
>>>>>>> 0d675033de9b6dc22a4450790f4ab1999209a66f
        </div>
        <div className={styles.cardsGrid}>
          {filteredUsers.map((user, i) => (
            <div className={styles.card} key={i}>
<<<<<<< HEAD
              <input type="checkbox" className={styles.cardCheckbox} checked={user.selected} onChange={() => handleSelectOne(i)} />
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>{user.initials}</div>
                <div>
                  <div className={styles.cardTitle}>{user.nome}</div>
=======
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
>>>>>>> 0d675033de9b6dc22a4450790f4ab1999209a66f
                  <div className={styles.cardEmail}>{user.email}</div>
                </div>
              </div>
              <div className={styles.cardBody}>
<<<<<<< HEAD
                <div className={styles.cardField}><strong>CPF:</strong> <span>{user.cpf}</span></div>
                <div className={styles.cardField}><strong>Telefone:</strong> <span>{user.telefone}</span></div>
                <div className={styles.cardField}><strong>Data Nascimento:</strong> <span>{user.dataNascimento}</span></div>
                <div className={styles.cardField}><strong>Data Solicitação:</strong> <span>{user.dataSolicitacao}</span></div>
                <div className={styles.cardField}><strong>Situação:</strong>
                  <span className={
                    user.status === "approved" ? styles.statusComplete :
                    user.status === "rejected" ? styles.statusRejected : styles.statusPending
                  }>
                    {user.status === "approved" ? <><FaCheck style={{ verticalAlign: "middle" }} /> Aprovado</> :
                    user.status === "rejected" ? <><FaTimes style={{ verticalAlign: "middle" }} /> Rejeitado</> :
                    <><FaExclamationTriangle style={{ verticalAlign: "middle" }} /> Em Análise</>}
=======
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
>>>>>>> 0d675033de9b6dc22a4450790f4ab1999209a66f
                  </span>
                </div>
              </div>
              <div className={styles.cardActions}>
<<<<<<< HEAD
                <button className={`${styles.cardBtn} ${styles.approve}`} onClick={async () => {
                  await fetch(`http://localhost:3000/usuarios/${user.id}/aprovar`, { method: "PATCH" });
                  setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: "approved", situacao: "aprovado", selected: false } : u));
                }}><FaCheck /> Aprovar</button>
                <button className={`${styles.cardBtn} ${styles.reject}`} onClick={async () => {
                  await fetch(`http://localhost:3000/usuarios/${user.id}/rejeitar`, { method: "PATCH" });
                  setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: "rejected", situacao: "rejeitado", selected: false } : u));
                }}><FaTimes /> Rejeitar</button>
                <button className={`${styles.cardBtn} ${styles.view}`} title="Visualizar" onClick={() => alert(`Visualizar dados de ${user.nome}`)}><FaEye /></button>
=======
                <button
                  className={
                    `${styles.cardBtn} ${styles.approve}` +
                    (user.status === "complete" ? "" : ` ${styles.disabled}`)
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
                  className={`${styles.cardBtn} ${styles.reject}`}
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
                  className={`${styles.cardBtn} ${styles.view}`}
                  title="Visualizar"
                  onClick={() => alert(`Visualizar dados de ${user.name}`)}
                >
                  <FaEye />
                </button>
>>>>>>> 0d675033de9b6dc22a4450790f4ab1999209a66f
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

<<<<<<< HEAD
export default AprovacoesAdmin;
=======
export default AprovacoesAdmin;
>>>>>>> 0d675033de9b6dc22a4450790f4ab1999209a66f
