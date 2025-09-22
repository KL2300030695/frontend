import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

// Wrapper to use navigate in class component
function withNavigation(Component) {
  return props => <Component {...props} navigate={useNavigate()} />;
}

class AdminDashboard extends Component {
  constructor() {
    super();
    this.state = {
      adminName: 'Admin User'
    };
  }

  handleAddDoctor = () => {
    this.props.navigate('/add-doctor');
  };

  handleBookAppointment = () => {
    this.props.navigate('/book-appointment');
  };

  handleViewAppointments = () => {
    this.props.navigate('/view-appointments');
  };

  handleViewMedicalRecords = () => {
    this.props.navigate('/medical-records');
  };

  render() {
    const { adminName } = this.state;
    return (
      <div className="admin-dashboard-bg">
        <main className="admin-main">
          <h1 className="welcome-title">Welcome, {adminName}</h1>

          <div className="admin-card">
            <div className="card-title">Quick Stats</div>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-icon">👨‍⚕</span>
                <span className="stat-number">25</span>
                <span className="stat-label">Total Doctors</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📅</span>
                <span className="stat-number">48</span>
                <span className="stat-label">Today's Appointments</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">👥</span>
                <span className="stat-number">150</span>
                <span className="stat-label">Total Patients</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📋</span>
                <span className="stat-number">320</span>
                <span className="stat-label">Medical Records</span>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="card-title">Doctors</div>
            <div>Add new doctors to the system.</div>
            <button className="records-btn" onClick={this.handleAddDoctor}>
              Add New Doctor
            </button>
          </div>

          <div className="admin-card">
            <div className="card-title">Appointments</div>
            <div>Book and manage patient appointments.</div>
            <div className="button-group">
              <button className="appointments-btn" onClick={this.handleBookAppointment}>
                Book Appointment
              </button>
              <button className="records-btn" onClick={this.handleViewAppointments}>
                View Appointments
              </button>
            </div>
          </div>

          <div className="admin-card">
            <div className="card-title">Medical Records</div>
            <div>Access and manage patient medical records.</div>
            <button className="records-btn" onClick={this.handleViewMedicalRecords}>
              View Medical Records
            </button>
          </div>
        </main>
      </div>
    );
  }
}

export default withNavigation(AdminDashboard);