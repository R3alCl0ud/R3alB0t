const React = require('react');
const UI = require('../components/UI');

class Music extends React.Component {
    render() {
        let tracks = [];
        
        this.props.playlist.tracks.forEach((track, index) => {
            if ((index + 1) % 2 == 0) {
                tracks.push(<tr className="even" role="row">
                        <td>{index+1}</td>
                        <td>{track.title}</td>
                        <td>{track.requester || track.user}</td>
                        <td>{track.type}</td>
                    </tr>);
            } else { 
                tracks.push(<tr className="odd" role="row">
                        <td>{index+1}</td>
                        <td>{track.title}</td>
                        <td>{track.requester || track.user}</td>
                        <td>{track.type}</td>
                    </tr>);
            }
        });
        
        return (
            <div>
                <h1>Music {this.props.enabled ? <a href={`/dashboard/guild/${this.props.guild}/plugin/music/disable`} className="btn btn-warning">Disable</a> : <a href={`/dashboard/guild/${this.props.guild}/plugin/music/enable`} className="btn btn-info">Enable</a>}</h1>
                <div className="row">
                    <div className="col-md-8">
                        <div className="portlet blue-hoki box">
                            <div className="portlet-title">
                                <div className="caption">
                                    <span className="caption-subject bold uppercase">Current Playlist</span>
                                </div>                        
                            </div>
                            <div className="portlet-body">
                                <div className="table-scrollable">
                                    <div className="dataTables_scroll" style={{position:"relative", overflow:"hidden"}}>
                                        <div className="dataTables_scrollBody">
                                            <table id="playlist" className="table table-striped table-bordered table-hover order-column dataTable no-footer" style={{minHeight: "500px"}}>
                                                <thead>
                                                    <tr role="row">
                                                        <th className="sorting" aria-controls="playlist"><div className="dataTables_sizing">#</div></th>
                                                        <th className="sorting" aria-controls="playlist"><div className="dataTables_sizing">Song</div></th>
                                                        <th className="sorting" aria-controls="playlist"><div className="dataTables_sizing">Requester</div></th>
                                                        <th className="sorting" aria-controls="playlist"><div className="dataTables_sizing">Host</div></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tracks}
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
            );
    }
}

module.exports = Music;