import React from "react";
import {
  FaChartBar,
  FaUserFriends,
  FaCheckCircle,
  FaClipboardList,
  FaLock,
  FaEye,
  FaEdit,
  FaDownload,
} from "react-icons/fa";
import styles from "./clientesadmin.module.css";

const clientes = [
  {
    nome: "João Silva",
    email: "joao.silva@email.com",
    cpf: "123.456.789-00",
    saldo: "R$ 2.350,00",
    status: "ativo",
    criado: "14/03/2024",
    initials: "JS",
  },
  {
    nome: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    cpf: "987.654.321-00",
    saldo: "R$ 5.780,00",
    status: "ativo",
    criado: "19/03/2024",
    initials: "MO",
  },
  {
    nome: "Carlos Santos",
    email: "carlos.santos@email.com",
    cpf: "456.789.123-00",
    saldo: "R$ 890,00",
    status: "bloqueado",
    criado: "09/03/2024",
    initials: "CS",
  },
];

function ClientesAdmin() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.headerLeft}>
            <span className={styles.logo}>mercado<span className={styles.logoLight}>pago</span></span>
            <span className={styles.dashboardTitle}>Admin Dashboard</span>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.avatar}><FaUserFriends /></span>
            <span className={styles.userName}>Admin User</span>
            <span className={styles.logoutButton}><FaClipboardList /></span>
          </div>
        </div>
      </header>
      <div className={styles.mainLayout}>
        <aside className={styles.sidebar}>
          <nav className={styles.sidebarNav}>
            <div className={styles.sidebarHeader}>
              <span className={styles.sidebarTitle}>Painel Admin</span>
            </div>
            <ul className={styles.sidebarMenu}>
              <li className={styles.menuItem}>
                <span className={styles.menuIcon}><FaChartBar /></span>
                <span className={styles.menuLabel}>Dashboard</span>
              </li>
              <li className={`${styles.menuItem} ${styles.menuItemActive}`}>
                <span className={styles.menuIcon}><FaUserFriends /></span>
                <span className={styles.menuLabel}>Clientes</span>
              </li>
              <li className={styles.menuItem}>
                <span className={styles.menuIcon}><FaCheckCircle /></span>
                <span className={styles.menuLabel}>Aprovações Pendentes</span>
                <span className={styles.badge}>2</span>
              </li>
              <li className={styles.menuItem}>
                <span className={styles.menuIcon}><FaClipboardList /></span>
                <span className={styles.menuLabel}>Logs do Sistema</span>
              </li>
              <li className={styles.menuItem}>
                <span className={styles.menuIcon}><FaChartBar /></span>
                <span className={styles.menuLabel}>Configurações</span>
              </li>
            </ul>
          </nav>
        </aside>
        <main className={styles.content}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Gestão de Clientes</h1>
          </div>
          <div className={styles.clientesControls}>
            <div className={styles.inputWrapper}>
              <input
                className={styles.inputSearch}
                type="text"
                placeholder="Buscar por nome, email ou CPF..."
              />
            </div>
            <select className={styles.selectStatus}>
              <option>Todos os Status</option>
              <option>Ativo</option>
              <option>Bloqueado</option>
            </select>
            <button className={styles.exportButton}>
              <FaDownload /> Exportar
            </button>
            <button className={styles.newClientButton}>
              + Novo Cliente
            </button>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>CPF</th>
                  <th>Saldo</th>
                  <th>Status</th>
                  <th>Criado em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.email}>
                    <td>
                      <div className={styles.clienteInfo}>
                        <div className={styles.clienteAvatar}>{c.initials}</div>
                        <span className={styles.clienteNome}>{c.nome}</span>
                      </div>
                    </td>
                    <td>{c.email}</td>
                    <td>{c.cpf}</td>
                    <td><span className={styles.saldo}>{c.saldo}</span></td>
                    <td>
                      <span
                        className={
                          c.status === "ativo"
                            ? styles.statusAtivo
                            : styles.statusBloqueado
                        }
                      >
                        {c.status === "ativo" ? "Ativo" : "Bloqueado"}
                      </span>
                    </td>
                    <td>{c.criado}</td>
                    <td>
                      <div className={styles.acaoBtns}>
                        <button className={styles.acaoBtn}><FaEye /></button>
                        <button className={styles.acaoBtn}><FaEdit /></button>
                        <button className={styles.acaoBtn}><FaLock /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.tableFooter}>
              <span>Mostrando 1-3 de 3 clientes</span>
              <div className={styles.paginacao}>
                <button>Anterior</button>
                <button className={styles.paginacaoAtiva}>1</button>
                <button>2</button>
                <button>3</button>
                <button>Próximo</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


export default ClientesAdmin;