import React, { Component } from 'react';
import { Apicall } from './api';
import './MyAppointments.css';

class MyAppointments extends Component {
  state = {
    appointments: [],
    loading: false,
    error: null,
    showEditModal: false,
    editAppointment: null,
    editForm: {
      appointmentDate: '',
      appointmentTime: '',
      department: '',
      diseases: ''
    }
  };

  componentDidMount() {
    this.fetchAppointments();
  }

  fetchAppointments = () => {
    this.setState({ loading: true, error: null });
    Apicall("GET", "http://localhost:8057/appointments/list", "", (res) => {
      this.setState({ loading: false });
      if (res) {
        try {
          const data = JSON.parse(res);
          if (Array.isArray(data)) {
            this.setState({ appointments: data });
          } else {
            this.setState({ error: "Invalid appointment data format" });
          }
        } catch (e) {
          this.setState({ error: "Error parsing appointment data" });
        }
      } else {
        this.setState({ error: "Error fetching appointments" });
      }
    });
  };

  handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    this.setState({ loading: true, error: null });
    Apicall("DELETE", `http://localhost:8057/appointments/delete/${id}`, "", (res) => {
      this.setState({ loading: false });
      if (res) {
        try {
          const data = JSON.parse(res);
          if (data.status === "success") {
            this.fetchAppointments();
          } else {
            this.setState({ error: data.message || "Failed to delete appointment." });
          }
        } catch (e) {
          if (res.toLowerCase().includes("success") || res.startsWith("200::")) {
            this.fetchAppointments();
          } else {
            this.setState({ error: res || "Failed to delete appointment." });
          }
        }
      } else {
        this.setState({ error: "Error deleting appointment." });
      }
    });
  };

  handleEdit = (appointment) => {
    this.setState({
      showEditModal: true,
      editAppointment: appointment,
      editForm: {
        appointmentDate: appointment.appointmentDate.split('T')[0],
        appointmentTime: appointment.appointmentTime,
        department: appointment.department,
        diseases: appointment.diseases || ''
      }
    });
  };

  handleEditChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      editForm: {
        ...prevState.editForm,
        [name]: value
      }
    }));
  };

  handleEditSubmit = (e) => {
    e.preventDefault();
    const { editAppointment, editForm } = this.state;
    if (!editForm.appointmentDate || !editForm.appointmentTime || !editForm.department) {
      this.setState({ error: "Please fill in all required fields." });
      return;
    }
    this.setState({ loading: true, error: null });
    const updateData = {
      ...editAppointment,
      ...editForm,
      appointmentDate: new Date(editForm.appointmentDate).toISOString().split('T')[0]
    };
    Apicall("PUT", `http://localhost:8057/appointments/update/${editAppointment.id}`, JSON.stringify(updateData), (res) => {
      this.setState({ loading: false });
      if (res) {
        try {
          const data = JSON.parse(res);
          if (data.status === "success") {
            this.setState({ showEditModal: false, editAppointment: null });
            this.fetchAppointments();
          } else {
            this.setState({ error: data.message || "Failed to update appointment." });
          }
        } catch (e) {
          this.setState({ error: "Error processing server response." });
        }
      } else {
        this.setState({ error: "Error updating appointment." });
      }
    });
  };

  closeEditModal = () => {
    this.setState({ showEditModal: false, editAppointment: null });
  };

  render() {
    const { appointments, loading, error, showEditModal, editForm } = this.state;
    return (
      <div className="appointments-container">
        <h2>All Appointments</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <ul>
            {appointments.length === 0 ? (
              <li>No appointments found.</li>
            ) : (
              appointments.map(app => (
                <li key={app.id}>
                  <strong>{app.fullName}</strong> - {app.appointmentDate} at {app.appointmentTime} ({app.department})
                  <div style={{marginTop: '0.5rem'}}>
                    <button style={{marginRight: '0.5rem'}} onClick={() => this.handleEdit(app)}>Edit</button>
                    <button onClick={() => this.handleDelete(app.id)}>Delete</button>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Edit Appointment</h3>
              <form onSubmit={this.handleEditSubmit}>
                <div className="form-group">
                  <label>Date *</label>
                  <input type="date" name="appointmentDate" value={editForm.appointmentDate} onChange={this.handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Time *</label>
                  <input type="time" name="appointmentTime" value={editForm.appointmentTime} onChange={this.handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <input type="text" name="department" value={editForm.department} onChange={this.handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Medical Condition</label>
                  <input type="text" name="diseases" value={editForm.diseases} onChange={this.handleEditChange} />
                </div>
                <div style={{marginTop: '1rem', display: 'flex', gap: '1rem'}}>
                  <button type="submit">Save</button>
                  <button type="button" onClick={this.closeEditModal}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MyAppointments;