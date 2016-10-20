var React = require('react');
const Layout = require('./layout');

var level = function(xp) {
    return 10 * Math.ceil(1 / (1 + Math.pow(Math.E, -15 * (xp - 0.12))));
};

class Index extends React.Component {
    render() {
        let guildScroll = [];
        

        console.log(this.props.guilds) 
        this.props.guilds.forEach(guild => {
            guildScroll.push(
                <div className="item">
                    <div className="item-head">
                        <div className="item-details">
                            <img className="item-pic" src={`https://discordapp.com/api/guilds/${guild.id}/icons/${guild.icon}.jpg`} alt={guild.abreviation}/>
                            <a href={`/dashboard/guild/${guild.id}`} className="item-name primary-link">{guild.name}</a>
                        </div>
                    </div>
                </div>)
        });


        let userAvatar = this.props.user.avatar ? `https://discordapp.com/api/users/${String(this.props.user.id)}/avatars/${String(this.props.user.avatar)}.jpg` : "https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png"
        return (
            <Layout {...this.props}>
            <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <a className="dashboard-stat dashboard-stat-v2 dark">
                        <div className="visual">
                            <i className="icon-bubbles"> </i>
                        </div>
                        <div className="details">
                            <div className="number">
                                {this.props.user.guilds.length}
                            </div>
                            <div className="desc"> Your Total Guilds</div>
                        </div>
                    </a>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <a className="dashboard-stat dashboard-stat-v2 dark">
                        <div className="visual">
                            <i className="icon-bubbles"> </i>
                        </div>
                        <div className="details">
                            <div className="number">
                                {this.props.guilds.length}
                            </div>
                            <div className="desc"> Total Guilds With Admin Perms</div>
                        </div>
                    </a>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <a className="dashboard-stat dashboard-stat-v2 dark">
                        <div className="visual">
                            <i className="icon-bubbles"> </i>
                        </div>
                        <div className="details">
                            <div className="number">
                                {this.props.credits ? this.props.credits : 0}
                            </div>
                            <div className="desc"> Total Credits Across All Guilds</div>
                        </div>
                    </a>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <a className="dashboard-stat dashboard-stat-v2 dark">
                        <div className="visual">
                            <i className="icon-bubbles"> </i>
                        </div>
                        <div className="details">
                            <div className="number">
                                {this.props.credits ? level(this.props.credits * 100) : 1}
                            </div>
                            <div className="desc"> Level</div>
                        </div>
                    </a>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 col-xs-12 col-sm-12">
                    <div className="portlet light ">
                        <div className="portlet-title">
                            <div className="caption caption-md">
                                <span className="caption-subject font-blue-madison bold uppercase">Available Guilds</span>
                            </div>
                        </div>
                        <div className="portlet-body">
                            <div className="scroller" style={{height: "305px", overflow: "hidden", width: "auto"}} data-always-visible="1" data-rail-visible1="0" data-handle-color="#D7DCE2">
                                <div className="general-item-list">
                                    {guildScroll}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-xs-12 col-sm-12">
                    <div className="portlet light ">
                        <div className="portlet-title">
                            <div className="caption caption-md">
                                <span className="caption-subject font-blue-madison bold uppercase">API Endpoints</span>
                            </div>
                        </div>
                        <div className="portlet-body">
                            <center>Your API Token </center>
                            <center><code>{this.props.token}</code></center>
                            Credits Endpoint: <code>/api/credits/{`{guild.id}`}/members/{"{user.id}"}?client_id={"{me.id}"}</code>
                        </div>
                    </div>
                </div>
            </div>
            </Layout>
        );
    }
}



class userCard extends React.Component {
    render() {
        return (                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                    <div className="mt-element-card mt-card-round mt-element-overlay" style={{backgroundColor:"#e6e6e6", borderRadius: "5px"}}>
                        <div className="mt-card-item">
                            <div className="mt-card-avatar mt-overlay-1">
                                <img src={"F"} alt="https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png"/>
                                <div className="mt-overlay">
                                    <ul className="mt-info">
                                        <li>
                                            <a className="btn default btn-outline" href="">
                                                <i className="icon-search"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a className="btn default btn-outline" href="">
                                                <i className="icon-link"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-card-content">
                                <h3 className="mt-card-name">{this.props.user.username}#{this.props.user.discriminator}</h3>
                            </div>
                        </div>
                    </div>
                </div>)
    }
}

Index.propTypes = {
    title: React.PropTypes.string
};

module.exports = Index;
