const React = require('react');

class Page extends React.Component {
    render() {
        return (
            <html>
                <head>
                    <meta charset="utf-8"></meta>
                    <meta name="description" content="R3alB0at - Welcome to the Beta Test!"/>
                    <meta content="&copy;R3alCl0ud 2015-2016" name="author" />
                    <title>{this.props.title}</title>
                    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
                    <meta content="width=device-width, initial-scale=1" name="viewport" />
	                <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css" />
	                <link href="/assets/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
	                <link href="/assets/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css" />
	                <link href="/assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
	                <link href="/assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css" />
	                <link href="/assets/global/plugins/bootstrap-daterangepicker/daterangepicker.min.css" rel="stylesheet" type="text/css" />
	                <link href="/assets/global/plugins/morris/morris.css" rel="stylesheet" type="text/css" />
	                <link href="/assets/global/plugins/fullcalendar/fullcalendar.min.css" rel="stylesheet" type="text/css" />
	                <link href="/assets/global/plugins/jqvmap/jqvmap/jqvmap.css" rel="stylesheet" type="text/css" />
	                <link href="/assets/global/css/components-md.min.css" rel="stylesheet" id="style_components" type="text/css" />
	                <link href="/assets/global/css/plugins-md.min.css" rel="stylesheet" type="text/css" />
	                <link href="/assets/pages/css/profile.min.css" rel="stylesheet" type="text/css" />
	                <link href="/assets/layouts/layout3/css/layout.min.css" rel="stylesheet" type="text/css" />
	                <link href="/assets/layouts/layout3/css/themes/default.min.css" rel="stylesheet" type="text/css" id="style_color" />
	                <link href="/assets/layouts/layout3/css/custom.min.css" rel="stylesheet" type="text/css" />
	                <link href="/css/custom.min.css" rel="stylesheet" type="text/css" />
	                <link rel="shortcut icon" href="favicon.ico" />
	                <script src="/assets/global/plugins/jquery.min.js" type="text/javascript"></script>
                </head>
                <body className="page-md page-header-menu-fixed">
                    {this.props.children}
        			<script src="/assets/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/js.cookie.min.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/moment.min.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/bootstrap-daterangepicker/daterangepicker.min.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/morris/morris.min.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/morris/raphael-min.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/counterup/jquery.waypoints.min.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/counterup/jquery.counterup.min.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/fullcalendar/fullcalendar.min.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/flot/jquery.flot.min.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/flot/jquery.flot.resize.min.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/flot/jquery.flot.categories.min.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/jquery-easypiechart/jquery.easypiechart.min.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/jquery.sparkline.min.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/jqvmap/jqvmap/jquery.vmap.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.russia.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.world.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.europe.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.germany.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.usa.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/jqvmap/jqvmap/data/jquery.vmap.sampledata.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/datatables/datatables.min.js" type="text/javascript"></script>
        			<script src="/assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.js" type="text/javascript"></script>
        			<script src="/assets/global/scripts/app.min.js" type="text/javascript"></script>
        			<script src="/assets/pages/scripts/dashboard.min.js" type="text/javascript"></script>
        			<script type="text/javascript" src="https://beta.r3alb0t.xyz/scripts/hosts.js"></script>
        			<script src="/assets/layouts/layout3/scripts/layout.min.js" type="text/javascript"></script>
        			<script src="/assets/layouts/layout3/scripts/demo.min.js" type="text/javascript"></script>
        			<script src="/assets/layouts/global/scripts/quick-sidebar.min.js" type="text/javascript"></script>
        			<script src="/assets/layouts/global/scripts/quick-nav.min.js" type="text/javascript"></script>
                </body>
            </html>)
    }
}

Page.propTypes = {
    title: React.PropTypes.string
};

module.exports = Page;
