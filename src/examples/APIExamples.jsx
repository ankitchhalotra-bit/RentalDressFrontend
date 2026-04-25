import { useEffect, useState } from 'react';
import { useDressAPI } from './api/useDressAPI';

/**
 * Example: Complete Dress Shopping Flow
 * Shows how to use all useDressAPI methods
 */
export function ExampleDressShopComponent() {
  const [dresses, setDresses] = useState([]);
  const [selectedDress, setSelectedDress] = useState(null);
  const [availability, setAvailability] = useState(null);

  const {
    getAllDresses,
    getDressById,
    searchDresses,
    getDressesByOccasion,
    getDressesByPriceRange,
    checkAvailability,
    loading,
    error
  } = useDressAPI();

  // 1. Load all dresses on component mount
  useEffect(() => {
    const loadDresses = async () => {
      const allDresses = await getAllDresses();
      setDresses(allDresses || []);
    };
    loadDresses();
  }, []);

  // 2. Handle dress selection
  const handleSelectDress = async (dressId) => {
    const dress = await getDressById(dressId);
    setSelectedDress(dress);
  };

  // 3. Handle search
  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      const allDresses = await getAllDresses();
      setDresses(allDresses || []);
      return;
    }
    const results = await searchDresses(searchQuery);
    setDresses(results || []);
  };

  // 4. Handle occasion filter
  const handleOccasionFilter = async (occasion) => {
    const filtered = await getDressesByOccasion(occasion);
    setDresses(filtered || []);
  };

  // 5. Handle price filter
  const handlePriceFilter = async (minPrice, maxPrice) => {
    const filtered = await getDressesByPriceRange(minPrice, maxPrice);
    setDresses(filtered || []);
  };

  // 6. Check availability before booking
  const handleCheckAvailability = async (dressId, requiredQuantity = 1) => {
    const avail = await checkAvailability(dressId, requiredQuantity);
    setAvailability(avail);
  };

  return (
    <div className="dress-shop">
      {loading && <div>Loading...</div>}
      {error && <div className="error">Error: {error}</div>}

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search dresses..."
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="filters">
        <button onClick={() => handleOccasionFilter('Wedding')}>
          Wedding
        </button>
        <button onClick={() => handleOccasionFilter('Party')}>
          Party
        </button>
        <button onClick={() => handlePriceFilter(1000, 5000)}>
          Budget Friendly
        </button>
      </div>

      {/* Dresses Grid */}
      <div className="dresses-grid">
        {dresses.map(dress => (
          <div
            key={dress._id}
            className="dress-card"
            onClick={() => handleSelectDress(dress._id)}
          >
            <img src={dress.imageUrls?.[0]} alt={dress.name} />
            <h3>{dress.name}</h3>
            <p>₹{dress.rentalPricePerDay}/day</p>
            <button onClick={() => handleCheckAvailability(dress._id)}>
              Check Availability
            </button>
          </div>
        ))}
      </div>

      {/* Selected Dress Details */}
      {selectedDress && (
        <div className="dress-details">
          <h2>{selectedDress.name}</h2>
          <p>Occasion: {selectedDress.occasion}</p>
          <p>Price: ₹{selectedDress.rentalPricePerDay}/day</p>
          <p>Deposit: ₹{selectedDress.depositAmount}</p>
          <p>Available: {selectedDress.availableStock}</p>
        </div>
      )}

      {/* Availability Info */}
      {availability && (
        <div className="availability-info">
          <h3>{availability.dressName}</h3>
          <p>
            Available: {availability.isAvailable ? '✅ Yes' : '❌ No'}
          </p>
          <p>Stock: {availability.availableStock}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example: Admin Dashboard Statistics View
 */
export function ExampleAdminStatsComponent() {
  const [stats, setStats] = useState(null);
  const { getDressStatistics, loading } = useDressAPI();

  useEffect(() => {
    const loadStats = async () => {
      const statistics = await getDressStatistics();
      setStats(statistics);
    };
    loadStats();
  }, []);

  if (loading) return <div>Loading statistics...</div>;

  return (
    <div className="admin-stats">
      <h1>Dress Analytics</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Dresses</h3>
          <p className="stat-value">{stats?.totalDresses}</p>
        </div>

        <div className="stat-card">
          <h3>Active Dresses</h3>
          <p className="stat-value">{stats?.activeDresses}</p>
        </div>

        <div className="stat-card">
          <h3>Total Stock</h3>
          <p className="stat-value">{stats?.totalStock}</p>
        </div>

        <div className="stat-card">
          <h3>Available Stock</h3>
          <p className="stat-value">{stats?.availableStock}</p>
        </div>

        <div className="stat-card">
          <h3>Booked Stock</h3>
          <p className="stat-value">{stats?.bookedStock}</p>
        </div>

        <div className="stat-card">
          <h3>Avg Price</h3>
          <p className="stat-value">₹{stats?.averageRentalPrice}</p>
        </div>
      </div>

      <div className="dresses-by-occasion">
        <h2>Dresses by Occasion</h2>
        <ul>
          {Object.entries(stats?.dressesByOccasion || {}).map(([occasion, count]) => (
            <li key={occasion}>
              {occasion}: {count} dresses
            </li>
          ))}
        </ul>
      </div>

      <div className="price-analysis">
        <h2>Price Analysis</h2>
        {stats?.mostExpensive && (
          <div>
            <p>Most Expensive: {stats.mostExpensive.name} - ₹{stats.mostExpensive.price}</p>
          </div>
        )}
        {stats?.cheapest && (
          <div>
            <p>Cheapest: {stats.cheapest.name} - ₹{stats.cheapest.price}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Example: Stock Inventory Management
 */
export function ExampleStockManagementComponent() {
  const [stockSummary, setStockSummary] = useState(null);
  const { getStockSummary, loading } = useDressAPI();

  useEffect(() => {
    const loadStock = async () => {
      const summary = await getStockSummary();
      setStockSummary(summary);
    };
    loadStock();
  }, []);

  if (loading) return <div>Loading stock information...</div>;

  return (
    <div className="stock-management">
      <h1>Inventory Management</h1>

      <div className="stock-overview">
        <div className="overview-item">
          <label>Total Active Dresses</label>
          <span>{stockSummary?.totalActiveDresses}</span>
        </div>
        <div className="overview-item">
          <label>Total Stock</label>
          <span>{stockSummary?.totalStock}</span>
        </div>
        <div className="overview-item">
          <label>Available Stock</label>
          <span className="highlight-green">{stockSummary?.totalAvailableStock}</span>
        </div>
      </div>

      {/* Low Stock Alert */}
      {stockSummary?.lowStockCount > 0 && (
        <div className="alert-section low-stock">
          <h2>⚠️ Low Stock Items ({stockSummary.lowStockCount})</h2>
          <table>
            <thead>
              <tr>
                <th>Dress Name</th>
                <th>Available</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {stockSummary.lowStockItems?.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.availableStock}</td>
                  <td>{item.totalStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Out of Stock Alert */}
      {stockSummary?.outOfStockCount > 0 && (
        <div className="alert-section out-of-stock">
          <h2>🚫 Out of Stock Items ({stockSummary.outOfStockCount})</h2>
          <table>
            <thead>
              <tr>
                <th>Dress Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stockSummary.outOfStockItems?.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td className="out-of-stock-status">OUT OF STOCK</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/**
 * Example: Pagination in Admin Panel
 */
export function ExamplePaginationComponent() {
  const [page, setPage] = useState(0);
  const [dresses, setDresses] = useState(null);
  const { getDressesWithPagination, loading } = useDressAPI();

  useEffect(() => {
    const loadDresses = async () => {
      const result = await getDressesWithPagination(page, 10, 'Wedding', null);
      setDresses(result);
    };
    loadDresses();
  }, [page]);

  return (
    <div className="pagination-example">
      <h1>Wedding Dresses - Paginated View</h1>

      {loading && <div>Loading...</div>}

      {dresses && (
        <>
          <div className="dresses-list">
            {dresses.content?.map(dress => (
              <div key={dress._id} className="dress-item">
                <h3>{dress.name}</h3>
                <p>₹{dress.rentalPricePerDay}/day</p>
              </div>
            ))}
          </div>

          <div className="pagination-controls">
            <button
              disabled={!dresses.hasPrevious}
              onClick={() => setPage(page - 1)}
            >
              ← Previous
            </button>

            <span>
              Page {dresses.currentPage + 1} of {dresses.totalPages}
            </span>

            <button
              disabled={!dresses.hasNext}
              onClick={() => setPage(page + 1)}
            >
              Next →
            </button>
          </div>

          <div className="page-info">
            Showing {dresses.content?.length} of {dresses.totalElements} dresses
          </div>
        </>
      )}
    </div>
  );
}

export default ExampleDressShopComponent;

