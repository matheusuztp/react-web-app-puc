import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function entrar(event) {
    event.preventDefault();
    setMensagem("");

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/principal");
    } catch (erro) {
      setMensagem("Usuario nao cadastrado ou senha incorreta.");
    }
  }

  return (
    <main className="pagina">
      <section className="caixa">
        <h1>Login</h1>

        <form onSubmit={entrar}>
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
          />

          <button type="submit">Entrar</button>
        </form>

        {mensagem && <p className="erro">{mensagem}</p>}

        <p>
          Nao tem cadastro? <Link to="/cadastro">Cadastrar usuario</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
