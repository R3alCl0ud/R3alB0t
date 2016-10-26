const React = require('react');
const TopNav = require("./components/MatTopNav");
const Home = require('./index');
const Dashboard = require('./dashboard');
const ErrPage = require('./errPage');
const Profile = require('./profile');
const Server = require('./server');
const Page = require('./page');

const pages = {
    Dashboard: props => <Dashboard {...props}/>,
    Home: props => <Home {...props}/>,
    error: props => <ErrPage {...props}/>,
    Profile: props => <Profile {...props}/>,
    Server: props => <Server {...props}/>
};

function getPage (page, props) {
    if (pages.hasOwnProperty(page))
        return pages[page](props)
    else 
        return ""
}

class TestBody extends React.Component {
    render() {
        return this.props.isCollapsed ? <div className="page-header-fixed page-sidebar-closed-hide-logo page-content-white page-sidebar-closed">
        {this.props.children}
        </div> : <div className="page-header-fixed page-sidebar-closed-hide-logo page-content-white">
        {this.props.children}
        </div>
    }
}

class Layout extends React.Component {
    render() {
        return this.props.user ? (
            <Page title={this.props.title}>
            <div className="page-wrapper">
                <div className="page-wrapper-row">
                    <div className="page-header">
                     <TopNav.userNav user={this.props.user}/>
                     <TopNav.menuNav {...this.props}/>
                    </div>
                </div>
                <div className="page-wrapper-row full-height">
                    <div className="page-wrapper-middle">
                        <div className="page-container">
                            <div className="page-content-wrapper">
                                <div className="page-head">
                                    <div className="container-fluid">
                                        <div className="page-title">
                                            <h1>{this.props.page.name}
                                                <small>{this.props.page.desc}</small>
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                                <div className="page-content">
                                    <div className="container-fluid">
                                        <div className="page-content-inner">
                                            {this.props.children}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-wrapper-row">
                    <div className="page-wrapper-bottom">
                        <div className="page-prefooter">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-3 col-sm-6 col-xs-12 footer-block">
                                        <h2>About</h2>
                                        <p> R3alB0t is a extensible, community made bot. Want the source? Get it <a href="https://github.com/R3alCl0ud/R3alB0t"><u>HERE</u></a>!</p>
                                    </div>
                                    <div className="col-md-3 col-sm-6 col-xs-12 footer-block">
                                        <h2>Help Wanted</h2>
                                        <p>Want to directly support the project? Make a donation to help speed development, and help us host servers for R3alB0t, meaning less &quot;lag&quot; and more features!</p>
                                        <p>
                                            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                                                <input type="hidden" name="cmd" value="_s-xclick" />
                                                <input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----MIIHLwYJKoZIhvcNAQcEoIIHIDCCBxwCAQExggEwMIIBLAIBADCBlDCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20CAQAwDQYJKoZIhvcNAQEBBQAEgYCZJ3MttRnoxjihDfv44MEODfU8XKM7JJNzkAn0rpOvvkWGhFtzdWG7gvzXYzHMaqGJdrEEvnd6Hp67XX0g7hjKYDS1+fsrjidRCarHjVx6K677tYI481ltxgUONaZsRz6mgmlJMa9cO9AiiPNqtl95ZnqhMec+SveeSJdKCDerxjELMAkGBSsOAwIaBQAwgawGCSqGSIb3DQEHATAUBggqhkiG9w0DBwQI6yoCSWpHnSKAgYgwj8n3mLjkEDSYyvT9ABhc0iG5z7h5ndQownzsqmbKI8mWD9PqP1ekfX1V2qthAg6L95Gj0lPipdXcYnO8029wjAaV+VPA5cToW+oK6PQJh1+vjNjbwiJE1YAVK0cvNSCJKo3te+J6EcYhTAaWHOvuAqCHeYV6z186oZwXJ6+KVorxPzLLsS6WoIIDhzCCA4MwggLsoAMCAQICAQAwDQYJKoZIhvcNAQEFBQAwgY4xCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNTW91bnRhaW4gVmlldzEUMBIGA1UEChMLUGF5UGFsIEluYy4xEzARBgNVBAsUCmxpdmVfY2VydHMxETAPBgNVBAMUCGxpdmVfYXBpMRwwGgYJKoZIhvcNAQkBFg1yZUBwYXlwYWwuY29tMB4XDTA0MDIxMzEwMTMxNVoXDTM1MDIxMzEwMTMxNVowgY4xCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNTW91bnRhaW4gVmlldzEUMBIGA1UEChMLUGF5UGFsIEluYy4xEzARBgNVBAsUCmxpdmVfY2VydHMxETAPBgNVBAMUCGxpdmVfYXBpMRwwGgYJKoZIhvcNAQkBFg1yZUBwYXlwYWwuY29tMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBR07d/ETMS1ycjtkpkvjXZe9k+6CieLuLsPumsJ7QC1odNz3sJiCbs2wC0nLE0uLGaEtXynIgRqIddYCHx88pb5HTXv4SZeuv0Rqq4+axW9PLAAATU8w04qqjaSXgbGLP3NmohqM6bV9kZZwZLR/klDaQGo1u9uDb9lr4Yn+rBQIDAQABo4HuMIHrMB0GA1UdDgQWBBSWn3y7xm8XvVk/UtcKG+wQ1mSUazCBuwYDVR0jBIGzMIGwgBSWn3y7xm8XvVk/UtcKG+wQ1mSUa6GBlKSBkTCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb22CAQAwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQUFAAOBgQCBXzpWmoBa5e9fo6ujionW1hUhPkOBakTr3YCDjbYfvJEiv/2P+IobhOGJr85+XHhN0v4gUkEDI8r2/rNk1m0GA8HKddvTjyGw/XqXa+LSTlDYkqI8OwR8GEYj4efEtcRpRYBxV8KxAW93YDWzFGvruKnnLbDAF6VR5w/cCMn5hzGCAZowggGWAgEBMIGUMIGOMQswCQYDVQQGEwJVUzELMAkGA1UECBMCQ0ExFjAUBgNVBAcTDU1vdW50YWluIFZpZXcxFDASBgNVBAoTC1BheVBhbCBJbmMuMRMwEQYDVQQLFApsaXZlX2NlcnRzMREwDwYDVQQDFAhsaXZlX2FwaTEcMBoGCSqGSIb3DQEJARYNcmVAcGF5cGFsLmNvbQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMTYwOTEwMDUxMzE0WjAjBgkqhkiG9w0BCQQxFgQUTTakB9/+YjQOdoEGC9Tc8xhlsiIwDQYJKoZIhvcNAQEBBQAEgYCecrSFqRMvMaGEKUZ5Rd+YG3eyJZv87F8vlXpinYOA+GhUqsRwVstfoJIgY6SuGZSVk9izZiV5atfx45uIPhvwhmxZ4dA7QPprl9FODwq0rmn/V16XU/xeSLS3s0g4FQlKl4LVc/MkNYFgV7p8Y4NnK34FfcsLzjb7ReZdjvv8RQ==-----END PKCS7-----" />
                                                <span className="input-group-btn center-block">
                                                    <button type="submit" id="btn-submit" className="btn">Donate</button>
                                                </span>
                                            </form>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>    
                    </div>
                </div>
            </div>
            </Page>) : (<Page title={this.props.title}>
            <div className="page-wrapper">
                <div className="page-wrapper-row">
                    <div className="page-header">
                        <TopNav.topNav/>
                        <TopNav.menuNav {...this.props}/>
                     </div>
                </div>
                <div className="page-wrapper-row full-height">
                    <div className="page-wrapper-middle">
                        <div className="page-container">
                            <div className="page-content-wrapper">
                                <div className="page-head">
                                    <div className="container-fluid" >
                                        <div className="page-title">
                                            <h1>{this.props.page.name}
                                                <small>{this.props.page.desc}</small>
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                                <div className="page-content">
                                    <div className="container-fluid">
                                        <div className="page-content-inner">
                                            {this.props.children}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-wrapper-row">
                    <div className="page-wrapper-bottom">
                        <div className="page-prefooter">
                            <div className="container-fluid">
                                <div class="row">
                                    <div className="col-md-3 col-sm-6 col-xs-12 footer-block">
                                        <h2>About</h2>
                                        <p> R3alB0t is a extensible, community made bot. Want the source? Get it <a href="https://github.com/R3alCl0ud/R3alB0t"><u>HERE</u></a>!</p>
                                    </div>
                                    <div className="col-md-3 col-sm-6 col-xs-12 footer-block">
                                        <h2>Help Wanted</h2>
                                        <p>Want to directly support the project? Make a donation to help speed development, and help us host servers for R3alB0t, meaning less &quot;lag&quot; and more features!</p>
                                        <p>
                                            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                                                <input type="hidden" name="cmd" value="_s-xclick" />
                                                <input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----" />
                                                <span className="input-group-btn center-block">
                                                    <button type="submit" id="btn-submit" className="btn">Donate</button>
                                                </span>
                                            </form>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>    
                    </div>
                </div>
            </div>
            </Page>);
    }

}

Layout.propTypes = {
    title: React.PropTypes.string
};

module.exports = Layout;
