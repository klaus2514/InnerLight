// src/pages/SelfHelp.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Sparkles, BookOpen, Search } from "lucide-react";
import AppWrapper from "../components/AppWrapper";
import "../styles/selfHelp.css";

export default function SelfHelp() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await axios.get("https://openlibrary.org/search.json", {
        params: { q: query },
      });
      setBooks(Array.isArray(res.data?.docs) ? res.data.docs.slice(0, 10) : []);
    } catch (err) {
      console.error("Search failed", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Anxiety Relief",
    "Mindfulness",
    "Overthinking",
    "Self-love",
    "Productivity",
  ];

  return (
    <AppWrapper mood="calm">
      <div className="library-container">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold flex items-center justify-center gap-2 text-green-700">
            <BookOpen size={28} />
            Self-Help Library
          </h1>
          <p className="text-gray-600 mt-2">
            Discover free mental wellness books & guides 💡
          </p>
        </div>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search topics like anxiety, focus, gratitude..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSearch} disabled={loading}>
            <Search size={18} className="mr-1" />
            Search
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Try these topics:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setQuery(topic);
                  handleSearch();
                }}
                className="suggestion-btn"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <p className="text-center text-sm text-gray-500">Loading...</p>
        )}

        {searched && !loading && books.length === 0 && (
          <p className="text-center text-gray-500">
            No books found for “{query}”
          </p>
        )}

        <div className="space-y-4 mt-4">
          {books.map((book, idx) => (
            <div
              key={idx}
              className="book-card"
            >
              <h3 className="font-semibold text-lg">
                {book.title}{" "}
                {book.first_publish_year && (
                  <span className="text-sm text-gray-500 ml-2">
                    ({book.first_publish_year})
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600">
                by {book.author_name?.join(", ") || "Unknown Author"}
              </p>
              <a
                href={`https://openlibrary.org${book.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 text-sm underline mt-2 inline-block"
              >
                View on OpenLibrary
              </a>
            </div>
          ))}
        </div>
      </div>
    </AppWrapper>
  );
}
