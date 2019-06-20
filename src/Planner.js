import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper';
// import moment from 'moment'

// import Timeline from 'react-calendar-timeline'
// // make sure you include the timeline stylesheet or the timeline will not be styled
// import 'react-calendar-timeline/lib/Timeline.css'

// const groups = [{ id: 1, title: 'group 1' }, { id: 2, title: 'group 2' }]
 
// const items = [
//   {
//     id: 1,
//     group: 1,
//     title: 'item 1',
//     start_time: moment(),
//     end_time: moment().add(1, 'hour')
//   },
//   {
//     id: 2,
//     group: 2,
//     title: 'item 2',
//     start_time: moment().add(-0.5, 'hour'),
//     end_time: moment().add(0.5, 'hour')
//   },
//   {
//     id: 3,
//     group: 1,
//     title: 'item 3',
//     start_time: moment().add(2, 'hour'),
//     end_time: moment().add(3, 'hour')
//   }
// ]

class TableData extends Component {
    
    
    render() {
        
        
        return (
          <div>
            <span>
              Planner
            </span>
            <Paper className="paper">
              <div>
                Rendered by react!
                
              </div>
            </Paper>
          </div>
        );
    }
}


export default TableData;