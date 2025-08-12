import { useEffect } from "react";
import styles from "./telalogin.module.css"


function Login() {

    useEffect(() => {
        document.title = "Digite seu CPF, e-mail ou telefone para iniciar sessão";
    }, []);

    return (
        <div className={styles.container}>
            Salve
        </div>
    );
}


export default Login;