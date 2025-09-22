import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import './PatientDashboard.css'; // Using our new dedicated CSS file

// Wrapper to use navigate in class component
function withNavigation(Component) {
  return props => <Component {...props} navigate={useNavigate()} />;
}

class PatientDashboard extends Component {
  constructor() {
    super();
    this.state = {
      patientName: 'Patient User'
    };
  }

  handleBookAppointment = () => {
    this.props.navigate('/book-appointment');
  };

  handleViewAppointments = () => {
    this.props.navigate('/my-appointments');
  };

  handleViewMedicalRecords = () => {
    this.props.navigate('/medical-records');
  };

  render() {
    const { patientName } = this.state;
    return (
      <div className="admin-dashboard-bg">
        <main className="admin-main">
          <h1 className="welcome-title">Welcome, {patientName}</h1>

          <div className="admin-card">
            <div className="card-title">Quick Stats</div>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-icon">👨‍⚕</span>
                <span className="stat-number">5</span>
                <span className="stat-label">My Doctors</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📅</span>
                <span className="stat-number">3</span>
                <span className="stat-label">Upcoming Appointments</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📋</span>
                <span className="stat-number">12</span>
                <span className="stat-label">Medical Records</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">💊</span>
                <span className="stat-number">4</span>
                <span className="stat-label">Active Prescriptions</span>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="card-title">Appointments</div>
            <div>Book and manage your appointments.</div>
            <div className="button-group">
              <button className="appointments-btn" onClick={this.handleBookAppointment}>
                Book Appointment
              </button>
              <button className="records-btn" onClick={this.handleViewAppointments}>
                View My Appointments
              </button>
            </div>
          </div>

          <div className="admin-card">
            <div className="card-title">Medical Records</div>
            <div>Access your medical history and records.</div>
            <button className="records-btn" onClick={this.handleViewMedicalRecords}>
              View Medical Records
            </button>
          </div>

          <div className="admin-card">
            <div className="card-title">Health Summary</div>
            <div>Your recent health status and updates.</div>
            <div className="health-summary">
              <div className="summary-item">
                <span className="summary-label">Last Checkup:</span>
                <span className="summary-value">15 days ago</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Next Appointment:</span>
                <span className="summary-value">In 3 days</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Health Status:</span>
                <span className="summary-value good">Good</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default withNavigation(PatientDashboard);