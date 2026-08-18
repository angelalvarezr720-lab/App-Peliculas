import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  const [busqueda, setBusqueda] = useState("Avengers");
  const [peliculasDisponibles, setPeliculasDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const claveApiKey = "d1e62906";

  const obtenerPelis = async () => {
    if (!busqueda.trim()) {
      setError("Por favor, ingresa el nombre de una película.");
      setPeliculasDisponibles([]);
      return;
    }

    setCargando(true);
    setError(null);
    try {
      const respuesta = await fetch(
        `https://www.omdbapi.com/?apikey=${claveApiKey}&s=${busqueda}`,
      );
      const data = await respuesta.json();
      console.log(data);

      if (data.Response === "True") {
        setPeliculasDisponibles(data.Search);
      } else {
        setPeliculasDisponibles([]);
        setError("La película no está disponible o no existe.");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerPelis(busqueda);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    obtenerPelis(busqueda);
  };



  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit} className="d-flex gap-2 mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar película..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button type="submit" className="btn btn-outline-primary">
          Buscar
        </button>
      </form>

      {error && (
        <div className="alert alert-primary text-center" role="alert">
          {error}
        </div>
      )}

      {cargando && (
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Buscando...</span>
        </div>
      )}

      {!cargando && (
        <div className="row">
          {peliculasDisponibles.map((pelicula) => (
            <div key={pelicula.imdbID} className="col-md-3 mb-3">
              <div className="card h-100 shadow-sm">
                <img
                  src={
                    pelicula.Poster !== "N/A"
                      ? pelicula.Poster
                      : "https://via.placeholder.com/300x450"
                  }
                  className="card-img-top"
                  alt={pelicula.Title}
                />
                <div className="card-body">
                  <h5 className="card-title">{pelicula.Title}</h5>
                  <p className="card-text text-muted">{pelicula.Year}</p>
                  <a href="#" className="btn btn-outline-primary">
                    Go somewhere
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
