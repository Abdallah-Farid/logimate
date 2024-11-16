import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0, unitPrice: 0 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Forecasting states
  const [productId, setProductId] = useState('');
  const [historicalData, setHistoricalData] = useState('');
  const [forecast, setForecast] = useState(null);
  const [forecastError, setForecastError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await axios.get(`${config.apiUrl}/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      // Convert unitPrice to number for each item
      const formattedInventory = response.data.map(item => ({
        ...item,
        unitPrice: parseFloat(item.unitPrice) || 0
      }));
      setInventory(formattedInventory);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch inventory');
      }
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${config.apiUrl}/inventory`, newItem, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setSuccess('Item added successfully!');
      setError('');
      setNewItem({ name: '', quantity: 0, unitPrice: 0 });
      fetchInventory();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
      setSuccess('');
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.apiUrl}/inventory/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setSuccess('Item deleted successfully!');
      setError('');
      fetchInventory();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete item');
      setSuccess('');
    }
  };

  const handleForecast = async (e) => {
    e.preventDefault();
    setForecastError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${config.apiUrl}/demand-forecast`,
        {
          productId,
          historicalData: historicalData.split(',').map(Number),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setForecast(response.data);
    } catch (err) {
      setForecastError(err.response?.data?.message || 'Failed to fetch forecast');
    }
  };

  const selectItemForForecast = (item) => {
    setSelectedItem(item);
    setProductId(item.id);
    // Set some mock historical data based on current quantity
    const mockData = Array(7)
      .fill(item.quantity)
      .map(q => Math.round(q * (0.8 + Math.random() * 0.4)));
    setHistoricalData(mockData.join(','));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Inventory Dashboard</h1>
        
        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-4 mb-6 text-green-700 bg-green-100 rounded-lg" role="alert">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Item</h2>
          <form onSubmit={addItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter item name"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter quantity"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newItem.unitPrice}
                  onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter unit price"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Add Item
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Inventory Items</h2>
          </div>
          
          {inventory.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No items in inventory. Add your first item above.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {inventory.map((item) => (
                <li key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <div className="text-sm text-gray-500">
                        <p className="mb-1"><span className="font-medium">ID:</span> {item.id}</p>
                        <span className="mr-4">Quantity: {item.quantity}</span>
                        <span>Unit Price: ${typeof item.unitPrice === 'number' ? item.unitPrice.toFixed(2) : '0.00'}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => selectItemForForecast(item)}
                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      >
                        Forecast
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Demand Forecasting Section */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Demand Forecasting</h2>
          <form onSubmit={handleForecast} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product ID</label>
                <input
                  type="text"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                  readOnly={!!selectedItem}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Historical Data (comma-separated)</label>
                <input
                  type="text"
                  value={historicalData}
                  onChange={(e) => setHistoricalData(e.target.value)}
                  required
                  placeholder="e.g., 120,135,150"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Generate Forecast
            </button>
          </form>

          {forecastError && (
            <div className="p-2 mb-4 text-red-500 bg-red-100 rounded">{forecastError}</div>
          )}

          {forecast && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Forecast Results</h3>
              <div className="h-80">
                <Line
                  data={{
                    labels: forecast.days,
                    datasets: [
                      {
                        label: `Forecast for Product ${forecast.productId}`,
                        data: forecast.forecast,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true, position: 'top' },
                      tooltip: {
                        callbacks: {
                          label: (context) => `Forecast: ${context.parsed.y} units`,
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Quantity',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InventoryPage;
