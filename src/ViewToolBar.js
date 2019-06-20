import React from 'react';
import PropTypes from 'prop-types';
import { reaction, observable, action } from 'mobx';
import { inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import ActionMenu from '../../MenuComponents/ActionMenu/ActionMenu';


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


const view_admin_menuItems = [
    {
        key: 'edit_view',
        caption: 'Edit View',
        onClick: (ctx, key) => {
            ctx.handleMenuClose();
            ctx.handleMenuClick(key);
        },
    },
    {
        key: 'exit_view',
        caption: 'Exit View',
        onClick: (ctx, key) => {
            ctx.handleMenuClose();
            ctx.handleMenuClick(key);
        },
    },
    {
        key: 'view_set_default',
        caption: 'Set As Default',
        onClick: (ctx, key) => {
            ctx.handleMenuClose();
            ctx.handleMenuClick(key);
        },
    },
    {
        key: 'delete_view',
        caption: 'Delete View',
        onClick: (ctx, key) => {
            ctx.handleMenuClose();
            ctx.handleMenuClick(key);
        },
    },
];

const menuItemDefinitions = [
    {
        id: 'view_admin',
        data: view_admin_menuItems
    }
];


class ViewToolBar extends React.Component {
    state = {
        kf: 1, update: false, visible: false, menuItemData: null, view: null
    };
    componentDidMount = () => {
        const menuItemData = this.getMenuData(null).data;
        this.reaction_tracker = reaction(() => this.props.uiStore.event, (event) => {
            if (event.id === 'changed_view') {
                let { kf } = this.state;
                kf += 1;
                this.setState({ kf, view: event.data });
            }
        });
        // const v1 = this.props.getDefaultView();
        // console.log(v1);
        this.setState({ view: this.props.getDefaultView(), visible: true, menuItemData });
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
            case 'view_admin': {
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
        let sel_tool = <span />;
        let is_linked = <span />;
        if (this.props.isLinked) {
            is_linked = <div
                className="button_pulse_anim"
                style={{
                    position: 'absolute',
                    marginLeft: -16,
                    marginTop: 16
                }}><Icon style={{ color: '#8080b7' }} className="fa fa-link" /></div>;
        }
        if (this.state.view && this.state.view.viewName !== process.env.REACT_APP_DEFAULT_VIEW_NAME) {
            sel_tool = <React.Fragment>
                {is_linked}
                <IconButton
                    onClick={(e) => {
                        this.handleChange(e, 'selection');
                    }}
                // className={classes.button}
                >
                    <div style={{ display: 'flex' }}>
                        {this.state.view.isDefault &&
                            <span style={{
                                fontSize: '9px',
                                fontFamily: 'arial',
                                marginTop: 8
                            }}>[DEFAULT]</span>
                        }
                        <Icon style={{ color: '#8080b7' }} className="fa fa-eye" />
                        <span style={{ fontSize: 16, lineHeight: '28px', marginLeft: 2 }}>{this.state.view.viewName}</span>
                    </div>
                </IconButton></React.Fragment>;
        }
        const { classes } = this.props;
        const { menuItemData, visible } = this.state;
        if (!visible) {
            return null;
        }
        return (
            <div key={`view_tb_key_${this.state.kf}`} id="toolbar_wrapper" className={classes.wrapper}>
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
ViewToolBar.propTypes = {
    uiStore: PropTypes.object.isRequired,
    getDefaultView: PropTypes.func.isRequired,
    isLinked: PropTypes.bool.isRequired,
    // userStore: PropTypes.object.isRequired,
    handleMenuClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default inject('uiStore', 'userStore')(withStyles(styles)(ViewToolBar));
