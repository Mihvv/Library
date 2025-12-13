export default function BooksListPage() {
  return (
    <div className="container mt-4">
      <h1>Katalog książek</h1>

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Tytuł</th>
            <th>Autor</th>
            <th>ISBN</th>
            <th>Status</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Infinite Jest</td>
            <td>David Foster Wallace</td>
            <td>9780316920049</td>
            <td>
              <span className="badge bg-success">Dostępna</span>
            </td>
            <td>
              <button className="btn btn-sm btn-primary me-2">Szczegóły</button>
              <button className="btn btn-sm btn-warning">Edytuj</button>
            </td>
          </tr>
          <tr>
            <td>Aberrant Movements</td>
            <td>David Lapoujade</td>
            <td>9781584351955</td>
            <td>
              <span className="badge bg-secondary">Wypożyczona</span>
            </td>
            <td>
              <button className="btn btn-sm btn-primary me-2">Szczegóły</button>
              <button className="btn btn-sm btn-warning">Edytuj</button>
            </td>
          </tr>
        </tbody>
      </table>

      <nav>
        <ul className="pagination">
          <li className="page-item disabled">
            <button className="page-link">Poprzednia</button>
          </li>
          <li className="page-item active">
            <button className="page-link">1</button>
          </li>
          <li className="page-item">
            <button className="page-link">2</button>
          </li>
          <li className="page-item">
            <button className="page-link">Następna</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}