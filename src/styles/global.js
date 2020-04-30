import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body, html {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif;
    text-rendering: optimizeLegibility !important;
    -webkit-font-smoothing: antialiased !important;
    height: 100%;
    width: 100%;
  }
  p {
    color: ${props => props.theme.colors.text};
  }
  .DayPickerInput {
    background-color: ${props => props.theme.colors.componentBackgroundColor};
    border-color: ${props => props.theme.colors.componentBorderColor};
  }
  .DayPickerInput-Overlay {
    background-color: ${props => props.theme.colors.componentBackgroundColor};
  }
  .DayPicker:not(.DayPicker--interactionDisabled) .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    background-color: ${props => props.theme.colors.componentDayPickerHover};
  }
  .DayPickerInput input {
    background-color: ${props => props.theme.colors.componentBackgroundColor};
    color: ${props => props.theme.colors.componentTextColor};
  }
  .react-time-picker__wrapper {
    background-color: ${props => props.theme.colors.componentBackgroundColor};
    border-color: ${props => props.theme.colors.componentBorderColor};
  }
  .react-time-picker__wrapper input {
    color: ${props => props.theme.colors.componentTextColor};
  }
  textarea.form-control {
    background-color: ${props => props.theme.colors.componentBackgroundColor};
    border-color: ${props => props.theme.colors.componentBorderColor};
    color: ${props => props.theme.colors.componentTextColor};
  }
  .form-control:focus {
    background-color: ${props => props.theme.colors.componentBackgroundColor};
    border-color: ${props => props.theme.colors.componentBorderColor};
    color: ${props => props.theme.colors.componentTextColor};
    box-shadow: ${props => props.theme.colors.componentBoxShadow};
  }
  .form-control::placeholder, input.form-control::placeholder {
    color: ${props => props.theme.colors.componentPlaceholderColor};
  }
  .form-control:disabled, .form-control[readonly] {
    background-color: ${props => props.theme.colors.componentBackgroundColor};
    color: ${props => props.theme.colors.componentPlaceholder};
  }
  input.form-control {
    background-color: ${props => props.theme.colors.componentBackgroundColor};
    border-color: ${props => props.theme.colors.componentBorderColor};
    color: ${props => props.theme.colors.componentTextColor};
  }
  span.rw-i.rw-i-caret-down {
    color: ${props => props.theme.colors.componentTextColor};
  }
  

  .rw-combobox div input {
    background-color: ${props => props.theme.colors.componentBackgroundColor};
    border-color: ${props => props.theme.colors.componentBorderColor};
    color: ${props => props.theme.colors.componentTextColor};
  }
  .tam.form-control.rw-combobox.rw-widget {
    background-color: ${props => props.theme.colors.componentBackgroundCombobox};
  }
  .rw-popup ul {
    background-color: ${props => props.theme.colors.componentBackgroundColor};
    color: ${props => props.theme.colors.componentTextColor};
  }
  .rw-popup ul li {
    color: ${props => props.theme.colors.componentTextColor};
  }
  .rw-list-option.rw-state-focus {
    color: ${props => props.theme.colors.componentTextColor};
  }
  .rw-widget-container {
    border-color: ${props => props.theme.colors.componentBorderColor};
  }
  fieldset[disabled] .rw-widget-picker, .rw-state-disabled>.rw-widget-picker {
    background-color: ${props => props.theme.colors.componentBackgroundComboboxInput};
  }
  .rw-input[disabled], fieldset[disabled] .rw-input, span.rw-select.rw-select-bordered {
    background-color: ${props => props.theme.colors.componentBackgroundComboboxInput};
  }
  .rw-widget-picker.rw-widget-container {
    background-color: ${props => props.theme.colors.componentBackgroundComboboxInput};
  }
  ::-webkit-input-placeholder {
    color: ${props => props.theme.colors.componentPlaceholderColor};
 }
`;