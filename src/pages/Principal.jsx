import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";

function Principal() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const pararObservacao = onAuthStateChanged(auth, async (usuarioLogado) => {
      if (!usuarioLogado) {
        navigate("/login");
        return;
      }

      const documento = await getDoc(doc(db, "usuarios", usuarioLogado.uid));

      if (documento.exists()) {
        setUsuario(documento.data());
      }

      setCarregando(false);
    });

    return () => pararObservacao();
  }, [navigate]);

  async function sair() {
    await signOut(auth);
    navigate("/login");
  }

  if (carregando) {
    return (
      <main className="pagina">
        <section className="caixa">
          <p>Carregando...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="pagina">
      <section className="caixa">
        <h1>Pagina Principal</h1>

        {usuario ? (
          <div>
            <p>
              <strong>Nome:</strong> {usuario.nome}
            </p>
            <p>
              <strong>Sobrenome:</strong> {usuario.sobrenome}
            </p>
            <p>
              <strong>Data de nascimento:</strong> {usuario.dataNascimento}
            </p>
          </div>
        ) : (
          <p>Dados do usuario nao encontrados.</p>
        )}

        <button type="button" onClick={sair}>
          Sair
        </button>
      </section>
    </main>
  );
}

export default Principal;
