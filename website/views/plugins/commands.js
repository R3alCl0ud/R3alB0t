const React = require('react');

class commands extends React.Component {
    render() {
        let commands = [];
        
        this.props.commands.forEach((command, index) => {
            const test = `\n$('#edit_${command.title}').click(function() {\n $('#${command.title}').submit() \n})`
            if ((index + 1) % 2 == 0) {
                commands.push(<tr className="even" role="row">
                        <td>{command.title}</td>
                        <td>
                            <form action={`/dashboard/guild/${this.props.guild}/command/add?edit=1`} method="post" id={command.title}>
                                <input name="title" type="hidden" value={command.title}/>
                                <textarea className="form-control" name="message" rows="3" style={{resize: "vertical"}} defaultValue={command.message}></textarea>
                            </form>
                        </td>
                        <td>
                            <a href="#" id={`edit_${command.title}`} className="btn blue">Edit</a>
                            <a className="btn dark" href={`/dashboard/guild/${this.props.guild}/command/${command.title}/delete`}>Delete</a>
                        </td>
                        <script dangerouslySetInnerHTML={{__html: test}}/>
                    </tr>);
            } else { 
                commands.push(
                    <tr className="odd" role="row">
                        <td>{command.title}</td>
                        <td>
                            <form action={`/dashboard/guild/${this.props.guild}/command/add?edit=1`} method="post" id={command.title}>
                                <input name="title" type="hidden" value={command.title}/>
                                <textarea className="form-control" name="message" rows="3" style={{resize: "vertical"}} defaultValue={command.message}></textarea>
                            </form>
                        </td>
                        <td>
                            <a href="#" id={`edit_${command.title}`} className="btn blue">Edit</a>
                            <a className="btn dark" href={`/dashboard/guild/${this.props.guild}/command/${command.title}/delete`}>Delete</a>
                        </td>
                        <script dangerouslySetInnerHTML={{__html: test}}/>
                    </tr>);
            }
        })
    
        return (
            <div>
                <h1>Commands {this.props.enabled ? <a href={`/dashboard/guild/${this.props.guild}/plugin/custom/disable`} className="btn btn-warning">Disable</a> : <a href={`/dashboard/guild/${this.props.guild}/plugin/custom/enable`} className="btn btn-info">Enable</a>}</h1>
                <div className="row">
                    <div className="col-md-6">
                        <div className="portlet blue-hoki form-fit box">
                            <div className="portlet-title">
                                <div className="caption">
                                    <span className="caption-subject bold uppercase">Create Command</span>
                                </div>
                            </div>
                            <div className="portlet-body form">
                                <form id="command_form" method="post" action={`/dashboard/guild/${this.props.guild}/command/add`} className="form-horizontal form-bordered">
                                    <div className="form-body">
                                        <div className="form-group">
                                            <label className="control-label col-md-3">Title</label>
                                            <div className="col-md-4">
                                                <div className="input-group">
                                                    <input type="text" className="form-control" name="title" id="title_input"/>
                                                </div>
                                                <div className="help-block"> Type the name of the command</div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-md-3">Message</label>
                                            <div className="col-md-9">
                                                <textarea className="form-control autosizeme" rows="4" id="message_input" name="message"/>
                                                <div className="help-block"> Type the name of the command</div>
                                            </div>
                                        </div>
                                        <div className="form-actions">
                                            <div className="row">
                                                <div className="col-md-offset-3 col-md-9">
                                                    <button type="submit" className="btn red"><i className="fa fa-check"/> Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="portlet blue-hoki box">
                            <div className="portlet-title">
                                <div className="caption">
                                    <span className="caption-subject bold uppercase">Command List</span>
                                </div>
                            </div>
                        <div className="portlet-body">
                            <table id="commands" className="table table-striped table-bordered table-hover order-column dataTable no-footer" style={{minHeight: "200px"}}>
                                <thead>
                                <tr role="row">
                                    <th className="sorting" aria-controls="commands"><div className="dataTables_sizing">Name</div></th>
                                    <th className="sorting" aria-controls="commands"><div className="dataTables_sizing">Message</div></th>
                                    <th className="sorting" aria-controls="commands"><div className="dataTables_sizing">Actions</div></th>
                                </tr>
                                </thead>
                                <tbody>
                                    {commands}
                                </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                </div>
            </div>);
    }
}

module.exports = commands;