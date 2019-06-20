import React, { Component } from 'react'
import data from './data'
import Paper from '@material-ui/core/Paper';
import update from 'immutability-helper';
// import IconButton from '@material-ui/core/IconButton';
// import Tooltip from '@material-ui/core/Tooltip';
// import Icon from '@material-ui/core/Icon';
// import FilterToolBar from './FilterToolBar'
// import GroupToolBar from './GroupToolBar'
// import ViewToolBar from './ViewToolbar'
import {
  SelectionState, GroupingState, IntegratedSelection, 
  IntegratedFiltering, FilteringState, SortingState, 
  IntegratedGrouping, IntegratedSorting
} from '@devexpress/dx-react-grid';
import {
  Grid,
  VirtualTable,
  Table,
  GroupingPanel,
  DragDropProvider,
  TableHeaderRow,
  TableGroupRow,
  TableColumnReordering,
  TableColumnResizing,
  TableFilterRow,
  Toolbar,
  TableSelection,
  TableColumnVisibility,
  ColumnChooser,
} from '@devexpress/dx-react-grid-material-ui';
// import {
//     Template, 
//     TemplatePlaceholder, 
//     Plugin, 
//     TemplateConnector,
// } from '@devexpress/dx-react-core';
import { withStyles } from '@material-ui/core/styles';


// function ExtraToolBar({
//     handleMenuClick, handleToggleFilters, handleAddEntry, getDefaultView, isLinked
// }) {
//     return (
//         <Plugin name="ExtraToolBar">
//             <Template name="toolbarContent">
//                 <TemplatePlaceholder />
//                 <TemplateConnector>
//                     {({ }) => (             // eslint-disable-line
//                         <React.Fragment>
//                             <GroupToolBar handleMenuClick={handleMenuClick} />
                            
//                             <ViewToolBar isLinked={isLinked} getDefaultView={getDefaultView} handleMenuClick={handleMenuClick} />
//                             <Tooltip enterDelay={500} placement="bottom" id="tooltip-icon" title="Add Entry">
//                                 <IconButton
//                                     onClick={() => {
//                                         handleAddEntry();
//                                     }}
//                                 >
//                                     <Icon>add_circle</Icon>
//                                 </IconButton>
//                             </Tooltip>
//                             <Tooltip enterDelay={500} placement="bottom" id="tooltip-icon" title="Toggle Filters">
//                                 <IconButton
//                                     onClick={() => {
//                                         handleToggleFilters();
//                                     }}
//                                 >
//                                     <Icon>filter_list</Icon>
//                                 </IconButton>
//                             </Tooltip>
//                         </React.Fragment>
//                     )}
//                 </TemplateConnector>
//             </Template>
//         </Plugin>
//     );
// }


const styles = {
    customRow: {
        '&:hover': {
            backgroundColor: 'lightgray',
        }
    },
};


const CustomTableRowBase = ({ row, classes, ...restProps }) => {
    return (
        <Table.Row
            className={classes.customRow}
            onClick={() => { row.editRow(row); }}
            {...restProps}
            style={{
                cursor: 'pointer',
                height: 32
            }}
        />
    );
};

export const CustomTableRow = withStyles(styles, { name: 'CustomTableRow' })(CustomTableRowBase);


class TableData extends Component {
    state = {
        rows: data.candidates,
        columns: [
              { name: 'forename', title: 'Forename' },
              { name: 'surname', title: 'Surname' },
              { name: 'address', title: 'Address' },
              { name: 'status', title: 'Status' },
              { name: 'email', title: 'Email' },
              { name: 'telephone', title: 'Telephone' },
              { name: 'consultant', title: 'Consultant' },
              { name: 'roleCode', title: 'Role Code' },
              { name: 'UID', title: 'Unique ID' },
            ],
        selection: [],
        grid_settings: {
                defaultExpandedGroups: [],
                defaultGrouping: [],
                filter_rows: false,
                sorting: [{ columnName: 'forename', direction: 'asc' }],
                columnWidths: [
                    { columnName: 'forename', width: 100 },
                    { columnName: 'surname', width: 100 },
                    { columnName: 'address', width: 300 },
                    { columnName: 'status', width: 100 },
                    { columnName: 'email', width: 100 },
                    { columnName: 'telephone', width: 100 },
                    { columnName: 'consultant', width: 100 },
                    { columnName: 'roleCode', width: 100 },
                    { columnName: 'UID', width: 100 }
                  ],
                columnOrder: ['forename', 'surname', 'address', 'status', 'email', 'telephone', 'consultant', 'roleCode', 'UID'],
                filters: [],
                hiddenColumnNames: [],
            }
    }
    
