import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";

function validarEmail(email) {
  if (email === "" || email.includes(" ")) {
    return false;
  }

  const partes = email.split("@");

  if (partes.length !== 2) {
    return false;
  }

  const parteLocal = partes[0];
  const dominio = partes[1];
  const caracteresLocal = /^[a-zA-Z0-9.!#$%&'*+\-/=?^_`{|}~]+$/;

  if (parteLocal.length === 0 || parteLocal.length > 64) {
    return false;
  }

  if (!caracteresLocal.test(parteLocal)) {
    return false;
  }

  if (
    parteLocal.startsWith(".") ||
    parteLocal.endsWith(".") ||
    parteLocal.includes("..")
  ) {
    return false;
  }

  if (dominio.length === 0 || dominio.length > 255 || !dominio.includes(".")) {
    return false;
  }

  const partesDominio = dominio.split(".");
  const tld = partesDominio[partesDominio.length - 1];

  if (!/^[a-zA-Z]{2,}$/.test(tld)) {
    return false;
  }

  for (const parte of partesDominio) {
    if (parte.length === 0) {
      return false;
    }

    if (!/^[a-zA-Z0-9-]+$/.test(parte)) {
      return false;
    }

    if (parte.startsWith("-") || parte.endsWith("-")) {
      return false;
    }
  }

  return true;
}

function validarData(dataNascimento) {
  if (dataNascimento === "") {
    return false;
  }

  const data = new Date(dataNascimento + "T00:00:00");
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataMinima = new Date();
  dataMinima.setFullYear(hoje.getFullYear() - 100);
  dataMinima.setHours(0, 0, 0, 0);

  return data >= dataMinima && data <= hoje;
}

function Cadastro() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [mensagem, setMensagem] = useState("");

  const senhaTemTamanho = senha.length >= 8;
  const senhaTemMaiuscula = /[A-Z]/.test(senha);
  const senhaTemNumero = /[0-9]/.test(senha);
  const senhaTemEspecial = /[!@#$%&*?]/.test(senha);
  const caracteresInvalidos = senha.match(/['";\\/]/g) || [];
  const senhaSemInvalidos = caracteresInvalidos.length === 0;
  const senhaValida =
    senhaTemTamanho &&
    senhaTemMaiuscula &&
    senhaTemNumero &&
    senhaTemEspecial &&
    senhaSemInvalidos;
  const emailValido = validarEmail(email);
  const dataValida = validarData(dataNascimento);
  const formularioValido =
    emailValido && senhaValida && dataValida && nome !== "" && sobrenome !== "";
  const mostrarValidacoesSenha = senha !== "" && !senhaValida;

  async function cadastrar(event) {
    event.preventDefault();
    setMensagem("");

    if (!formularioValido) {
      setMensagem("Preencha os campos corretamente antes de cadastrar.");
      return;
    }

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
          {email !== "" && !emailValido && (
            <p className="validacao invalido">
              Digite um e-mail valido.
            </p>
          )}

          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
          />
          {mostrarValidacoesSenha && (
            <div className="validacoes">
              {!senhaTemTamanho && (
                <p className="validacao invalido">Minimo de 8 caracteres</p>
              )}
              {!senhaTemMaiuscula && (
                <p className="validacao invalido">
                  Pelo menos 1 letra maiuscula
                </p>
              )}
              {!senhaTemNumero && (
                <p className="validacao invalido">Pelo menos 1 numero</p>
              )}
              {!senhaTemEspecial && (
                <p className="validacao invalido">
                  Pelo menos 1 caractere especial: ! @ # $ % & * ?
                </p>
              )}
              {!senhaSemInvalidos && (
                <p className="validacao invalido">
                  Caracteres invalidos digitados: {caracteresInvalidos.join(" ")}
                </p>
              )}
            </div>
          )}

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
          {dataNascimento !== "" && !dataValida && (
            <p className="validacao invalido">
              A data deve estar entre hoje e 100 anos atras.
            </p>
          )}

          <button type="submit" disabled={!formularioValido}>
            Cadastrar
          </button>
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
