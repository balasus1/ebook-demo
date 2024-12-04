import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const books = [
  {
    id: 1,
    title: 'Alice in Wonderland',
    author: 'Lewis Carroll',
    image: 'https://picsum.photos/150?random=1',
    url: 'https://react-reader.metabits.no/files/alice.epub',
  },
  {
    id: 2,
    title: 'Book 2',
    author: 'Author 2',
    image: 'https://picsum.photos/150?random=2',
    url: 'https://react-reader.metabits.no/files/alice.epub',
  },
  {
    id: 3,
    title: 'Book 3',
    author: 'Author 3',
    image: 'https://picsum.photos/150?random=3',
    url: 'https://react-reader.metabits.no/files/alice.epub',
  },
  {
    id: 4,
    title: 'Book Four',
    author: 'Author Four',
    image: 'https://picsum.photos/150?random=4',
    url: '/path-to-epub2.epub',
  },
];

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Book Library</h1>
      <div className="book-list">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <img src={book.image} alt={`${book.title} cover`} />
            <h2>{book.title}</h2>
            <p>{book.author}</p>
            <Link to={`/reader?url=${encodeURIComponent(book.url)}`}>
              <button>Read Now</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};


// const HomePage = () => {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const response = await fetch('https://your-api.com/books'); // Replace with your API endpoint
//         if (!response.ok) {
//           throw new Error('Failed to fetch books');
//         }
//         const data = await response.json();
//         setBooks(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="home-page">
//       <h1>Book Library</h1>
//       <div className="book-list">
//         {books.map((book) => (
//           <div key={book.id} className="book-card">
//             <img src={book.image} alt={`${book.title} cover`} />
//             <h2>{book.title}</h2>
//             <p>{book.author}</p>
//             <Link to={`/reader?url=${encodeURIComponent(book.url)}`}>
//               <button>Read Now</button>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };


export default HomePage;
