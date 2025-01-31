import React from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsA,
} from '@coreui/react';
import { CChartBar, CChartLine } from '@coreui/react-chartjs'; // Importa desde react-chartjs
import { cilPeople, cilChartPie, cilArrowThickTop, cilArrowThickBottom } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  // Datos de ejemplo para gráficos
  const barChartData = [
    { name: 'Enero', Ventas: 4000 },
    { name: 'Febrero', Ventas: 3000 },
    { name: 'Marzo', Ventas: 2000 },
    { name: 'Abril', Ventas: 2780 },
    { name: 'Mayo', Ventas: 1890 },
    { name: 'Junio', Ventas: 2390 },
  ];

  const lineChartData = [
    { name: 'Lunes', Visitas: 2400 },
    { name: 'Martes', Visitas: 1398 },
    { name: 'Miércoles', Visitas: 9800 },
    { name: 'Jueves', Visitas: 3908 },
    { name: 'Viernes', Visitas: 4800 },
    { name: 'Sábado', Visitas: 3800 },
    { name: 'Domingo', Visitas: 4300 },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <p></p>

      {/* Widgets de estadísticas */}
      <CRow>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            color="primary"
            value="89.9%"
            title="Satisfacción del cliente"
            action={
              <CIcon icon={cilPeople} height={36} className="my-4 text-white" />
            }
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            color="info"
            value="12.4K"
            title="Ventas mensuales"
            action={
              <CIcon icon={cilChartPie} height={36} className="my-4 text-white" />
            }
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            color="warning"
            value="2.49%"
            title="Tasa de conversión"
            action={
              <CIcon icon={cilArrowThickTop} height={36} className="my-4 text-white" />
            }
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            color="danger"
            value="44K"
            title="Usuarios activos"
            action={
              <CIcon icon={cilArrowThickBottom} height={36} className="my-4 text-white" />
            }
          />
        </CCol>
      </CRow>

      {/* Gráficos */}
      <CRow>
        <CCol md={6}>
          <CCard>
            <CCardHeader>Sabores más consumidos</CCardHeader>
            <CCardBody>
              <CChartBar
                data={barChartData}
                labels={['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio']}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard>
            <CCardHeader>Ventas Semanales</CCardHeader>
            <CCardBody>
              <CChartLine
                data={lineChartData}
                labels={['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Gráfico de Recharts */}
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Ventas Mensuales </CCardHeader>
            <CCardBody>
              <BarChart
                width={800}
                height={300}
                data={barChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Ventas" fill="#8884d8" />
              </BarChart>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Dashboard;