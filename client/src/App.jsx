import { useState, useEffect } from "react";
import Card from "./Card.jsx";

function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // NOVO
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const [randomCard, setRandomCard] = useState(null);
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/cartas")
      .then((res) => {
        // NOVO: um 404 ou 500 não faz o fetch falhar, por isso verificamos nós
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setCards(data))
      .catch((err) => setError(err.message)) // NOVO
      .finally(() => setLoading(false));
  }, []);

  let visible = cards
    .filter((card) => filter === "Todas" || card.type === filter)
    .filter((card) => card.name.toLowerCase().includes(search.toLowerCase()));

  if (sorted) {
    visible = [...visible].sort((a, b) => b.attack - a.attack);
  }

  function pickRandom() {
    setRandomCard(cards[Math.floor(Math.random() * cards.length)]);
  }

  return (
    <main>
      <h1>A minha coleção</h1>

      {/* NOVO: com erro, não mostramos "Tenho 0 cartas" */}
      {!error && (
        <p>
          Tenho {cards.length} cartas · a mostrar {visible.length}
        </p>
      )}

      <div>
        <button onClick={() => setFilter("Todas")}>Todas</button>
        <button onClick={() => setFilter("Criatura")}>Só criaturas</button>
        <button onClick={() => setFilter("Feitiço")}>Só feitiços</button>
        <button onClick={() => setSorted(!sorted)}>
          {sorted ? "Ordem original" : "Ordenar por ataque"}
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Procurar pelo nome…"
      />

      {loading ? (
        <p>A carregar…</p>
      ) : error ? (
        <p>Não foi possível carregar as cartas: {error}</p> // NOVO
      ) : visible.length === 0 ? (
        <p>Nenhuma carta corresponde.</p>
      ) : (
        <ul>
          {visible.map((card) => (
            <Card key={card.name} {...card} />
          ))}
        </ul>
      )}

      <h2>Carta à sorte</h2>
      <button onClick={pickRandom}>Escolher outra</button>
      {randomCard && (
        <p>
          <b>{randomCard.name}</b> — {randomCard.type} · ataque {randomCard.attack} ·
          defesa {randomCard.defense}
        </p>
      )}
    </main>
  );
}

export default App;