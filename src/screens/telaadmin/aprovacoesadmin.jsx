import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaEye, FaFileExport, FaExclamationTriangle } from "react-icons/fa";
import styles from "./aprovacoesadmin.module.css";
import SidebarAdmin from "../../components/SideBarAdmin/sidebaradmin";

function AprovacoesAdmin() {
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("https://tcc-escolar-backend-production.up.railway.app/usuarios/pendentes");
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

  const hasSelected = users.some(u => u.selected);
  const allSelected = users.every(u => u.selected);

  function handleSelectAll() {
    setUsers(prev => prev.map(u => ({ ...u, selected: !allSelected })));
  }

  function handleSelectOne(idx) {
    setUsers(prev => prev.map((u, i) => i === idx ? { ...u, selected: !u.selected } : u));
  }

  async function handleApproveSelected() {
    const selectedUsers = users.filter(u => u.selected);
    for (let u of selectedUsers) {
      await fetch(`https://tcc-escolar-backend-production.up.railway.app/usuarios/${u.id}/aprovar`, { method: "PATCH" });
    }
    setUsers(prev => prev.map(u => u.selected ? { ...u, status: "approved", situacao: "aprovado", selected: false } : u));
  }

  async function handleRejectSelected() {
    const selectedUsers = users.filter(u => u.selected);
    for (let u of selectedUsers) {
      await fetch(`https://tcc-escolar-backend-production.up.railway.app/usuarios/${u.id}/rejeitar`, { method: "PATCH" });
    }
    setUsers(prev => prev.map(u => u.selected ? { ...u, status: "rejected", situacao: "rejeitado", selected: false } : u));
  }

  function handleExport() {
    alert("Exportação simulada.");
  }

  const filteredUsers = users.filter(user => {
    const matchesName = user.nome.toLowerCase().includes(searchName.toLowerCase());

    if (searchDate) {
      const userDateISO = new Date(user.datasolicitacao).toISOString().split("T")[0];
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
          <div className={styles.pageSubtitle}>Clientes aguardando aprovação para ativação da conta</div>
        </div>
        <div className={styles.actions}>
          <button className={`${styles.actionBtn} ${styles.selected}`} onClick={handleApproveSelected} disabled={!hasSelected}>
            <FaCheck /> Aprovar Selecionados
          </button>
          <button className={`${styles.actionBtn} ${styles.reject}`} onClick={handleRejectSelected} disabled={!hasSelected}>
            <FaTimes /> Rejeitar Selecionados
          </button>
          <button className={`${styles.actionBtn} ${styles.export}`} onClick={handleExport}>
            <FaFileExport /> Exportar Lista
          </button>
          <label className={styles.selectAllLabel}>
            <input type="checkbox" checked={allSelected} onChange={handleSelectAll} className={styles.selectAllCheckbox} />
            Selecionar Todos
          </label>
        </div>
        <div className={styles.filtersRow}>
          <input className={styles.filterInput} type="text" placeholder="Pesquisar nome..." value={searchName} onChange={e => setSearchName(e.target.value)} />
          <input className={styles.filterInput} type="date" value={searchDate} onChange={e => setSearchDate(e.target.value)} placeholder="Filtrar por data" />
        </div>
        <div className={styles.cardsGrid}>
          {filteredUsers.map((user, i) => (
            <div className={styles.card} key={i}>
              <input type="checkbox" className={styles.cardCheckbox} checked={user.selected} onChange={() => handleSelectOne(i)} />
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>{user.initials}</div>
                <div>
                  <div className={styles.cardTitle}>{user.nome}</div>
                  <div className={styles.cardEmail}>{user.email}</div>
                </div>
              </div>
              <div className={styles.cardBody}>
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
                  </span>
                </div>
              </div>
              <div className={styles.cardActions}>
                <button className={`${styles.cardBtn} ${styles.approve}`} onClick={async () => {
                  await fetch(`https://tcc-escolar-backend-production.up.railway.app/usuarios/${user.id}/aprovar`, { method: "PATCH" });
                  setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: "approved", situacao: "aprovado", selected: false } : u));
                }}><FaCheck /> Aprovar</button>
                <button className={`${styles.cardBtn} ${styles.reject}`} onClick={async () => {
                  await fetch(`https://tcc-escolar-backend-production.up.railway.app/usuarios/${user.id}/rejeitar`, { method: "PATCH" });
                  setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: "rejected", situacao: "rejeitado", selected: false } : u));
                }}><FaTimes /> Rejeitar</button>
                <button className={`${styles.cardBtn} ${styles.view}`} title="Visualizar" onClick={() => alert(`Visualizar dados de ${user.nome}`)}><FaEye /></button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AprovacoesAdmin;
