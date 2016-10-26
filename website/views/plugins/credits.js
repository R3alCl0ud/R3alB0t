const React = require('react');

class commands extends React.Component {
    render() {
        const userList = [];
        const roleList = [];

        this.props.guild.roles.map(role =>{
            if (role.name !== "@everyone") {
                roleList.push(
                    <tr>
                        <td style={{color: `#${role.color.toString(16)}`}}>{role.name}</td>
                        <td><input type="text" value={role.price} name={`price_${role.id}`} className="form-control"/></td>
                        <td>
                            <select name={`pre_${role.id}`} className="form-control input-xs">
                                <option value="0">None</option>
                            {this.props.guild.roles.map(roleU =>(
                                roleU.id === role.pre ? <option value={`${roleU.id}`} style={{color: `#${roleU.color.toString(16)}`}} selected="slected">{roleU.name}</option> : (roleU.id == role.id ? "" : (roleU.name == "@everyone" ? "" : <option value={`${roleU.id}`} style={{color: `#${roleU.color.toString(16)}`}}>{roleU.name}</option>))
                            ))}
                            </select>
                        </td>
                    </tr>);
            }
        })
        
        this.props.credits.credits.forEach((holding, index) => {
            if ((index + 1) % 2 == 0) {
                const avatar = this.props.credits.avatars[index] == "https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png" ? "https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png" : `https://discordapp.com/api/users/${this.props.credits.ids[index]}/avatars/${this.props.credits.avatars[index]}.jpg`
                userList.push(<tr className="even" role="row">
                        <td><img src={avatar} style={{height:"50px", borderRadius:"100%"}}/>{this.props.credits.names[index]}<span>#{this.props.credits.descriminators[index]}</span></td>
                        <td>¥{holding}</td>
                    </tr>);
            }
            else {
                const avatar = this.props.credits.avatars[index] == "https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png" ? "https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png" : `https://discordapp.com/api/users/${this.props.credits.ids[index]}/avatars/${this.props.credits.avatars[index]}.jpg`
                userList.push(<tr className="odd" role="row">
                        <td><img src={avatar} style={{height:"50px", borderRadius:"100%"}}/>{this.props.credits.names[index]}<span>#{this.props.credits.descriminators[index]}</span></td>
                        <td>¥{holding}</td>
                    </tr>);
            }
        })


        return (
            <div>
            <h1>Currency {this.props.enabled ? <a href={`/dashboard/guild/${this.props.guild.id}/plugin/currency/disable`} className="btn btn-warning">Disable</a> : <a href={`/dashboard/guild/${this.props.guild.id}/plugin/currency/enable`} className="btn btn-info">Enable</a>}</h1>
            <div className="row">
            <div className="col-md-4">
                <div className="portlet blue-hoki box">
                    <div className="portlet-title">
                        <div className="caption">
                            <span className="caption-subject bold uppercase">Credits</span>
                        </div>
                    </div>
                    <div className="portlet-body">
                        <div className="row">
                            <table id="credits" className="table">
                                <thead>
                                <tr role="row">
                                    <th>Account Holder</th>
                                    <th>Balance</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {userList}
                                 </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-8">
                <div className="portlet blue-hoki box">
                    <div className="portlet-title">
                        <div className="caption">
                            <span className="caption-subject bold uppercase">Roles</span>
                        </div>
                    </div>
                    <div className="portlet-body">
                        <form action={`/guild/${this.props.guild.id}/store/update`} method="post">
                            <table id="credits_roles" className="table">
                                <thead>
                                    <tr role="row">
                                        <th>Role</th>
                                        <th>Price</th>
                                        <th>Prerequisite</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roleList}
                                </tbody>
                            </table>
                            <button type="submit" className="btn btn-success">Update</button>
                        </form>
                    </div>
                </div>
            </div>
            </div>
            </div>);
    }
}

module.exports = commands;