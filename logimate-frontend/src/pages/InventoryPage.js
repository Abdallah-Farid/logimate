import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { handleApiError } from '../utils/apiErrorHandler';
import { logError } from '../utils/logger';
import Button from '../components/Button';
import PageTitle from '../components/PageTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import CollapsibleSection from '../components/CollapsibleSection';
import PageTransition from '../components/PageTransition';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../utils/api';

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

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

function InventoryPage() {
  const { t } = useTranslation();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productId, setProductId] = useState('');
  const [historicalData, setHistoricalData] = useState('');
  const [forecast, setForecast] = useState(null);
  const [forecastError, setForecastError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unitPrice: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUserRole();
    fetchInventory();
  }, []);

  const fetchUserRole = async () => {
    try {
      const response = await api.get('/users/profile');
      setIsAdmin(response.data.role === 'admin');
    } catch (err) {
      logError(err, 'Failed to fetch user role:');
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await api.get('/inventory');
      setInventory(response.data);
    } catch (err) {
      logError(err, 'Failed to fetch inventory:');
      setError(handleApiError(err));
      toast.error('Failed to fetch inventory items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      await api.post('/inventory', {
        name: newItem.name,
        quantity: parseInt(newItem.quantity),
        unitPrice: parseFloat(newItem.unitPrice)
      });
      
      setSuccessMessage(t('Item added successfully!'));
      setNewItem({ name: '', quantity: '', unitPrice: '' });
      setIsAddModalOpen(false);
      fetchInventory();
      toast.success('Item added successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      logError(err, 'Failed to add item:');
      setError(handleApiError(err));
      toast.error('Failed to add item');
    }
  };

  const handleForecast = async (e) => {
    e.preventDefault();
    setForecastError('');
    try {
      const response = await api.post('/demand-forecast', {
        productId,
        historicalData: historicalData.split(',').map(Number),
      });
      setForecast(response.data);
    } catch (err) {
      logError(err, 'Failed to generate forecast:');
      setForecastError(handleApiError(err));
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm(t('Are you sure you want to delete this item?'))) {
      return;
    }

    try {
      await api.delete(`/inventory/${id}`);
      setInventory(inventory.filter(item => item.id !== id));
      setSuccessMessage(t('Item deleted successfully!'));
      toast.success('Item deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      logError(err, 'Failed to delete item:');
      setError(handleApiError(err));
      toast.error('Failed to delete item');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="p-4">
        <PageTitle 
          title={t('Inventory Dashboard')} 
          subtitle={t('Manage your inventory and generate demand forecasts')} 
        />

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg mx-4"
            >
              {error}
            </motion.div>
          )}

          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg mx-4"
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 gap-6 p-4">
          <CollapsibleSection title={t('Current Inventory')}>
            <div className="space-y-4">
              {isAdmin && (
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mb-4"
                >
                  {t('Add New Item')}
                </Button>
              )}

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Name')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Quantity')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Unit Price')}
                      </th>
                      {isAdmin && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('Actions')}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {inventory.map((item) => (
                        <motion.tr
                          key={item.id}
                          variants={listItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${item.unitPrice}
                          </td>
                          {isAdmin && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button
                                onClick={() => deleteItem(item.id)}
                                variant="danger"
                                size="sm"
                              >
                                {t('Delete')}
                              </Button>
                            </td>
                          )}
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </CollapsibleSection>

          {isAdmin && (
            <CollapsibleSection title={t('Demand Forecast')}>
              <form onSubmit={handleForecast} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('Product ID')}
                  </label>
                  <input
                    type="text"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('Historical Data (comma-separated)')}
                  </label>
                  <input
                    type="text"
                    value={historicalData}
                    onChange={(e) => setHistoricalData(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Button type="submit">
                  {t('Generate Forecast')}
                </Button>
              </form>

              {forecastError && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                  {forecastError}
                </div>
              )}

              {forecast && (
                <div className="mt-4">
                  <Line
                    data={{
                      labels: forecast.map((_, i) => `Period ${i + 1}`),
                      datasets: [
                        {
                          label: t('Forecast'),
                          data: forecast,
                          fill: true,
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: t('Demand Forecast'),
                        },
                      },
                    }}
                  />
                </div>
              )}
            </CollapsibleSection>
          )}
        </div>

        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={t('Add New Item')}
        >
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Name')}
              </label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Quantity')}
              </label>
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Unit Price')}
              </label>
              <input
                type="number"
                step="0.01"
                value={newItem.unitPrice}
                onChange={(e) => setNewItem({ ...newItem, unitPrice: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setIsAddModalOpen(false)}
                variant="secondary"
              >
                {t('Cancel')}
              </Button>
              <Button type="submit">
                {t('Add Item')}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageTransition>
  );
}

export default InventoryPage;
