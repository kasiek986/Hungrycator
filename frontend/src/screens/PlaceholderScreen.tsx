interface PlaceholderScreenProps {
  title: string;
  story: string;
}

export function PlaceholderScreen({ title, story }: PlaceholderScreenProps) {
  return (
    <main className="screen" aria-labelledby="placeholder-title">
      <header className="screen__header">
        <h1 id="placeholder-title" className="screen__title">
          {title}
        </h1>
      </header>
      <div className="card empty">
        <h2 className="card-title">Ten ekran jest w przygotowaniu</h2>
        <p className="muted">
          Zostanie zrealizowany w historii {story}. Przejdź do zakładki
          „Posiłki”, żeby zaproponować danie i zagłosować.
        </p>
      </div>
    </main>
  );
}
