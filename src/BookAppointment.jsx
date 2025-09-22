import React, { Component } from 'react';
import { Apicall } from './api';
import './BookAppointment.css';

const Footer = () => (
  <div className="footer">
    <div className="footer-socials">
      <button>FB</button>
      <button>TW</button>
      <button>G+</button>
      <button>IN</button>
      <button>LI</button>
      <button>GH</button>
    </div>
    <div className="footer-copy">
      © 2022 Copyright: Md.Talal Wasim (Developer)
    </div>
  </div>
);

class BookAppointment extends Component {
  state = {
    fullName: '',
    gender: '',
    age: '',
    email: '',
    phone: '',
    diseases: '',
    appointmentDate: '',
    appointmentTime: '',
    department: '',
    fullAddress: '',
    loading: false,
    error: null,
    success: false,
    doctors: [],
    selectedDoctor: null
  };

  componentDidMount() {
    this.fetchDoctors();
  }

  fetchDoctors = () => {
    Apicall("GET", "http://localhost:8057/doctors/list", "", (res) => {
      if (res) {
        try {
          const doctors = JSON.parse(res);
          this.setState({ doctors });
        } catch (e) {
          console.error("Error parsing doctors data:", e);
        }
      }
    });
  };

  getAvailableDoctor = (department) => {
    const { doctors } = this.state;
    // Make the check case-insensitive and trim whitespace
    const availableDoctor = doctors.find(doctor => 
      doctor.department && doctor.department.trim().toLowerCase() === department.trim().toLowerCase() &&
      doctor.status && doctor.status.trim().toLowerCase() === 'available'
    );
    return availableDoctor;
  };

  validateForm = () => {
    const { fullName, gender, age, email, phone, appointmentDate, appointmentTime, department, fullAddress } = this.state;

    if (!fullName || !gender || !age || !email || !phone || !appointmentDate || !appointmentTime || !department || !fullAddress) {
      return "Please fill in all required fields.";
    }

    if (!/^\d{10}$/.test(phone)) {
      return "Phone number must be 10 digits.";
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
      return "Please enter a valid age.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    return null;
  };

  handleDepartmentChange = (e) => {
    const department = e.target.value;
    const availableDoctor = this.getAvailableDoctor(department);
    
    this.setState({ 
      department,
      selectedDoctor: availableDoctor,
      error: availableDoctor ? null : "No doctors available in this department. Please try another department."
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'department') {
      this.handleDepartmentChange(e);
    } else {
      this.setState({ [name]: value });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const error = this.validateForm();
    if (error) {
      this.setState({ error });
      return;
    }

    const {
      fullName, gender, age, email, phone,
      diseases, appointmentDate, appointmentTime,
      department, fullAddress, selectedDoctor
    } = this.state;

    if (!selectedDoctor) {
      this.setState({ error: "No doctors available in this department. Please try another department." });
      return;
    }

    const appointmentData = {
      fullName: fullName.trim(),
      gender: gender.trim(),
      age: parseInt(age, 10),
      appointmentDate: new Date(appointmentDate).toISOString().split('T')[0],
      appointmentTime: appointmentTime,
      email: email.trim(),
      phone: phone.trim(),
      diseases: diseases.trim(),
      department: department.trim(),
      fullAddress: fullAddress.trim(),
      status: 'Scheduled',
      doctor: { id: selectedDoctor.id }
    };

    this.setState({ loading: true, error: null });

    Apicall("POST", "http://localhost:8057/appointments/create", JSON.stringify(appointmentData), (res) => {
      this.setState({ loading: false });

      if (!res) {
        this.setState({ error: "No response from server." });
        return;
      }

      try {
        // First try to parse as JSON
        const response = JSON.parse(res);
        
        if (response.status === "success") {
          this.setState({ 
            success: true,
            fullName: '',
            gender: '',
            age: '',
            email: '',
            phone: '',
            diseases: '',
            appointmentDate: '',
            appointmentTime: '',
            department: '',
            fullAddress: '',
            selectedDoctor: null,
            error: null
          });
          
          // Redirect to MyAppointments after 2 seconds
          setTimeout(() => {
            window.location.href = '/my-appointments';
          }, 2000);
        } else {
          this.setState({ error: response.message || "Failed to book appointment." });
        }
      } catch (e) {
        // If JSON parsing fails, try to handle as string response
        if (res.includes("::")) {
          const [status, message] = res.split("::");
          if (status === "200") {
            this.setState({ 
              success: true,
              fullName: '',
              gender: '',
              age: '',
              email: '',
              phone: '',
              diseases: '',
              appointmentDate: '',
              appointmentTime: '',
              department: '',
              fullAddress: '',
              selectedDoctor: null,
              error: null
            });
            
            // Redirect to MyAppointments after 2 seconds
            setTimeout(() => {
              window.location.href = '/my-appointments';
            }, 2000);
          } else {
            this.setState({ error: message || "Failed to book appointment." });
          }
        } else {
          this.setState({ error: "Error processing server response. Please try again." });
        }
      }
    });
  };

  render() {
    const {
      fullName, gender, age, email, phone,
      diseases, appointmentDate, appointmentTime,
      department, fullAddress, loading, error, success,
      selectedDoctor
    } = this.state;

    return (
      <div className="appointment-container">
        <div className="appointment-content">
          <div className="appointment-image">
            <img src="bookappointment.jpg" alt="Doctor" />
          </div>
          <div className="appointment-form-box">
            <form className="appointment-form" onSubmit={this.handleSubmit}>
              <h2>Book Your Appointment</h2>

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
                  Appointment booked successfully! Redirecting to your appointments...
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={fullName}
                    onChange={this.handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select
                    name="gender"
                    value={gender}
                    onChange={this.handleChange}
                    required
                  >
                    <option value="">---Select Gender---</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Age *</label>
                  <input
                    type="number"
                    name="age"
                    value={age}
                    onChange={this.handleChange}
                    placeholder="Enter your age"
                    min="0"
                    max="120"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    name="department"
                    value={department}
                    onChange={this.handleChange}
                    required
                  >
                    <option value="">---Select Department---</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Appointment Date *</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={appointmentDate}
                    onChange={this.handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Appointment Time *</label>
                  <input
                    type="time"
                    name="appointmentTime"
                    value={appointmentTime}
                    onChange={this.handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.handleChange}
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={this.handleChange}
                    placeholder="Enter 10-digit phone"
                    pattern="[0-9]{10}"
                    title="10-digit phone number"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Medical Condition/Reason for Visit</label>
                <textarea
                  name="diseases"
                  value={diseases}
                  onChange={this.handleChange}
                  placeholder="Briefly describe your medical condition or reason for visit"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Full Address *</label>
                <textarea
                  name="fullAddress"
                  value={fullAddress}
                  onChange={this.handleChange}
                  placeholder="Enter your complete address"
                  rows="3"
                  required
                />
              </div>

              {selectedDoctor && (
                <div className="doctor-info">
                  <p>Assigned Doctor: Dr. {selectedDoctor.fullName}</p>
                  <p>Department: {selectedDoctor.department}</p>
                </div>
              )}

              <div className="form-note">
                <p>* Required fields</p>
                <p>Note: A doctor will be automatically assigned based on department availability.</p>
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={loading || !selectedDoctor}
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default BookAppointment;
