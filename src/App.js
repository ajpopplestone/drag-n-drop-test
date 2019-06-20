import React, { Component } from 'react';
import TableData from './TableData'
import Planner from './Planner'
import './App.css';

class App extends Component {
  state = {        
    tasks: [{name:"Angular",
             category:"wip", 
             bgcolor: "yellow"},  
          
            {name:"React", 
             category:"wip", 
             bgcolor:"pink"},  
          
            {name:"Vue", 
             category:"complete", 
             bgcolor:"skyblue"}          
      ],
    page: 'grid'
  }
  
  onDragOver = (ev) => {
    ev.preventDefault();
  }
  
  onDragStart = (ev, name) => {
    console.log('Dragstart: ' + name)
    ev.dataTransfer.setData("name", name)
  }
  
  onDrop = (ev, cat) => {
    let name = ev.dataTransfer.getData("name");
    
    let tasks = this.state.tasks.filter(task => {
      if(task.name === name) {
        task.category = cat
      }
      return task
    })
    
    this.setState({tasks})
  }
  
  handleNav = (type) => {
    this.setState({page: type})
  }
  
  render() {        
    var tasks = { 
      wip: [], 
      complete: []        
    }; 
    
    let page = null;
    if (this.state.page === 'grid') {
      page = <TableData />
    } else if (this.state.page === 'planner') {
      page = <Planner />
    }
    
    this.state.tasks.forEach (t => {               
      tasks[t.category].push(<div 
        key={t.name}                     
        onDragStart={(e)=>this.onDragStart(e, t.name)}                    
        draggable                    
        className="draggable"                    
        style={{backgroundColor: t.bgcolor}}>                       
           {t.name}                
      </div>);        
    });
    
    
    return (<div className="container-drag">
              <div className="c-flex">
                <h2 className="header">DRAG & DROP DEMO</h2>
                <nav>
                  <ul>
                    <li 
                      style={this.state.page === 'grid' ? {color: 'blue'} : null}
                      onClick={() => this.handleNav('grid')}>Grid</li>
                    <li 
                      style={this.state.page === 'planner' ? {color: 'blue'} : null}
                      onClick={() => this.handleNav('planner')}>Planner</li>
                  </ul>
                </nav>
              </div>
              <div className="c-flex">
                <div className="wip" 
                  onDragOver={(e)=>this.onDragOver(e)}                    
                  onDrop={(e)=>{this.onDrop(e, "wip")}}>                    
                  <span className="task-header">WIP</span>                    
                  {tasks.wip}                
                </div>
                <div>
                  {page}
                </div>
                <div className="droppable"
                  onDragOver={(e)=>this.onDragOver(e)}                    
                  onDrop={(e)=>this.onDrop(e, "complete")}>                     
                  <span className="task-header">COMPLETED</span>                     
                  {tasks.complete}                
                </div>              
              </div>
            </div>);
  }
}

export default App;
