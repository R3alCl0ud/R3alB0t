var React = require('react');
const navHelp = require('../lib/navHelper');
const Layout = require('./layout');


class guildItem extends React.Component {
  render() {
    return (
      <tr>
        <td className="fit">
        {this.props.icon ? <img className="" scr={this.props.icon}/> : <span className="guild-shorthand">{this.props.abreviation}</span>}
        </td>
        <td>
          {this.props.name}
        </td>
        <td>
        Admin: {this.props.admin}
        </td>
        <td>Credits: 0</td>
      </tr>);
  }
}




class Profile extends React.Component {
  render() {
    let userAvatar = this.props.user.avatar ? `https://discordapp.com/api/users/${String(this.props.user.id)}/avatars/${String(this.props.user.avatar)}.jpg` : "https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png"
    let guildList = [];
    this.props.user.guilds.forEach(guild => {
        let Abreviation = guild.name.split(" ")
        for (const word in Abreviation) {
          Abreviation[word] = Abreviation[word][0]
        }
      
        const infoGuild = {
          icon: guild.icon ? `https://discordapp.com/api/guilds/${guild.id}/icons/${guild.icon}.jpg` : null,
          name: guild.name,
          admin: "false",
          abreviation: Abreviation
        };
        
        guildList.push(infoGuild)
    })
    return (
      <Layout {...this.props}>
        <div className="row">
          <div className="col-md-12">
            <div className="profile-sidebar">
              <div className="portlet light profile-sidebar-portlet">
                <div className="profile-userpic">
                <img src={userAvatar} className="img-responsive"/>
                </div>
                <div className="profile-usertitle">
                  <div className="profile-usertitle-name">{this.props.user.username}</div>
                </div>
                <div className="profile-userbuttons">
                </div>
              </div>
            </div>
            <div className="profile-content">
              <div className="row">
                <div className="col-md-12">
                  <div className="portlet light ">
                    <div className="portlet-title">
                      <div className="caption caption-md">
                        <span className="caption-subject font-blue-madison bold uppercase">Your Guilds</span>
                        </div>
                    </div>
                    <div className="portlet-body">
                      <div className="table-scrollable table-scrollable-borderless">
                        <table className="table table-hover table-light">
                          <thead>
                            <tr className="uppercase">
                              <th></th>
                              <th>Guild</th>
                              <th>Admin</th>
                              <th>Your Credits</th>
                              </tr>
                          </thead>
                          <tbody>
                            {guildList.map(guild =>(      
                              <tr>
                                <td className="fit">
                                {guild.icon ? <img className="user-pic" src={guild.icon}/> : <span className="guild-shorthand">{guild.abreviation}</span>}
                                </td>
                                <td>
                                  {guild.name}
                                </td>
                                <td>
                                Admin: {guild.admin}
                                </td>
                              </tr>))}
                          </tbody>
                          </table>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Layout>
    );
  }
}

Profile.propTypes = {
  title: React.PropTypes.string
};

module.exports = Profile;
