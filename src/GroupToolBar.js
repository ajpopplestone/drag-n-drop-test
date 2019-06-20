import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { observable, action, reaction } from 'mobx';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import ActionMenu from '../../MenuComponents/ActionMenu/ActionMenu';
import uiStore from '../../../utils/stores/uiStore';
import userStore from '../../../utils/stores/userStore';

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

const group_admin_menuItems = [
    {
        key: 'edit_group',
        caption: 'Edit Group',
        condition: () => {
            const group_id = uiStore.home_view.groupId[
                uiStore.home_view.view
            ];
            const group_data = userStore.current_groups[
                uiStore.home_view.view
            ];
            const g_d =  group_data.find(o => {
                return o.id === group_id;
            });
            return userStore.user_details.id === g_d.createdById;
        },
        onClick: (ctx, key) => {
            ctx.handleMenuClose();
            ctx.handleMenuClick(key);
        },
    },
    {
        key: 'exit_group_view',
        caption: 'Exit Group',
        onClick: (ctx, key) => {
            ctx.handleMenuClose();
            ctx.handleMenuClick(key);
        },
    }
];

const menuItemDefinitions = [
    {
        id: 'group_admin',
        data: group_admin_menuItems
    }
];

class GroupToolBar extends React.Component {
    state = {
        visible: false, group_name: null, menuItemData: null
    };
    componentDidMount = () => {
        const menuItemData = this.getMenuData(null).data;
        this.setState({ visible: true });
        const v = this.props.uiStore.home_view.view;
        if (this.props.uiStore.home_view.groupId[v] > 0) {
            const g_name = this.props.uiStore.calculateGroupName();
            this.setState({ visible: true, group_name: g_name, menuItemData });
        } else {
            this.setState({ visible: true, group_name: null, menuItemData });
        }
        this.reaction_tracker = reaction(() => this.props.uiStore.event, (event) => {
            if (event.id === 'changed_group') {
                this.setState({ group_name: event.data });
            }
        });
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
            case 'group_admin': {
                const menuItemData = this.getMenuData(value).data.slice(0);
                this.setState({ menuItemData });
                break;
            }
            default: {
                break;
            }
        }
    }
    render() {
        const { classes } = this.props;
        const { visible, group_name, menuItemData } = this.state;
        if (!visible || !group_name) {
            return null;
        }
        return (
            <div id="toolbar_wrapper" className={classes.wrapper}>
                <IconButton
                    onClick={(e) => {
                        this.handleChange(e, 'selection');
                    }}
                >
                    <span style={{
                        fontSize: '9px',
                        fontFamily: 'arial',
                        marginTop: 8
                    }}>{this.state.group_name}</span>
                    <Icon style={{ color: 'rgb(32, 132, 72)' }} className="fa fa-users" />
                </IconButton>
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
GroupToolBar.propTypes = {
    uiStore: PropTypes.object.isRequired,
    // userStore: PropTypes.object.isRequired,
    handleMenuClick: PropTypes.func.isRequired,
    // handleClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default inject('uiStore', 'userStore')(withStyles(styles)(GroupToolBar));
