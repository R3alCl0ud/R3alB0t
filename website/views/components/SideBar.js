let React = require("react");
let TopNav = require("./Top_Navigation");


//TODO Examine what properties should be passed add Proptypes and default types.

class MenuSideBarWidget extends React.Component{
    constructor(props){
        super(props);
        this._handleChange =  this._handleChange.bind(this);
        this.state={isCollapsed:true};
    }
    render(){

        return(<div className="page-sidebar navbar-collapse collapse">
                    <SidebarMenu isCollapsed={this.state.isCollapsed}{...this.props.sideBarMenu}/>
                </div>
        );
    }
    _handleChange(previousState){
        console.log(previousState);
        this.setState({isCollapsed:previousState});
    }
}



//TODO Examine what properties should be passed add Proptypes and default types.
var IconMapper = ({icons})=> (
    <li className="dropdown">
        {console.log(icons)}
        {icons.map((iconMapper, i)=>
            <Icon {...icons}/>
        )}

    </li>
);

//TODO Examine what properties should be passed add Proptypes and default types.
var IconNotificationDisplay = ({messages})=> {
    let iconNotifications = [];
    messages.map((message)=> {
        iconNotifications.push(<IconNotificationDisplay key={message.id} {...message}/>);
    });

    return (<ul>{iconNotifications}</ul>);
};

//TODO Examine what properties should be passed add Proptypes and default types.
class SidebarMenu extends React.Component{
    render() {
    let active = "active";
    let icons = [];
    var sidebarMenuIcons = this.props.sidebarMenuIcons || [];
    sidebarMenuIcons.map((sidebarMenuIcon, i)=> {
        if (sidebarMenuIcon.active) {
            icons.push(<li className={"nav-item " + active}><SidebarMenuIcon {...sidebarMenuIcon}/></li>);
        } else {
            icons.push(<li className="nav-item"><SidebarMenuIcon {...sidebarMenuIcon}/></li>);
        }

    });
    if(this.props.isCollapsed){
        return ( <div className="sidebar-position when-closed page-sidebar navbar-collapse collapse">
            <ul className="page-sidebar-menu page-header-fixed">
                <SidebarHeading {...this.props.sidebarHeading}/>
                {icons}
            </ul>
        </div>)

    }else{
        return (
            <ul className="page-sidebar-menu page-header-fixed">
                <SidebarHeading {...this.props.sidebarHeading}/>
                {icons}
            </ul>)
    }
};
}
//TODO Examine what properties should be passed add Proptypes and default types.
var SidebarMenuIcon = ({mainIconName, menuName, dropDownIconName, page})=>(
    <a className="nav-link nav-toggle" href={page ? page : ""}>
        <i className={"large " + mainIconName}></i>
        <span className="selected"></span>
        <span className="title completely-hidden">{menuName}</span>
        <DropDownIcon dropDownIconName={dropDownIconName} />
    </a>
);

const DropDownIcon = ({dropDownIconName})=>(
    <span className="myarrow completely-hidden"><i className={dropDownIconName}></i></span>
);

//TODO Examine what properties should be passed add Proptypes and default types.
var SidebarHeading = ({heading})=>(
    <li className="heading kinda-hidden">
        <h3 className="uppercase">{heading}</h3>
    </li>
);

//TODO Examine what properties should be passed add Proptypes and default types.
var SearchBar = ({placeHolder, iconName})=>(
    <form className="sidebar-search">
        <div className="input-group">
            <input type="text" className="form-control" placeholder={placeHolder}/>
            <span className="input-group-btn">
                    <a className="btn submit">
                        <i className={iconName}></i>
                    </a>
                </span>
        </div>
    </form>
);

const sideDropMenu = ({icons}) => {
    let menuIcons = []
    icons.forEach(icon => {
        if (icon.active) {
            menuIcons.push(<li className="nav-item start active open"> 
                <a className="nav-link" href={icon.link}>
                    <i className={icon.iconName}/>
                    <span className="title">{icon.title}</span>
                </a>
            </li>)
        } else {
            menuIcons.push(<li className="nav-item start"> 
                <a className="nav-link" href={icon.link}>
                    <i className={icon.iconName}/>
                    <span className="title">{icon.title}</span>
                </a>
            </li>)
        }
    })
    
    return(<ul className="sub-menu">
        
    </ul>)

    
}

exports.MenuSideBarWidget = MenuSideBarWidget
exports.IconMapper = IconMapper
exports.IconNotificationDisplay = IconNotificationDisplay
exports.SidebarMenu = SidebarMenu
exports.SidebarMenuIcon = SidebarMenuIcon
exports.SidebarHeading = SidebarHeading
exports.SearchBar = SearchBar
exports.DropDownIcon = DropDownIcon
