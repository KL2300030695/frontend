import React, { Component } from 'react';
import { Apicall, getSession, setSession } from './api';
import MyAppointments from './MyAppointments'
import BookAppointment from './BookAppointment'
import MedicalRecords from './MedicalRecords';
import PatientDashboard from './PatientDashboard';
import AdminDashboard from './AdminDashboard';
import AddDoctor from './AddDoctor';
import MenuBar from './MenuBar';
import DoctorDashboard from './DoctorDashboard';
import './Dashboard.css';
import './MenuBar.css';

class Dashboard extends Component {
  constructor(props)
    {
        super(props);
        this.state={fullname:'',activecomponents:''};
        this.getnameResponse=this.getnameResponse.bind(this);  
        this.loadcomponents=this.loadcomponents.bind(this); 
    }
    componentDidMount() 
    {

        let crs=getSession("crsid");
        if(crs==="")
        {
            this.logout();

        }
        let data=JSON.stringify({crsid:crs})
        Apicall("POST","http://localhost:8057/healthuser/getname",data,this.getnameResponse);

    }
    getnameResponse(res)
    {
        if(res){
            this.setState({ fullname: res});
        }
    }
  loadcomponents(mid)
    {
        let components={
            "1":<PatientDashboard/>,
            "2":<BookAppointment/>,
            "3":<MyAppointments/>,
            "4":<MedicalRecords/>,
            "5":<AdminDashboard/>,
            "6":<DoctorDashboard/>,
            "7":<AddDoctor/>
        };
        this.setState({activecomponents:components[mid]});

    }
    logout()
    {
        setSession("crsid","",-1);
        window.location.replace("/");
    }
    
  render() {
    const{fullname,activecomponents}=this.state;
    return (
            <div className='dashboard'>
                <div className='header'>
                    <img className='logo' src='logo.png'></img>
                    <div className='logotext'><span>Health</span>Care</div>
                    <img className='logouticon'  onClick={()=>this.logout()} src='Logout.jpg'alt=' ' />
                    <label className='fullnametext' >{fullname}</label>
                </div>
                <div className='menu'>
                    <MenuBar onMenuClick={this.loadcomponents}/>
                </div>
                <div className='outlet'>{activecomponents}</div>
            </div>
    );
  }
}

export default Dashboard;
