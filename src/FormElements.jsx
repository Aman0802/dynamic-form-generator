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

import "./FormElements.css";

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
  const { placeholder } = props;
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
    const isRepeated =
      selectedOptions.filter(
        (selectedOption) => selectedOption.id === optionToAdd.id
      ).length >= 1;
    !isRepeated && setSelectedOptions([...selectedOptions, optionToAdd]);
  };

  const removeOption = (option) => {
    setSelectedOptions(
      selectedOptions.filter(
        (selectedOption) => selectedOption.id !== option.id
      )
    );
  };

  const filterOptions = (optionsToFilter, searchText) => {
    if (!searchText) {
      return optionsToFilter;
    }
    return optionsToFilter.filter((optionToSearch) =>
      optionToSearch.value.toLowerCase().includes(searchText)
    );
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
    setVisibleOptions(filterOptions(options, e.target.value));
  };

  return (
    <div className="multiselect-container">
      <div
        className="multiselect"
        // onClick={() => setIsSelectOpen(!isSelectOpen)}
      >
        {selectedOptions && (
          <div className="selected-options">
            {selectedOptions?.map((selectedOption) => (
              <span className="selected-option">
                {selectedOption.value}
                <span
                  className="cross-btn"
                  onClick={() => removeOption(selectedOption)}
                >
                  x
                </span>
              </span>
            ))}
          </div>
        )}
        <input
          type="text"
          className="multiselect-input"
          value={searchText}
          onChange={handleChange}
          onFocus={() => setIsSelectOpen(true)}
          onBlur={() => setIsSelectOpen(false)}
          placeholder={placeholder}
        />
        <button
          onClick={() => setIsSelectOpen(!isSelectOpen)}
          onFocus={() => setIsSelectOpen(true)}
          onBlur={() => setIsSelectOpen(false)}
        >
          v
        </button>
      </div>
      {isSelectOpen && (
        <div className="multiselect-dropdown">
          <ul className="list">
            {visibleOptions?.map((option) => (
              <li className="list-item" onClick={() => addOption(option)}>
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
