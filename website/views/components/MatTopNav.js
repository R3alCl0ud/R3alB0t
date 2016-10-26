const React = require('react');

class UserNav extends React.Component {
    render () {
        let userIcon = this.props.user.avatar ? `https://discordapp.com/api/users/${this.props.user.id}/avatars/${this.props.user.avatar}.jpg` : "https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png"
        return (
        <div className="page-header-top">
            <div className="container-fluid">
                <div className="page-logo">
                    <a href="/">
                        <img src="/images/logo_color.png" alt="logo" className="logo-default" style={{height: "30px"}}/>
                    </a>
                </div>
                <a href="javascript:;" className="menu-toggler"></a>
                <div className="top-menu">
                    <ul className="nav navbar-nav pull-right">
                        <li className="dropdown dropdown-user dropdown-dark">
                             <a href="javascript:;" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true" aria-expanded="false">
                                <img alt="" className="img-circle" src={userIcon}/>
                                <span className="username username-hide-mobile">{this.props.user.username}</span>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-default">
                                <li>
                                    <a href="/profile">
                                        <i className="icon-user"/>
                                         My Profile 
                                    </a>
                                </li>
                                <li className="divider"/>
                                <li>
                                    <a href="/auth/logout">
                                        <i className="fa fa-power-off"/>
                                         Logout
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
       )
    }
}

class TopNav extends React.Component {
    render () {
        
       return (
        <div className="page-header-top">
            <div className="container-fluid">
                <div className="page-logo">
                    <a href="/">
                        <img src="/images/logo_color.png" alt="logo" className="logo-default" style={{height: "30px"}}/>
                    </a>
                </div>
                <a href="javascript:;" className="menu-toggler"></a>
                <div className="top-menu">
                    <ul className="nav navbar-nav pull-right">
                        <li>
                            <a href="/auth/login">
                                <span className="username username-hide-mobile">Login</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
       )
    }
}


class MenuNavigator extends React.Component {
    render() {
        if (this.props.user) {
            const guildDropdown = [];
            
            this.props.guilds.forEach(guild => {
                guildDropdown.push(<li>
                    <a href={`/dashboard/guild/${guild.id}`}>
                    <i className="fa fa-hdd-o"/>
                    {guild.name}</a>
                </li>)
            })
            
            
            return (<div className="page-header-menu">
                <div className="container-fluid">
                    <div className="hor-menu">
                        <ul className="nav navbar-nav">
                            <li>
                                <a href="/">
                                Home
                                </a>
                            </li>
                            <li className="menu-dropdown classic-menu-dropdown">
                                <a href="javascript:;">
                                Dashboard
                                <span className="arrow"/>
                                </a>
                                <ul className="dropdown-menu pull-left">
                                    <li>
                                        <a href="/dashboard/me" className="nav-link ">
                                        <i className="fa fa-desktop"/>
                                         My Dashboard
                                         </a>
                                    </li>
                                    <li className="dropdown-submenu">
                                        <a href="javascript:;" className="nav-link nav-toggle ">
                                        <i className="fa fa-server"/>
                                        Servers
                                        <span className="arrow"/>
                                        </a>
                                        <ul className="dropdown-menu">
                                            {guildDropdown}
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>)
        }
        else {
            return (<div className="page-header-menu">
                <div className="container-fluid">
                    <div className="hor-menu">
                        <ul className="nav navbar-nav">
                            <li>
                                <a href="/">
                                Home
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>)
        }
    }   
}

exports.topNav = TopNav;
exports.menuNav = MenuNavigator;
exports.userNav = UserNav;