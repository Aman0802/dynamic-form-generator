import React, { useState } from "react";
import {
  Formik,
  Form as FormikForm,
  Field,
  ErrorMessage,
  useFormikContext,
  useField,
  useFormik,
} from "formik";

import './FormElements.css'

export function Form(props) {
  return (
    <Formik {...props}>
      <FormikForm className="needs-validation" novalidate="">
        {props.children}
      </FormikForm>
    </Formik>
  );
}

export function TextField(props) {
  const { name, label, placeholder, ...rest } = props;
  return (
    <>
      {label && <label for={name}>{label}</label>}
      <Field
        className="form-control"
        type="text"
        name={name}
        id={name}
        placeholder={placeholder || ""}
        {...rest}
      />
      <ErrorMessage
        name={name}
        render={(msg) => <div style={{ color: "red" }}>{msg}</div>}
      />
    </>
  );
}

export function SelectField(props) {
  const { name, label, options } = props;
  return (
    <>
      {label && <label for={name}>{label}</label>}
      <Field as="select" id={name} name={name}>
        <option value="">Choose...</option>
        {options.map((optn, index) => (
          <option value={optn.value} label={optn.label || optn.value} />
        ))}
      </Field>
      <ErrorMessage
        name={name}
        render={(msg) => <div style={{ color: "red" }}>{msg}</div>}
      />
    </>
  );
}

function ListItem(props) {
  const { key, index, className, value, selected, selectedIndexesCallback } =
    props;
  const [itemselected, setItemSelected] = useState(selected);

  const handleClick = () => {
    if (typeof selectedIndexesCallback === "function") {
      selectedIndexesCallback(index);
    }
    setItemSelected(!itemselected);
  };
  return (
    <div>
      <li onClick={() => handleClick()} className={className}>
        {value}
      </li>
    </div>
  );
}

export function MultiSelect(props) {
  const {label}=props;
  const [searchText, setSearchText] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([
    {
      id: 1,
      value: "blue",
    },
    {
      id: 2,
      value: "red",
    },
  ]);
  const [visibleOptions, setVisibleOptions] = useState(options);

  const addOption = (optionToAdd) => {
    setOptions(options.filter((option) => option.id !== optionToAdd.id));
    setSelectedOptions([...selectedOptions, optionToAdd]);
  };

  const removeOption = (option) => {
    setOptions([...options, option]);
    setSelectedOptions(
      selectedOptions.filter(
        (selectedOption) => selectedOption.id !== option.id
      )
    );
  };

  const filterOptions = (options, searchText) => {
    if (!searchText) {
      return options;
    }
    return options.filter((option) =>
      option.value.toLowerCase().includes(searchText)
    );
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
    console.log(filterOptions(options, e.target.value));
    setVisibleOptions(filterOptions(options, e.target.value));
  };

  return (
    <div className="multiselect-container">
      <div
        className="multiselect"
        onClick={() => setIsSelectOpen(!isSelectOpen)}
      >
        {selectedOptions &&
        (<div className="selected-options">
          {selectedOptions?.map((selectedOption) => (
          <span
            className="selected-option"
          >
            {selectedOption.value}
            <span
              className="cross-btn"
              onClick={() => removeOption(selectedOption)}
            >
              x
            </span>
          </span>
        ))}
        </div>)
        }
        <input type="text" className="multiselect-input" value={searchText} onChange={handleChange}  placeholder={label}/>
      </div>
      {isSelectOpen && (
        <div
          className="multiselect-dropdown"
        >
          <ul className="list">
            {visibleOptions?.map((option) => (
              <li
                className="list-item"
                onClick={() => addOption(option)}
              >
                {option.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function SubmitButton(props) {
  const { title, ...rest } = props;
  const { isSubmitting } = useFormikContext();

  return (
    <button type="submit" {...rest} disabled={isSubmitting}>
      {title}
    </button>
  );
}
