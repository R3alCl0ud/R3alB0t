const React = require('react');
const Layout = require('./layout');

class IndexOLD extends React.Component {
  render() {
    return (
      <Layout {...this.props}>
        <div className="row">
          <div className="col-md-6 col-sm-6">
            <h1>Just Checking</h1>
            <p>Another for testing, but for now, enjoy some musica. :)</p>
            <iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/54080563&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>
            <div className="container center-block">
              <h2 class="font-green-sharp">R3alB0t Official Discord</h2>
              <p>
                <form action="https://discord.me/r3alb0t" method="GET">
                  <span className="input-group-btn">
                    <button className="btn btn-primary" id="btn-discord-add" type="submit">CLICK HERE</button>
                  </span>
                </form>
              </p>
            </div>
          </div>
          <div className="col-md-6 col-sm-6" style={{overflowX: "hidden"}}>
            <img id="discord-img" />
            <script type="text/javascript" src="https://beta.r3alb0t.xyz/scripts/hosts.js"></script>
          </div>
        </div>
        <link href="/css/index.css" rel="stylesheet" type="text/css" />
      </Layout>
    );
  }
}

class Index extends React.Component {
  render() {
    return (
      <Layout {...this.props}>
        <div className="row">
          <center>
            <img src="/images/logo_color.png" style={{height: "65px"}}/><h1 style={{fontSize: "55px"}}>The<img src="/images/discord/Wordmark/Black/Discord-Wordmark-Black.png" style={{height: "65px", verticalAlign: "text-bottom"}}/>Bot Made For Users, By Users</h1>
          </center>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="portlet blue-hoki box">
              <div className="portlet-title">
                <div className="caption">
                  <span className="caption-subject bold uppercase">Official Server</span>
                </div>
              </div>
              <div className="portlet-body">
                <div className="container center-block">
                  
                    <form action="https://discord.me/r3alb0t" method="GET">
                      <span className="input-group-btn">
                        <h1 class="font-green-sharp">R3alB0t Official Discord <button className="btn btn-primary" id="btn-discord-add" type="submit">CLICK HERE</button></h1>
                      </span>
                    </form>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="portlet blue-hoki box">
              <div className="portlet-title">
                <div className="caption">
                  <span className="caption-subject bold uppercase">Add R3alB0t</span>
                </div>
              </div>
              <div className="portlet-body">
                <h1>Add some R3al to your server <a href="/auth/login" className="btn btn-info">Add To Discord</a></h1>
              </div>
            </div>
          </div>
        </div>
        <link href="/css/index.css" rel="stylesheet" type="text/css" />
      </Layout>
    );
  }
}

Index.propTypes = {
  title: React.PropTypes.string
};

module.exports = Index;
