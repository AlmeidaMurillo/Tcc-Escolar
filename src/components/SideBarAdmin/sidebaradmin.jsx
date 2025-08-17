import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logoheader from "../../images/logoheader.png";
import logoheadermobile from "../../images/logoheadermobile.png";
import { FaChartBar, FaUserFriends, FaCheckCircle, FaClipboardList } from "react-icons/fa";
import styles from "./sidebaradmin.module.css";

function SidebarAdmin({ badgeAprovacoes = 6 }) {
  const navigate = useNavigate();

  const handleClicklogo = () => {
    if (window.location.pathname === "/admin/dashboardadmin") {
      window.location.reload();
    } else {
      navigate("/admin/dashboardadmin");
    }
  };

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.divlogo}>
            <img src={logoheader} alt="logoheader" className={styles.logoheader} onClick={handleClicklogo} />
            <img src={logoheadermobile} alt="logoheadermobile" className={styles.logoheadermobile} onClick={handleClicklogo} />
          </div>
        </div>
      </header>
      <nav className={styles.sidebarNav}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarTitle}>Painel Admin</span>
        </div>
        <ul className={styles.sidebarMenu}>
          <li>
            <NavLink to="/admin/dashboardadmin" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`} end>
              <span className={styles.menuIcon}><FaChartBar /></span>
              <span className={styles.menuLabel}>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/clientesadmin" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}>
              <span className={styles.menuIcon}><FaUserFriends /></span>
              <span className={styles.menuLabel}>Clientes</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/aprovacoesadmin" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}>
              <span className={styles.menuIcon}><FaCheckCircle /></span>
              <span className={styles.menuLabel}>Aprovações</span>
              {badgeAprovacoes > 0 && <span className={styles.badge}>{badgeAprovacoes}</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/logsadmin" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}>
              <span className={styles.menuIcon}><FaClipboardList /></span>
              <span className={styles.menuLabel}>Logs do Sistema</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default SidebarAdmin;
