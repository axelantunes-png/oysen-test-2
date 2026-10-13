/** En attendant les données d'une page du CMS (premier chargement seulement). */
export function ChargementCms() {
  return <p className="cms-texte">Chargement…</p>
}

/** Les données d'une page du CMS n'ont pas pu être chargées. */
export function ErreurCms() {
  return (
    <div className="cms-page">
      <p className="cms-alerte">
        Impossible de charger les données. Vérifiez votre connexion, puis
        rechargez la page.
      </p>
    </div>
  )
}
