import React, {Component} from "react";


export default class DisplayEntry extends Component {
    constructor(props) {
        super(props);
    }

    generateLabel = (clazz, field, color, font) => {
        return (<div className={clazz}>
                <label style={{color: color, fontWeight: font }} htmlFor={field}>{`${field}`}</label>
            </div>
        )
    }

    generateDisplay = () => {
        return <div className={"display-entry"}>
            <ul>
                {Object.entries(this.props.data).map(([k, v]) =>
                    <li>
                        {this.generateLabel("field", k+` :`, "blue")}
                        {this.generateLabel("value", v, "green")}
                    </li>
                )}
            </ul>
        </div>
    }

    render() {
        return this.generateDisplay();
    }
}