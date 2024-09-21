
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, DollarSign, Users, ShoppingCart } from 'lucide-react';

const data = [
  { name: 'Ene', ventas: 4000, visitas: 2400 },
  { name: 'Feb', ventas: 3000, visitas: 1398 },
  { name: 'Mar', ventas: 2000, visitas: 9800 },
  { name: 'Abr', ventas: 2780, visitas: 3908 },
  { name: 'May', ventas: 1890, visitas: 4800 },
  { name: 'Jun', ventas: 2390, visitas: 3800 },
];

const recentActivity = [
  { id: 1, action: 'Nueva venta', details: 'Producto A vendido', time: '5 minutos atrás' },
  { id: 2, action: 'Nuevo usuario', details: 'Juan Pérez se registró', time: '10 minutos atrás' },
  { id: 3, action: 'Actualización de stock', details: 'Producto B agotado', time: '1 hora atrás' },
];

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="summary-cards">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Ventas Totales</h2>
            <DollarSign className="card-icon" />
          </div>
          <div className="card-content">
            <div className="card-value">$45,231.89</div>
            <p className="card-subtext">+20.1% desde el mes pasado</p>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Nuevos Clientes</h2>
            <Users className="card-icon" />
          </div>
          <div className="card-content">
            <div className="card-value">+2350</div>
            <p className="card-subtext">+180.1% desde el mes pasado</p>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Productos Vendidos</h2>
            <ShoppingCart className="card-icon" />
          </div>
          <div className="card-content">
            <div className="card-value">+12,234</div>
            <p className="card-subtext">+19% desde el mes pasado</p>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Visitas Activas</h2>
            <Activity className="card-icon" />
          </div>
          <div className="card-content">
            <div className="card-value">+573</div>
            <p className="card-subtext">+201 desde la última hora</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="chart-container card">
          <h2 className="card-title">Ventas vs Visitas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventas" fill="#8884d8" />
              <Bar dataKey="visitas" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="activity-container card">
          <h2 className="card-title">Actividad Reciente</h2>
          <ul className="activity-list">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="activity-item">
                <div className="activity-action">{activity.action}</div>
                <div className="activity-details">{activity.details}</div>
                <div className="activity-time">{activity.time}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}