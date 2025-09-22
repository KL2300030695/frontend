import React, { Component } from 'react';
import './AddDoctor.css';
import { Apicall } from './api';

const DEPARTMENTS = [
  'General Medicine',
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics'
];

class AddDoctor extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      fullname: '',
      email: '',
      specialization: '',
      phone: '',
      address: '',
      doctorsList: [],
      department: '',
      experience: '',
      status: 'Available',
      loading: false,
      error: null,
      success: false
    };
  }

  componentDidMount() {
    this.fetchDoctors();
  }

  fetchDoctors = () => {
    this.setState({ loading: true, error: null });
    Apicall("GET", "http://localhost:8057/doctors/list", "", (res) => {
      this.setState({ loading: false });
      
      if (!res) {
        this.setState({ 
          error: "Server is not responding. Please check if the backend server is running."
        });
        return;
      }

      // Check for 500 error
      if (res.includes("500::")) {
        const [_, message] = res.split("::");
        this.setState({ 
          error: `Server Error: ${message || "Internal server error occurred. Please try again later."}`
        });
        return;
      }

      try {
        const data = JSON.parse(res);
        if (Array.isArray(data)) {
          this.setState({ doctorsList: data });
        } else {
          this.setState({ 
            error: "Invalid data format received from server. Please contact support."
          });
        }
      } catch (e) {
        console.error("Error processing doctors data:", e);
        this.setState({ 
          error: "Error processing server response. Please try again later."
        });
      }
    });
  };

  loadInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  validateForm = () => {
    const { fullname, email, phone, department, specialization, experience, address } = this.state;

    if (!fullname || !email || !phone || !department || !specialization || !experience || !address) {
      return "Please fill in all required fields.";
    }

    if (!/^\d{10}$/.test(phone)) {
      return "Phone number must be 10 digits.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    // Experience validation
    const expNum = parseInt(experience, 10);
    if (isNaN(expNum) || expNum < 0 || expNum > 50) {
      return "Please enter a valid experience in years (0-50).";
    }

    return null;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const error = this.validateForm();
    if (error) {
      this.setState({ error });
      return;
    }

    const {
      fullname, email, phone, department,
      specialization, experience, status, address
    } = this.state;

    // Format data to match server's Doctor model
    const doctorData = {
      fullname: fullname.trim(),
      email: email.trim(),
      phone: phone.trim(),
      department: department.trim(),
      specialization: specialization.trim(),
      experience: parseInt(experience, 10),
      status: status === 'Available' ? 'AVAILABLE' : 'NOT_AVAILABLE',
      address: address.trim()
    };

    console.log("Sending doctor data:", doctorData);

    this.setState({ loading: true, error: null });

    fetch("http://localhost:8057/doctors/add", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(doctorData)
    })
    .then(response => {
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(text => {
      console.log("Raw response:", text);
      this.setState({ loading: false });

      try {
        // Try to parse as JSON first
        const response = JSON.parse(text);
        if (response.status === "success" || response.message?.toLowerCase().includes("success")) {
          this.setState({
            success: true,
            fullname: '',
            email: '',
            phone: '',
            department: '',
            specialization: '',
            experience: '',
            status: 'Available',
            address: '',
            error: null
          });
          this.fetchDoctors();
        } else {
          this.setState({ 
            error: response.message || "Failed to add doctor. Please try again."
          });
        }
      } catch (e) {
        // If not JSON, check for success message in text
        if (text.toLowerCase().includes("success")) {
          this.setState({
            success: true,
            fullname: '',
            email: '',
            phone: '',
            department: '',
            specialization: '',
            experience: '',
            status: 'Available',
            address: '',
            error: null
          });
          this.fetchDoctors();
        } else {
          this.setState({ 
            error: text || "Failed to add doctor. Please try again."
          });
        }
      }
    })
    .catch(error => {
      console.error("Error:", error);
      this.setState({ 
        loading: false,
        error: "Failed to connect to server. Please check if the server is running."
      });
    });
  };

  deleteDoctor = (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      fetch(`http://localhost:8057/doctors/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      })
        .then(response => response.text())
        .then(res => {
          // Try to parse as JSON first
          try {
            const data = JSON.parse(res);
            if (data.status === "success" || (data.message && data.message.toLowerCase().includes("success"))) {
              alert("Doctor deleted successfully.");
              this.fetchDoctors();
            } else {
              this.setState({ error: data.message || "Failed to delete doctor." });
            }
          } catch (e) {
            // If not JSON, check for success in plain text
            if (res.toLowerCase().includes("success") || res.startsWith("200::")) {
              alert("Doctor deleted successfully.");
              this.fetchDoctors();
            } else {
              this.setState({ error: res || "Failed to delete doctor." });
            }
          }
        })
        .catch(error => {
          this.setState({ error: "Failed to connect to server. Please check if the server is running." });
        });
    }
  };

  render() {
    const { 
      fullname, email, phone, department,
      specialization, experience, status, address,
      loading, error, success, doctorsList 
    } = this.state;

    return (
      <div className="DoctorContainer">
        <div className="add-doctor-header">
          <h2>Doctor Management</h2>
          <button className="add-btn" onClick={() => this.setState({ 
            fullname: '', 
            email: '', 
            phone: '', 
            department: '', 
            specialization: '', 
            experience: '', 
            status: 'Available',
            error: null,
            success: false
          })}>
            + Add New Doctor
          </button>
        </div>

        <div className="content">
          <div className="doctor-form-container">
            <form className="add-doctor-form" onSubmit={this.handleSubmit}>
              {error && (
                <div className="error-message">
                  {error}
                  <button 
                    type="button"
                    className="retry-button"
                    onClick={() => this.setState({ error: null })}
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {success && (
                <div className="success-message">
                  Doctor added successfully!
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullname"
                    value={fullname}
                    onChange={this.loadInputChange}
                    placeholder="Enter doctor's full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.loadInputChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={this.loadInputChange}
                    placeholder="Enter 10-digit phone"
                    pattern="[0-9]{10}"
                    title="10-digit phone number"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    name="department"
                    value={department}
                    onChange={this.loadInputChange}
                    required
                  >
                    <option value="">---Select Department---</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Specialization *</label>
                  <input
                    type="text"
                    name="specialization"
                    value={specialization}
                    onChange={this.loadInputChange}
                    placeholder="Enter specialization"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Experience (Years) *</label>
                  <input
                    type="number"
                    name="experience"
                    value={experience}
                    onChange={this.loadInputChange}
                    placeholder="Enter years of experience"
                    min="0"
                    max="50"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={address}
                    onChange={this.loadInputChange}
                    placeholder="Enter address"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={status}
                    onChange={this.loadInputChange}
                  >
                    <option value="Available">Available</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>
              </div>

              <div className="form-note">
                <p>* Required fields</p>
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Doctor'}
              </button>
            </form>
          </div>

          <div className="doctors-list">
            <h3>All Doctors ({doctorsList.length})</h3>
            <table className="doctor-table">
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Specialization</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctorsList.map((doctor) => (
                  <tr key={doctor.id}>
                    <td>{doctor.fullname}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.department}</td>
                    <td>{doctor.specialization}</td>
                    <td>{doctor.phone}</td>
                    <td>
                      <span className={`status-badge ${doctor.status?.toLowerCase()}`}>
                        {doctor.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="event-btn delete"
                        onClick={() => this.deleteDoctor(doctor.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default AddDoctor;