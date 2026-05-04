import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";

function Cadastro() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function cadastrar(event) {
    event.preventDefault();
    setMensagem("");

    try {
      const resultado = await createUserWithEmailAndPassword(auth, email, senha);
      const usuario = resultado.user;

      await setDoc(doc(db, "usuarios", usuario.uid), {
        uid: usuario.uid,
        email: email,
        nome: nome,
        sobrenome: sobrenome,
        dataNascimento: dataNascimento,
      });

      navigate("/principal");
    } catch (erro) {
      setMensagem("Nao foi possivel cadastrar o usuario.");
    }
  }

  return (
    <main className="pagina">
      <section className="caixa">
        <h1>Cadastro</h1>

        <form onSubmit={cadastrar}>
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

          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            required
          />

          <label>Sobrenome</label>
          <input
            type="text"
            value={sobrenome}
            onChange={(event) => setSobrenome(event.target.value)}
            required
          />

          <label>Data de nascimento</label>
          <input
            type="date"
            value={dataNascimento}
            onChange={(event) => setDataNascimento(event.target.value)}
            required
          />

          <button type="submit">Cadastrar</button>
        </form>

        {mensagem && <p className="erro">{mensagem}</p>}

        <p>
          Ja possui cadastro? <Link to="/login">Fazer login</Link>
        </p>
      </section>
    </main>
  );
}

export default Cadastro;
