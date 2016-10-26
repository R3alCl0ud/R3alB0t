const React = require("react");

class scrollItem extends React.Component {
    render() {
        
        let props = [];
            
        for (const itemProp of this.props.itemProps) {
            props.push(<span className="item-name">{itemProp.name}</span>);
        }
        
        
        
        return (<div className="item">
                <div className="item-head">
                    <div className="item-details">
                        <span className="item-name">{this.props.name}</span>
                    </div>
                </div>
                <div className="item-body">
                    {props}
                </div>
            </div>
            );
    }
}


class scrollTable extends React.Component {
    render() {
        let itemList = [];
        
        for (const item of this.props.items) {
            itemList.push(<scrollItem {...item}/>);
        }
        
        return (
            <div className="portlet light ">
                <div className="portlet-title">
                    <div className="caption caption-md">
                        <span className="caption-subject font-blue-madison bold uppercase">{this.props.title}</span>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="scroller" style={{height: `${this.props.height || 305}px`, overflow: "hidden", width: "auto"}} data-always-visible="1" data-rail-visible1="0" data-handle-color="#D7DCE2">
                        <div className="general-item-list">
                            {itemList}
                        </div>
                    </div>
                </div>
            </div>)
    }
}

class tabbedTable extends React.Component {
    render() {
        let tabsTitles = [];
        let tabs = [];
        
        for (let i = this.props.tabs.length - 1; i > -1; i--) {
            
            if (i == this.props.tabs.length - 1) {
                tabsTitles.push(<li className="active"><a href={`#tab_${this.props.tabs[i].title.split(" ").join("_").toLowerCase()}_${i}`} data-toggle="tab" aria-expanded="false">{this.props.tabs[i].title}</a></li>);
                tabs.push(<div className="tab-pane active" id={`tab_${this.props.tabs[i].title.split(" ").join("_").toLowerCase()}_${i}`}>{this.props.tabs[i].content}</div>)
            } else {
                tabsTitles.push(<li><a href={`#tab_${this.props.tabs[i].title.split(" ").join("_").toLowerCase()}_${i}`} data-toggle="tab" aria-expanded="false">{this.props.tabs[i].title}</a></li>);
                tabs.push(<div className="tab-pane" id={`tab_${this.props.tabs[i].title.split(" ").join("_").toLowerCase()}_${i}`}>{this.props.tabs[i].content}</div>)
            }
        }
        
        return (<div className="portlet light">
            <div className="portlet-title tabbable-line">
                <div className="caption">
                    <span className="caption-subject font-green-steel bold uppercase">{this.props.tableTitle}</span>
                </div>
                <ul className="nav nav-tabs">
                    {tabsTitles}
                </ul>
            </div>
            <div className="portlet-body">
                <div className="tab-content">
                    {tabs}
                </div>
            </div>
        </div>);
    }
}

exports.scrollTable = scrollTable;
exports.tabbedTable = tabbedTable;