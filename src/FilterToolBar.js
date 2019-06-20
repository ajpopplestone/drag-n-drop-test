import React from 'react';
import PropTypes from 'prop-types';
import { reaction, observable, action } from 'mobx';
import { inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import ActionMenu from '../../MenuComponents/ActionMenu/ActionMenu';
import uiStore from '../../../utils/stores/uiStore';

export const styles = theme => ({
    root: {
        ...theme.mixins.toolbar,
        position: 'relative',
        display: 'flex',
        alignItems: 'left',
        justifyContent: 'left',
        maxWidth: 48
    },
    tools_padding: {
        width: 32
    },
    wrapper: {
        marginLeft: 4,
    },
    appbar_root: {
        marginTop: -3,
        flexGrow: 1,
    },
    appbar_flex: {
        flex: 1,
    },
    margin: {
        margin: theme.spacing.unit * 2,
    },
    icon_button: {
        cursor: 'pointer'
    },
    divider: {
        borderRight: '1px solid',
        borderColor: '#1c5f5f59',
        height: 32,
        marginTop: 13,
        position: 'absolute'
    }
});


const selection_menuItems = [
    {
        key: 'create_group_from_selection',
        caption: 'Create New Group From Selection',
        onClick: (ctx, key) => {
            ctx.handleMenuClose();
            ctx.handleMenuClick(key);
        },
    },
    {
        key: 'add_selection_to_group',
        caption: 'Add Selection To Group',
        subMenuItems: []
    },
    {
        key: 'move_selection_to_group',
        caption: 'Move Selection To Group',
        subMenuItems: []
    },
    {
        condition: () => {
            const group_id = uiStore.home_view.groupId[
                uiStore.home_view.view
            ];
            const { view } = uiStore.home_view;
            if (group_id > 0 && uiStore.selection_length[view]) {
                return uiStore.allowedToAddOrDeleteFromGroup(group_id).allowed_to_delete_from_group;
            }
            return false;
        },
        key: 'remove_selection_from_group',
        caption: 'Remove Selection From Group',
        onClick: (ctx, key) => {
            ctx.handleMenuClose();
            ctx.handleMenuClick(key);
        }
    }
];

const menuItemDefinitions = [
    {
        id: 'selection',
        data: selection_menuItems
    }
];


class FilterToolBar extends React.Component {
    state = {
        update: false, visible: false, menuItemData: null, group_selection: 0
    };
    componentDidMount = () => {
        const menuItemData = this.getMenuData(null).data;
        this.reaction_tracker = reaction(() => this.props.uiStore.event, (event) => {
            if (event.id === 'changed_selection_length') {
                if (event.data.view === this.props.uiStore.home_view.view) {
                    this.setState({ group_selection: event.data.cnt });
                }
            }
        });
        const { view } = this.props.uiStore.home_view;
        this.setState({ group_selection: this.props.uiStore.selection_length[view], visible: true, menuItemData });
    }
    componentWillUnmount() {
        this.reaction_tracker();
    }
    @observable anchorElement = null;
    @action
    handleChange = (event, value) => {
        this.updateMenuItems(value);
        this.anchorElement = event.currentTarget;
        const f = this.state.update;
        this.setState({ update: !f });
    };
    @action
    handleMenuClose = () => {
        this.anchorElement = null;
        const f = this.state.update;
        this.setState({ update: !f });
    };

    getMenuData = v => {
        let menuItemData = menuItemDefinitions.find(o => o.id === v);
        if (!menuItemData) {
            menuItemData = menuItemDefinitions[0];              // eslint-disable-line
        }
        return menuItemData;
    }
    handleMenuClick = key => {
        this.props.handleMenuClick(key);
    }
    updateMenuItems = value => {
        switch (value) {
            case 'selection': {
                const desc = this.props.uiStore.home_view.view;
                const groups = this.props.userStore.current_groups[desc];
                const select_array = [];
                const select_move_array = [];
                const menuItemData = this.getMenuData(value).data.slice(0);
                const in_g = this.props.uiStore.home_view.groupId[desc];
                if (groups) {
                    groups.forEach(g => {
                        if (g.name && in_g !== g.id) {
                            if (uiStore.allowedToAddOrDeleteFromGroup(g.id).allowed_to_add_to_group) {
                                select_array.push({
                                    key: `addto_group_${g.id}`,
                                    caption: g.name,
                                    onClick: (ctx, key) => {
                                        this.handleMenuClose();
                                        this.handleMenuClick(key);
                                    }
                                });
                                if (in_g && in_g !== g.id) {
                                    if (uiStore.allowedToAddOrDeleteFromGroup(g.id).allowed_to_delete_from_group) {
                                        select_move_array.push({
                                            key: `moveto_group_${g.id}`,
                                            caption: g.name,
                                            onClick: (ctx, key) => {
                                                this.handleMenuClose();
                                                this.handleMenuClick(key);
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    });
                    const i = menuItemData.find(o => o.key === 'add_selection_to_group');
                    i.subMenuItems = select_array;
                    const i2 = menuItemData.find(o => o.key === 'move_selection_to_group');
                    i2.subMenuItems = select_move_array;
                    if (select_array.length === 0) {
                        const r = menuItemData.findIndex(o => o.key === 'add_selection_to_group');
                        menuItemData.splice(r, 1);
                    }
                    if (select_move_array.length === 0) {
                        const r = menuItemData.findIndex(o => o.key === 'move_selection_to_group');
                        menuItemData.splice(r, 1);
                    }
                } else {
                    const r = menuItemData.findIndex(o => o.key === 'add_selection_to_group');
                    menuItemData.splice(r, 1);
                    const r2 = menuItemData.findIndex(o => o.key === 'move_selection_to_group');
                    menuItemData.splice(r2, 1);
                }
                this.setState({ menuItemData });

                break;
            }
            default: {
                break;
            }
        }
    }

    render() {
        let sel_tool = <span />;
        if (this.state.group_selection > 0) {
            sel_tool = <React.Fragment><span>({this.state.group_selection})</span><IconButton
                onClick={(e) => {
                    this.handleChange(e, 'selection');
                }}
            // className={classes.button}
            >
                <Icon>check_box</Icon>
            </IconButton></React.Fragment>;
        }
        const { classes } = this.props;
        const { menuItemData, visible } = this.state;
        if (!visible) {
            return null;
        }
        return (
            <div id="toolbar_wrapper" className={classes.wrapper}>
                {sel_tool}
                <ActionMenu
                    ctx={this}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(this.anchorElement)}
                    menuItems={menuItemData}
                    anchorElement={this.anchorElement}
                    onClose={this.handleMenuClose}
                />
            </div>
        );
    }
}
FilterToolBar.propTypes = {
    uiStore: PropTypes.object.isRequired,
    userStore: PropTypes.object.isRequired,
    handleMenuClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default inject('uiStore', 'userStore')(withStyles(styles)(FilterToolBar));
