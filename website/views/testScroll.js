const React = require('react');
const Layout = require('./layout');
const UI = require('./components/UI');
const music = require('./plugins/music');

class testScroll extends React.Component {
  render() {
    let data = {
      tableTitle: "Test",
      tabs: [{ title:"Test", content:<h1>Just to make different</h1>}, {title:"Two", content:<div><h1>Test</h1></div>}]
    };

    return (
      <Layout {...this.props}>
          <div className="row">
              <div className="col-md-6 col-sm-6">
                <UI.tabbedTable {...data}/>
              </div>
              <div className="col-md-6 col-sm-6" style={{overflowX: "hidden"}}>
                  <img id="discord-img" />
                  <script type="text/javascript" src="https://beta.r3alb0t.xyz/scripts/hosts.js"></script>
              </div>
          </div>
      </Layout>
    );
  }
}

testScroll.propTypes = {
  title: React.PropTypes.string
};

module.exports = testScroll;
