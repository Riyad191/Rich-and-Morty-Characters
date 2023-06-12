import { useEffect, useState } from "react";
import axios from "axios";
import styles from "@/styles/Home.module.css";

interface Character {
  id: number;
  name: string;
  image: string;
}

const Home: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://rickandmortyapi.com/api/character?page=${currentPage}`
        );
        setCharacters(response.data.results);
        setTotalPages(response.data.info.pages);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const renderPagination = () => {
    const visiblePages = 5;
    const totalPagesArray = Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
    let pagesToDisplay = [];

    if (totalPages <= visiblePages) {
      pagesToDisplay = totalPagesArray;
    } else {
      const minPage = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
      const maxPage = Math.min(minPage + visiblePages - 1, totalPages);

      pagesToDisplay = totalPagesArray.slice(minPage - 1, maxPage);
    }

    return (
      <>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Prev
        </button>
        {pagesToDisplay.map((page) => (
          <button
            key={page}
            className={currentPage === page ? styles.activePage : ""}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <h1>Rich and Morty Characters</h1>
      <div className={styles.characterList}>
        {characters.map((character) => {
          const { id, image, name } = character;
          return (
            <div key={id} className={styles.characterItem}>
              <img src={image} alt={name} />
              <h2>{name}</h2>
            </div>
          );
        })}
      </div>
      <div className={styles.pagination}>{renderPagination()}</div>
    </div>
  );
};

export default Home;
