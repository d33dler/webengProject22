/**
 * Helper functions Javascript file
 */

import React from "react";
import {checkboxParams, rangeParams, textFieldParams} from "./params_field_types";
import {isUndefined} from "lodash";

/**
 *
 * @param fieldSet
 * @param defaultVal
 * @returns {{submitted: boolean}}
 */
export function newState(fieldSet, defaultVal) {
    let state = {submitted: false};
    for (let i = 0; i < fieldSet.length; i++) {
        state[`${fieldSet[i].id}`] = defaultVal;
    }
    return state;
}

export function handleCheckHook(comp, _compSetter, value, e) {
    comp[`${value}`] = e.target.checked;
    _compSetter(comp);
}

export function handleChangeHook(comp, _compSetter, value, e) {
    if (e.target.value.length !== 0) {
        comp[`${value}`] = e.target.value;
    } else delete comp[`${value}`];
    _compSetter(comp);
    console.log(comp);
}

export function handleChange(comp, value, event) {
    comp.setState({[`${value}`]: event.target.value});
}



export function generateDialogue( text) {
   return <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    {text}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>
}

export function renderField(params, id, fieldName, onChange, defaultValue = "") {
    return (
        <div className="form-group">
            <label style={{marginRight: params.marginRight}} id={fieldName} htmlFor={id}>{fieldName}</label>
            <input type={params.type === "range" ? "number" : params.type}
                   id={id}
                   defaultValue={defaultValue}
                   onChange={onChange}/>
        </div>
    );
}

export function stateful(fieldSet, defaultVal) {
    let state = {};
    for (let i = 0; i < fieldSet.length; i++) {
        state[`${fieldSet[i].id}`] = defaultVal;
    }
    return state;
}

export function createLabel(fieldName, tok) {
    return (<label id={fieldName} htmlFor={tok}>{fieldName}</label>)
}

export function generateForm(fields, inputs, setInputs, defaultValues = new URLSearchParams()) {
   return fields.map((field) => {
        const {
            name, id, type, options, values
        } = field;
        switch (type) {
            case 'text':
                return (renderField(textFieldParams, id, name,
                    (e => {
                        handleChangeHook(inputs, setInputs, id, e)
                    }), defaultValues.get(`${id}`)))
            case 'range':
                return renderRangeInput(id, inputs, setInputs, name, defaultValues)
            case 'checkbox':
                if(isUndefined(inputs[id])) inputs[id] = false;
                return (renderField(checkboxParams, id, name,
                    (e => handleCheckHook(inputs, setInputs, id, e))));
            case 'radio':
                return (renderRadioHook(id, inputs, setInputs, values, options, name, defaultValues))
            default:
                return null;
        }
    })
}

export function generateButton(label, _func ) {
    return  <button
        className="btn btn-outline-secondary"
        type="button"
        onClick={_func}
    >{label}
    </button>
}


export function renderRangeInput(id, value, valueSetter, label, defaultValues = new URLSearchParams()) {
    const id_min = id + "_min";
    const id_max = id + "_max";
    return (
        <section class="mb-lg-2">
            <div className="d-flex align-items-center mt-sm-1 pb-1">
                <div className="md-form md-outline my-0">
                    {
                        renderField(rangeParams, id_min, label + ' min',
                            (event => handleChangeHook(value, valueSetter, id_min, event)), defaultValues.get(id_min))}
                </div>
                <div className="md-form md-outline my-0">
                    {
                        renderField(rangeParams, id_max, label + ' max',
                            (event => handleChangeHook(value, valueSetter, id_max, event)), defaultValues.get(id_max))}
                </div>
            </div>
        </section>
    )
}

export function renderRadioHook(id, value, valueSetter,values, options, label, defaultValue = new URLSearchParams()) {
    return (
        <>
            <div>
                <ul>
                    {createLabel(label, id)}
                    {options.map((o, ix) => (
                        <div className="form-group">
                            <input type="radio"
                                   id={`${id}_${o}`}
                                   name={id}
                                   defaultChecked={!isUndefined(defaultValue.get(`${id}`))
                                   && defaultValue.get(`${id}`) === values[ix] }
                                   value={values[ix]}
                                   onChange={(event => handleChangeHook(value, valueSetter, id, event))}
                            />
                            <label htmlFor={`${id}_${o}`}>{o}</label>
                        </div>
                    ))}
                </ul>
            </div>
        </>
    )
}

export function renderRadio(comp, id, fieldName, options, values) {
    return (
        <>
            <div>
                <ul>
                    {createLabel(fieldName, id)}
                    {options.map((o, ix) => (
                        <div className="form-group">
                            <input type="radio"
                                   id={`${id}_${o}`}
                                   value={values[ix]}
                                   onChange={(event => handleChange(comp, id, event))}
                                   checked={comp.state[`${id}`] == values[ix]}/>
                            <label htmlFor={`${id}_${o}`}>{o}</label>
                        </div>
                    ))}
                </ul>
            </div>
        </>
    )
}

