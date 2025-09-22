import React, { useState } from 'react';
import './MedicalRecords.css';

const MedicalRecords = () => {
  // Static records data - no need for useEffect/API calls
  const defaultRecords = [
    {
      id: 1,
      date: '2025-05-02',
      type: 'Lab Result',
      doctorName: 'Dr. Sarah Wilson',
      department: 'Hematology',
      status: 'completed',
      description: 'Complete Blood Count (CBC) analysis'
    },
    {
      id: 2,
      date: '2025-04-15',
      type: 'Prescription',
      doctorName: 'Dr. John Doe',
      department: 'General Medicine',
      status: 'active',
      description: 'Amoxicillin 500mg, twice daily for 7 days'
    },
    {
      id: 3,
      date: '2025-03-28',
      type: 'Diagnosis',
      doctorName: 'Dr. Michael Chen',
      department: 'Cardiology',
      status: 'completed',
      description: 'Annual heart examination - normal results'
    },
    {
      id: 4,
      date: '2025-02-14',
      type: 'Imaging',
      doctorName: 'Dr. Lisa Rodriguez',
      department: 'Radiology',
      status: 'completed',
      description: 'Chest X-ray - no abnormalities detected'
    },
    {
      id: 5,
      date: '2025-01-30',
      type: 'Surgery',
      doctorName: 'Dr. James Williams',
      department: 'Orthopedics',
      status: 'completed',
      description: 'Arthroscopic knee surgery - right knee'
    },
    {
      id: 6,
      date: '2025-05-08',
      type: 'Test Results',
      doctorName: 'Dr. Emily Johnson',
      department: 'Neurology',
      status: 'pending',
      description: 'EEG brain activity scan results'
    }
  ];

  const [records] = useState(defaultRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Filter records based on search term and filter option
  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && record.status === filter;
  });

  const handleDownload = (recordId) => {
    // Static implementation - just show alert
    alert(`Record ${recordId} would be downloaded as PDF`);
  };

  const handleViewDetails = (recordId) => {
    // Static implementation - just show alert
    alert(`Viewing details for record ${recordId}`);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'completed': return 'status-completed';
      case 'active': return 'status-active';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  return (
    <div className="medical-records-container">
      <div className="records-header">
        <h1>My Medical Records</h1>
        
      </div>

      <div className="records-filter-section">
        <div className="filter-options">
          <span>Filter by:</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Records</option>
            <option value="completed">Completed</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="records-content">
        {filteredRecords.length > 0 ? (
          <table className="records-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.type}</td>
                  <td>{record.doctorName}</td>
                  <td>{record.department}</td>
                  <td>{record.description}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(record.status)}`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button 
                      className="btn-view" 
                      onClick={() => handleViewDetails(record.id)}
                      title="View Details"
                    >
                      <img src="/images/view-icon.png" alt="View" className="action-icon" />
                    </button>
                    <button 
                      className="btn-download" 
                      onClick={() => handleDownload(record.id)}
                      title="Download PDF"
                    >
                      <img src="download.jpg" alt="Download" className="action-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <img src="/images/empty-records.png" alt="No records found" className="empty-state-image" />
            <p className="empty-text">No medical records found.</p>
            <p className="empty-subtext">
              {searchTerm ? 
                "Try changing your search or filter criteria." : 
                "Your medical records will appear here once they are added to the system."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;