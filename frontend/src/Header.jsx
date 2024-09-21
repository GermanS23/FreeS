
import { FaSearch } from 'react-icons/fa';

function Header() {
  return (
    <header className="header">
      <div className="search-bar">
        <FaSearch />
        <input type="text" placeholder="Buscar..." />
      </div>
    </header>
  );
}

export default Header;