    changeSelection = selection => this.setState({ selection });
    
    hiddenColumnNamesChange = hiddenColumnNames => {
        const newState = update(this.state, {
            grid_settings: { hiddenColumnNames: { $set: hiddenColumnNames } }
        });
        this.setState(newState);
    }
    
    changeFilters = filters => {
        const newState = update(this.state, {
            grid_settings: { filters: { $set: filters } }
        });
        this.setState(newState);
    }
    
    changeSorting = sorting => {
        const newState = update(this.state, {
            grid_settings: { sorting: { $set: sorting } }
        });
        this.setState(newState);
    }
    
    changeColumnOrder = columnOrder => {
        const newState = update(this.state, {
            grid_settings: { columnOrder: { $set: columnOrder } }
        });
        this.setState(newState);
    }
    
    changeColumnWidths = columnWidths => {
      console.log(columnWidths)
        const newState = update(this.state, {
            grid_settings: { columnWidths: { $set: columnWidths } }
        });
        this.setState(newState);
    }
    
    render() {
        const { rows, columns, selection } = this.state;
        const {
            defaultExpandedGroups, defaultGrouping, filters, columnWidths, columnOrder, hiddenColumnNames, sorting
        } = this.state.grid_settings;
        // console.log(columnWidths)
        
        return (
          <div>
            <span>
              Total rows selected:
              {' '}
              {selection.length}
            </span>
            <Paper className="paper">
              <Grid
                rows={rows}
                columns={columns}
              >
                <SelectionState
                    selection={selection}
                    onSelectionChange={this.changeSelection}
                />
                <FilteringState
                    filters={filters}
                    onFiltersChange={this.changeFilters}
                />
                <DragDropProvider />
                <SortingState
                    sorting={sorting}
                    onSortingChange={this.changeSorting}
                />
                <GroupingState
                    onGroupingChange={this.changeGrouping}
                    onExpandedGroupsChange={this.changeExpandedGroups}
                    defaultGrouping={defaultGrouping}
                    defaultExpandedGroups={defaultExpandedGroups}
                />
                <IntegratedSelection />
                <IntegratedGrouping />
                <IntegratedSorting />
                <IntegratedFiltering />
                <VirtualTable
                    height={this.scroll_size}
                    rowComponent={CustomTableRow}
                />

                <TableColumnResizing
                    columnWidths={columnWidths}
                    onColumnWidthsChange={this.changeColumnWidths}
                />
                {/* f_row */}
                <TableColumnReordering
                    order={columnOrder}
                    onOrderChange={this.changeColumnOrder}
                />
                <TableHeaderRow showSortingControls />
                <TableFilterRow />
                <TableColumnVisibility
                    hiddenColumnNames={hiddenColumnNames}
                    onHiddenColumnNamesChange={this.hiddenColumnNamesChange}
                />
                <TableSelection
                    showSelectAll
                />
                <TableGroupRow />
                <Toolbar />
                {/* <ExtraToolBar 
                  type={this.props.type} 
                  handleToggleFilters={this.toggleFilters} 
                  handleMenuClick={this.handleMenuClick} 
                  isLinked={this.props.userStore.selected_view_link[this.props.type] ? true : false} /> */}
                <GroupingPanel showSortingControls />
                {/* <Template
                    style={{ height: 80 }}
                    name="toolbarContent"
                >
                    <TemplatePlaceholder /> */}
                {/* </Template> */}
                <ColumnChooser />
              </Grid>
            </Paper>
          </div>
        );
    }
}


export default TableData;