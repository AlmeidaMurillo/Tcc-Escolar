import React, { useEffect, useState } from "react";
import { FaUserFriends, FaCheckCircle, FaClock, FaDollarSign, FaUserPlus, FaChartBar, FaDownload, FaBan } from "react-icons/fa";
import styles from "./dashboardadmin.module.css";
import SidebarAdmin from "../../components/SideBarAdmin/sidebaradmin";
import { useNavigate } from "react-router-dom";

function DashboardAdmin() {
    const [totalClientes, setTotalClientes] = useState(0);
    const [totalPendentes, setTotalPendentes] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://tcc-escolar-backend-production.up.railway.app/usuarios/count")
            .then((res) => res.json())
            .then((data) => {
                setTotalClientes(data.total);
            })
            .catch((err) => {
                console.error("Erro ao buscar Usuarios:", err);
            });
    }, []);

    useEffect(() => {
        async function fetchBadge() {
            try {
                const res = await fetch("https://tcc-escolar-backend-production.up.railway.app/usuarios/pendentes/count");
                const data = await res.json();
                setTotalPendentes(data.total);
            } catch (err) {
                console.error("Erro ao buscar badge de aprovações:", err);
            }
        }
        fetchBadge();
    }, []);

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
                                <span className={styles.statTitle}>Aguardando Aprovação</span>
                                <span className={styles.statValue}>{totalPendentes}</span>
                            </div>
                            <span className={`${styles.statIcon} ${styles.statIconYellow}`}><FaClock /></span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statCardContent}>
                            <div className={styles.statInfo}>
                                <span className={styles.statTitle}>Volume Transações</span>
                                <span className={styles.statValue}>R$ 1.100,50</span>
                            </div>
                            <span className={`${styles.statIcon} ${styles.statIconGreen}`}><FaDollarSign /></span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statCardContent}>
                            <div className={styles.statInfo}>
                                <span className={styles.statTitle}>Contas Ativas</span>
                                <span className={styles.statValue}>2</span>
                            </div>
                            <span className={`${styles.statIcon} ${styles.statIconPurple}`}><FaCheckCircle /></span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statCardContent}>
                            <div className={styles.statInfo}>
                                <span className={styles.statTitle}>Contas Bloqueadas</span>
                                <span className={styles.statValue}>2</span>
                            </div>
                            <span className={`${styles.statIcon} ${styles.statIconRed}`}><FaBan /></span>
                        </div>
                    </div>
                </div>

                <div className={styles.overviewGrid}>
                    <div className={styles.activityCard}>
                        <div className={styles.cardTitle}>Atividades Recentes</div>
                        <div className={styles.activityList}>
                            <div className={styles.activityItem}>
                                <span className={`${styles.activityIcon} ${styles.activityIconBlue}`}><FaUserPlus /></span>
                                <div className={styles.activityContent}>
                                    <span className={styles.activityTitle}>Nova conta criada</span>
                                    <span className={styles.activityDescription}>João Silva - 2 min atrás</span>
                                </div>
                            </div>
                            <div className={styles.activityItem}>
                                <span className={`${styles.activityIcon} ${styles.activityIconGreen}`}><FaCheckCircle /></span>
                                <div className={styles.activityContent}>
                                    <span className={styles.activityTitle}>Cliente aprovado</span>
                                    <span className={styles.activityDescription}>Maria Oliveira - 5 min atrás</span>
                                </div>
                            </div>
                            <div className={styles.activityItem}>
                                <span className={`${styles.activityIcon} ${styles.activityIconYellow}`}><FaDollarSign /></span>
                                <div className={styles.activityContent}>
                                    <span className={styles.activityTitle}>Transferência processada</span>
                                    <span className={styles.activityDescription}>R$ 1.500,00 - 8 min atrás</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.quickActionsCard}>
                        <div className={styles.cardTitle}>Ações Rápidas</div>
                        <div className={styles.quickActionsGrid}>
                            <button className={`${styles.quickActionButton} ${styles.quickActionYellow}`} onClick={() => navigate("/admin/aprovacoesadmin")}><FaCheckCircle className={styles.quickActionIcon}  /> Aprovar Pendentes</button>
                            <button className={`${styles.quickActionButton} ${styles.quickActionBlue}`}><FaDownload className={styles.quickActionIcon} /> Exportar Relatório</button>
                            <button className={`${styles.quickActionButton} ${styles.quickActionGreen}`}><FaUserPlus className={styles.quickActionIcon} /> Novo Cliente</button>
                            <button className={`${styles.quickActionButton} ${styles.quickActionPurple}`}><FaChartBar className={styles.quickActionIcon} /> Ver Logs</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DashboardAdmin;
