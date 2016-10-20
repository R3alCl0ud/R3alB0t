var React = require('react');
var ReactDOMServer = require('react-dom/server');
var UI = require('../public/components/UI');
var Navigator = require('../lib/navHelper');


class Layout extends React.Component {
    render() {
        // var nav = ReactDOMServer.renderToStaticMarkup(<UI {...Navigator.userNav(this.props.user ? this.props.user : null)}/>)
        var initScript = 'main(' + JSON.stringify(Navigator.userNav(this.props.user ? this.props.user : null, this.props.page)) + ')';

        return (
            <div className="page-wrapper">
                <div id="navbar" className="navbar-fixed-top page-header navbar"/>
                <div className="page-container">
                    <div id="sidebar" className="page-sidebar-wrapper"></div>
                    <div className="page-content-wrapper">
                        <div className="page-content">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>);
    }
}

Layout.propTypes = {
    title: React.PropTypes.string
};

module.exports = Layout;
