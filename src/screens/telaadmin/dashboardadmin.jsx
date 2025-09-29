import React, { useEffect, useState } from "react";
import { FaUserFriends, FaCheckCircle, FaClock, FaDollarSign, FaUserPlus, FaChartBar, FaDownload, FaBan } from "react-icons/fa";
import styles from "./dashboardadmin.module.css";
import SidebarAdmin from "../../components/SideBarAdmin/sidebaradmin";
import { useNavigate } from "react-router-dom";

function DashboardAdmin() {
    const [totalClientes, setTotalClientes] = useState(0);
    const [totalPendentes, setTotalPendentes] = useState(0);
    const [totalAprovados, setTotalAprovados] = useState(0);
    const [totalBloqueados, setTotalBloqueados] = useState(0);
    const [totalRejeitados, setTotalRejeitados] = useState(0);
    const [logsRecentes, setLogsRecentes] = useState([]);
    const [volumeTransacoes, setVolumeTransacoes] = useState(0);
    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");

    useEffect(() => {
        async function fetchVolumeTransacoes() {
            try {
                const res = await fetch("https://tcc-escolar-backend-production.up.railway.app/transferencias/volume", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setVolumeTransacoes(data.total);
            } catch (err) {
                console.error("Erro ao buscar volume de transações:", err);
            }
        }
        fetchVolumeTransacoes();
    }, [token]);

    useEffect(() => {
        async function fetchLogsRecentes() {
            try {
                const res = await fetch("https://tcc-escolar-backend-production.up.railway.app/logs/recentes", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setLogsRecentes(data);
            } catch (err) {
                console.error("Erro ao buscar logs recentes:", err);
            }
        }
        fetchLogsRecentes();
    }, [token]);


    useEffect(() => {
        async function fetchUsuarios() {
            try {
                const res = await fetch("https://tcc-escolar-backend-production.up.railway.app/usuarios", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setTotalClientes(data.length);
            } catch (err) {
                console.error("Erro ao buscar usuários:", err);
            }
        }
        fetchUsuarios();
    }, [token]);

    useEffect(() => {
        async function fetchBadge(url, setState) {
            try {
                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setState(data.total);
            } catch (err) {
                console.error("Erro ao buscar badge:", err);
            }
        }

        fetchBadge("https://tcc-escolar-backend-production.up.railway.app/usuarios/pendentes/count", setTotalPendentes);
        fetchBadge("https://tcc-escolar-backend-production.up.railway.app/usuarios/aprovados/count", setTotalAprovados);
        fetchBadge("https://tcc-escolar-backend-production.up.railway.app/usuarios/bloqueados/count", setTotalBloqueados);
        fetchBadge("https://tcc-escolar-backend-production.up.railway.app/usuarios/rejeitados/count", setTotalRejeitados);
    }, [token]);

    return (
        <div className={styles.dashboardContainer}>
            <SidebarAdmin />
            <main className={styles.mainContent}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Dashboard Administrativo</h1>
                    <p className={styles.pageDescription}>Visão geral do sistema bancário</p>
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statCardContent}>
                            <div className={styles.statInfo}>
                                <span className={styles.statTitle}>Total de Clientes</span>
                                <span className={styles.statValue}>{totalClientes}</span>
                            </div>
                            <span className={`${styles.statIcon} ${styles.statIconBlue}`}><FaUserFriends /></span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statCardContent}>
                            <div className={styles.statInfo}>
                                <span className={styles.statTitle}>Contas Ativas</span>
                                <span className={styles.statValue}>{totalAprovados}</span>
                            </div>
                            <span className={`${styles.statIcon} ${styles.statIconPurple}`}><FaCheckCircle /></span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statCardContent}>
                            <div className={styles.statInfo}>
                                <span className={styles.statTitle}>Contas Bloqueadas</span>
                                <span className={styles.statValue}>{totalBloqueados}</span>
                            </div>
                            <span className={`${styles.statIcon} ${styles.statIconRed}`}><FaBan /></span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statCardContent}>
                            <div className={styles.statInfo}>
                                <span className={styles.statTitle}>Aguardando Aprovação</span>
                                <span className={styles.statValue}>{totalPendentes}</span>
                            </div>
                            <span className={`${styles.statIcon} ${styles.statIconYellow}`}><FaClock /></span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statCardContent}>
                            <div className={styles.statInfo}>
                                <span className={styles.statTitle}>Contas Rejeitadas</span>
                                <span className={styles.statValue}>{totalRejeitados}</span>
                            </div>
                            <span className={`${styles.statIcon} ${styles.statIconRed1}`}><FaBan /></span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statCardContent}>
                            <div className={styles.statInfo}>
                                <span className={styles.statTitle}>Volume Transações</span>
                                <span className={styles.statValue}>
                                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(volumeTransacoes)}
                                </span>
                            </div>
                            <span className={`${styles.statIcon} ${styles.statIconGreen}`}><FaDollarSign /></span>
                        </div>
                    </div>
                </div>

                <div className={styles.overviewGrid}>
                    <div className={styles.activityCard}>
                        <div className={styles.cardTitle}>Atividades Recentes</div>
                        <div className={styles.activityList}>
                            {logsRecentes.map((log) => (
                                <div key={log.id} className={styles.activityItem}>
                                    <span className={`${styles.activityIcon} ${styles.activityIconBlue}`}><FaUserPlus /></span>
                                    <div className={styles.activityContent}>
                                        <span className={styles.activityTitle}>{log.tipo.replace(/_/g, " ")}</span>
                                        <span className={styles.activityDescription}>
                                            {log.usuario ? log.usuario : "Sistema"} - {new Date(log.data_criacao).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.quickActionsCard}>
                        <div className={styles.cardTitle}>Ações Rápidas</div>
                        <div className={styles.quickActionsGrid}>
                            <button className={`${styles.quickActionButton} ${styles.quickActionYellow}`} onClick={() => navigate("/admin/aprovacoesadmin")}><FaCheckCircle className={styles.quickActionIcon} /> Aprovar Pendentes</button>
                            <button className={`${styles.quickActionButton} ${styles.quickActionPurple}`} onClick={() => navigate("/admin/logsadmin")} ><FaChartBar className={styles.quickActionIcon} /> Ver Logs</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DashboardAdmin;
