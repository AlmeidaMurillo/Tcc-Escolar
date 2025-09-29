import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaFileExport, FaExclamationTriangle, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import styles from "./aprovacoesadmin.module.css";
import SidebarAdmin from "../../components/SideBarAdmin/sidebaradmin";

function AprovacoesAdmin() {
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("https://tcc-escolar-backend-production.up.railway.app/usuarios/pendentes", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Erro ao buscar usuários");
        const data = await res.json();
        const usersWithStatus = data.map(u => ({
          ...u,
          selected: false,
          status: u.situacao === "analise" ? "pending" : u.situacao === "rejeitado" ? "rejected" : "approved",
          initials: u.nome ? u.nome.split(" ").map(n => n[0]).join("") : "",
          dataNascimento: u.data_nascimento ? new Date(u.data_nascimento).toLocaleDateString("pt-BR") : "",
          dataSolicitacao: u.datasolicitacao ? new Date(u.datasolicitacao).toLocaleDateString("pt-BR") : "",
          dataCriacao: u.datacriacao ? new Date(u.datacriacao).toLocaleString("pt-BR") : ""
        }));
        setUsers(usersWithStatus);
      } catch (err) {
        console.error(err);
      }
    }
    if (token) fetchUsers();
  }, [token]);

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
      await fetch(`https://tcc-escolar-backend-production.up.railway.app/usuarios/${u.id}/aprovar`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    setUsers(prev => prev.map(u => u.selected ? { ...u, status: "approved", situacao: "aprovado", dataCriacao: new Date().toLocaleString("pt-BR"), selected: false } : u));
  }

  async function handleRejectSelected() {
    const selectedUsers = users.filter(u => u.selected);
    for (let u of selectedUsers) {
      await fetch(`https://tcc-escolar-backend-production.up.railway.app/usuarios/${u.id}/rejeitar`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    setUsers(prev => prev.map(u => u.selected ? { ...u, status: "rejected", situacao: "rejeitado", selected: false } : u));
  }

  function handleExportXLSX() {
    const selectedUsers = users.filter(u => u.selected);
    if (!selectedUsers.length) return;
    const data = selectedUsers.map(u => ({
      Nome: u.nome,
      Email: u.email,
      CPF: u.cpf,
      Telefone: u.telefone,
      "Data Nascimento": u.dataNascimento,
      "Data Solicitação": u.dataSolicitacao,
      Situação: u.status === "approved" ? "Aprovado" : u.status === "rejected" ? "Rejeitado" : "Em Análise"
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [
      { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios Selecionados");
    XLSX.writeFile(wb, "usuarios_selecionados.xlsx");
  }

  function handleExportPDF() {
    const selectedUsers = users.filter(u => u.selected);
    if (!selectedUsers.length) return;
    const data = selectedUsers.map(u => [
      u.nome, u.email, u.cpf, u.telefone, u.dataNascimento, u.dataSolicitacao,
      u.status === "approved" ? "Aprovado" : u.status === "rejected" ? "Rejeitado" : "Em Análise"
    ]);
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    doc.setFontSize(12);
    doc.text("Usuários Selecionados", 40, 40);
    autoTable(doc, {
      startY: 60,
      head: [["Nome", "Email", "CPF", "Telefone", "Data Nascimento", "Data Solicitação", "Situação"]],
      body: data,
      styles: { fontSize: 10, overflow: "linebreak", cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: "bold" },
      columnStyles: { 0: { cellWidth: 150 }, 1: { cellWidth: 180 }, 2: { cellWidth: 70 }, 3: { cellWidth: 90 }, 4: { cellWidth: 90 }, 5: { cellWidth: 90 }, 6: { cellWidth: 80 } }
    });
    doc.save("usuarios_selecionados.pdf");
  }

  const filteredUsers = users.filter(user => {
    const matchesName = user.nome.toLowerCase().includes(searchName.toLowerCase());
    if (searchDate) {
      const userDateISO = user.datasolicitacao ? new Date(user.datasolicitacao).toISOString().split("T")[0] : "";
      return matchesName && userDateISO === searchDate;
    }
    return matchesName;
  });

  async function handleAnalysis(userId) {
    try {
      await fetch(`https://tcc-escolar-backend-production.up.railway.app/usuarios/${userId}/analise`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, status: "pending", situacao: "analise" } : u)
      );
    } catch (err) {
      console.error("Erro ao colocar usuário em análise:", err);
    }
  }

  async function handleDelete(userId) {
    if (!window.confirm("Tem certeza que deseja deletar este usuário?")) return;

    try {
      await fetch(`https://tcc-escolar-backend-production.up.railway.app/usuarios/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
    }
  }

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
          <button className={`${styles.actionBtn} ${styles.export}`} onClick={handleExportXLSX} disabled={!hasSelected}>
            <FaFileExport /> Exportar XLSX
          </button>
          <button className={`${styles.actionBtn} ${styles.export}`} onClick={handleExportPDF} disabled={!hasSelected}>
            <FaFileExport /> Exportar PDF
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
                    {user.status === "approved" ? <> <FaCheck /> Aprovado</> :
                      user.status === "rejected" ? <> <FaTimes /> Rejeitado</> :
                        <> <FaExclamationTriangle /> Em Análise</>}
                  </span>
                </div>
              </div>
              <div className={styles.cardActions}>
                <button className={`${styles.cardBtn} ${styles.approve}`} onClick={async () => {
                  await fetch(`https://tcc-escolar-backend-production.up.railway.app/usuarios/${user.id}/aprovar`, {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: "approved", situacao: "aprovado", dataCriacao: new Date().toLocaleString("pt-BR"), selected: false } : u));
                }}><FaCheck /> Aprovar</button>
                <button className={`${styles.cardBtn} ${styles.reject}`} onClick={async () => {
                  await fetch(`https://tcc-escolar-backend-production.up.railway.app/usuarios/${user.id}/rejeitar`, {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: "rejected", situacao: "rejeitado", selected: false } : u));
                }}><FaTimes /> Rejeitar</button>
                <button
                  className={`${styles.cardBtn} ${styles.analysis}`}
                  onClick={() => handleAnalysis(user.id)}
                >
                  <FaExclamationTriangle /> Análise
                </button>

                <button
                  className={`${styles.cardBtn} ${styles.delete}`}
                  onClick={() => handleDelete(user.id)}
                >
                  <FaTrash /> Deletar
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
