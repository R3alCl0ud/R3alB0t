const React = require('react');
const Layout = require('./layout');

class Music extends React.Component {
    render() {
        
        const tracks = [];
        
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
            <Layout {...this.props}>
                <div className="row">                
                    <div className="portlet blue-hoki form-fit box">
                        <div className="portlet-title">
                            <div className="caption">
                                <span className="caption-subject bold uppercase">Playlist</span>
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
            </Layout>)
    }
}

module.exports = Music;