const React = require('react');
const Layout = require('./layout');
const Music = require('./plugins/music');
const Commands = require('./plugins/commands');
const Currency = require('./plugins/credits');
const UI = require('./components/UI');

class Index extends React.Component {
    render() {
        const data = {
            tableTitle: "Plugins",
            tabs: [{
                    title: "Music",
                    content: <Music playlist={this.props.playlist} guild={this.props.guild.id} enabled={this.props.plugins.indexOf("music") !== -1}/>
                }, {
                    title: "Currency",
                    content: <Currency credits={this.props.credits} guild={this.props.guild} enabled={this.props.plugins.indexOf("currency") !== -1}/>
                }, {
                    title: "Commands",
                    content: <Commands commands={this.props.commands} guild={this.props.guild.id} enabled={this.props.plugins.indexOf("custom") !== -1}/>
                }
             ]
        }

        return (
            <Layout {...this.props}>
                <div className="row">
                    <div className="col-md-12">
                        <UI.tabbedTable {...data}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-xs-12 col-sm-12">
                        <div className="portlet light dark">
                            <div className="portlet-title">
                                <div className="caption caption-md">
                                    <span className="caption-subject font-blue-madison bold uppercase">Latest Messages</span>
                                </div>
                            </div>
                            <div className="portlet-body">
                                <div className="scroller" style={{height: "525px", overflow: "hidden", width: "auto"}} data-always-visible="1" data-rail-visible1="0" data-handle-color="#D7DCE2">
                                    <div className="general-item-list">
                                        {this.props.guild.textChannels.map(channel =>(
                                            <div className="item">
                                                <div className="item-head">
                                                    <div className="item-details light">
                                                        <span className="item-name" style={{color:"white"}}>#{channel.name}</span>
                                                        <span className="item-label">{channel.topic}</span>
                                                    </div>
                                                </div>
                                                <div className="item-body">
                                                    {channel.lastMessage ? <span><img className="item-pic" src={channel.lastMessage.author.avatarURL}/>{channel.lastMessage.author.username}: {channel.lastMessage.content}</span> : <span>Message not found</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-xs-12 col-sm-12">
                        <div className="portlet light dark">
                            <div className="portlet-title">
                                <div className="caption caption-md">
                                    <span className="caption-subject font-blue-madison bold uppercase">Roles</span>
                                </div>
                            </div>
                            <div className="portlet-body">
                                <div className="scroller" style={{height: "525px", overflow: "hidden", width: "auto"}} data-always-visible="1" data-rail-visible1="0" data-handle-color="#D7DCE2">
                                    <div className="general-item-list">
                                        {this.props.guild.roles.map(role =>(
                                            <div className="item">
                                                <div className="item-body">
                                                    <span className="item-name" style={{color: `#${role.color.toString(16)}`}}>Name: {role.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Layout>);
    }
}

Index.propTypes = {
    title: React.PropTypes.string
};

module.exports = Index;
