import { css } from 'lit';

// Define a style for the view

export const viewCSS = css`
  .t-card { 
    height: 100%;
    margin: auto;
    padding: 1rem 2rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #eee;
    box-shadow: 0 0 15px rgba(0,0,0,0.1);
  }
  .t-margin-t1 { margin-top: 1rem; }
  .t-text-align-c { text-align: center; }
  .t-text-align-r { text-align: right }
  vaadin-select { width: 100%; }
  vaadin-number-field { width: 100%; }
`;