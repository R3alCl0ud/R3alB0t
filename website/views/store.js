const React = require('react');
const Layout = require('./layout');

class Store extends React.Component {
    render() {
        return (<Layout {...this.props}>
            <div className="row">           
                <center><h1>Come Back Later!</h1></center>
            </div>
        </Layout>)
    }
}

module.exports = Store;