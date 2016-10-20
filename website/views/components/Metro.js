/**
 * Created by akerr on 8/6/16.
 */
var React = require("react");
var styles = require("../../css/less/Metronic.less");
// import CSSMODULES from "react-css-modules";
// import myFunctions from "../Extra Functionality/componentTools.js";
// import * as my  from "../Extra Functionality/my .js";


exports.Navigation = ({leftNavigation, rightNavigation})=>(
    <div className={"navbar-fixed-top " + styles.pageHeaderNavbar}>
        <div className="page-header-inner">

            <LeftNavigation{...leftNavigation}/>
            <RightNavigation {...rightNavigation}/>
        </div>
    </div>
);

exports.LeftNavigation = ({companyIdentity,sidebarMenu})=>(
    <div className={styles.pageLogo}>
        <CompanyIdentity {...companyIdentity}/>
        <div className={styles.menuTrigger}>
            <SidebarMenu {...sidebarMenu}/>
        </div>
    </div>
);
exports.RightNavigation = ({iconMapper,userIcon})=>(
    <div className={styles.topMenu}>
        <ul className={"nav pull-right navbar-nav " + styles.navBarNav}>
            {/*<IconMapper {...iconMapper}/>*/}
            {iconMapper.map((icon)=>
                <Icon {...icon}/>
            )}
            <li className="dropdown-user"><UserIcon {...userIcon}/></li>
        </ul>
    </div>
);

exports.Button = ()=>(
    <button>Update Notification</button>
);


exports.CompanyIdentity = ({index,alt,imgLocation})=>(
    <a href={index}>
        <img className={styles.logoDefault} src={imgLocation} alt={alt}/>
    </a>
);

exports.SidebarMenu = ({iconName})=>(
    <li className="dropdown">
        <a className={styles.dropDownToggle}>
            <i className={iconName}></i>
        </a>
    </li>
);

exports.IconMapper = ({icons})=> (
    <li className="dropdown">
        {console.log(icons)}
        {icons.map((iconMapper,i)=>
            <Icon key={i} {...icons}/>
        )}

    </li>
);

exports.Icon = ({iconName,...notify})=> {
    return (
        <li className="dropdown">
            {console.log(notify)}
            <a className={styles.dropDownToggle}>
                <i className={iconName}></i>
                <Notice {...notify}/>
                {/*<IconNotificationDisplay {...data}/>*/}
            </a>
        </li>

    );
};
exports.IconNotificationDisplay = ({messages})=> {
    let iconNotifications = [];
    messages.map((message)=> {
        iconNotifications.push(<IconNotificationDisplay key={message.id} {...message}/>);
    });

    return (<ul>{iconNotifications}</ul>);
};
exports.IconNotification = ({message})=>(<li className={styles.hide}>{message}</li>);
exports.Notice = ({notify})=>(<span className="badge">{notify}</span>);

exports.UserIcon = ({imgLocation, stringName, iconName})=>(
    <a className={styles.dropDownToggle}>
        <img className={styles.imgCircle} src={imgLocation} alt="Image of User"/>
        <span className={styles.userName}>{stringName}</span>
        <i className={iconName}></i>
    </a>
);

var UserIcon= {propTypes:{
    imgLocation: React.PropTypes.string,
    stringName: React.PropTypes.string.isRequired,
    iconName: React.PropTypes.string.isRequired
}};
