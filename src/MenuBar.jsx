import React, { Component } from 'react';
import { Apicall, getSession } from './api';

class MenuBar extends Component {
    constructor(){
        super();
        this.state={mitems:[]};
        this.loadmenus=this.loadmenus.bind(this);
    }
    componentDidMount()
    {
        let crs=getSession("crsid")
        let data=JSON.stringify({crsid:crs})
        Apicall("POST", "http://localhost:8057/menus/getmenusbyrole", data, this.loadmenus);
        //callApi("POST","http://localhost:8056/menus/getmenus","",this.loadmenus);
    }
    loadmenus(res)
    {
        let data=JSON.parse(res);
        this.setState({mitems:data});
    }
    render() {
        const {mitems}= this.state

        return (
            <div className='menubar'>
                <div className='menuheader'>
                <img src='menu.jpg' className='menuicon'></img>
                <label>menu</label>
                </div>
                <div className='menuitems'>
                    <ul>
                        {mitems.map((row)=>(
                            <li onClick={()=>this.props.onMenuClick(row.mid)}>{row.menu} <img src={row.micon} alt="" /></li>
                        ))}
                        
                    </ul>

                </div>
                
            </div>
        );
    }
}

export default MenuBar;