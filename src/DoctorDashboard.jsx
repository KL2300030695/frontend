import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

// Wrapper to use navigate in class component
function withNavigation(Component) {
  return props => <Component {...props} navigate={useNavigate()} />;
}

class DoctorDashboard extends Component {
  constructor() {
    super();
    this.state = {
      doctorName: 'Dr. John Smith'
    };
  }

  handleViewAppointments = () => {
    this.props.navigate('/view-appointments');
  };

  handleViewMedicalRecords = () => {
    this.props.navigate('/medical-records');
  };

  render() {
    const { doctorName } = this.state;
    return (
      <div className="admin-dashboard-bg">
        <main className="admin-main">
          <h1 className="welcome-title">Welcome, {doctorName}</h1>

          <div className="admin-card">
            <div className="card-title">Quick Stats</div>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-icon">👥</span>
                <span className="stat-number">32</span>
                <span className="stat-label">My Patients</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📅</span>
                <span className="stat-number">8</span>
                <span className="stat-label">Today's Appointments</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📋</span>
                <span className="stat-number">21</span>
                <span className="stat-label">Medical Records</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">💊</span>
                <span className="stat-number">5</span>
                <span className="stat-label">Active Prescriptions</span>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="card-title">Appointments</div>
            <div>View and manage your appointments.</div>
            <div className="button-group">
              <button className="appointments-btn" onClick={this.handleViewAppointments}>
                View Appointments
              </button>
            </div>
          </div>

          <div className="admin-card">
            <div className="card-title">Medical Records</div>
            <div>Access and update patient medical records.</div>
            <button className="records-btn" onClick={this.handleViewMedicalRecords}>
              View Medical Records
            </button>
          </div>
        </main>
      </div>
    );
  }
}

export default withNavigation(DoctorDashboard);