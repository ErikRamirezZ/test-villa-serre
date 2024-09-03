import { LitElement, html, css } from 'lit';
import { viewCSS } from '../css.js';
import { axiosGetOnlyAll, axiosPost } from '../api-connector/connector.js';
import { columnBodyRenderer, columnHeaderRenderer } from '@vaadin/grid/lit.js'
import { dialogRenderer } from '@vaadin/dialog/lit'

import '@vaadin/button'
import '@vaadin/date-picker'
import '@vaadin/dialog'
import '@vaadin/email-field'
import '@vaadin/grid'
import '@vaadin/grid/vaadin-grid-column'
import '@vaadin/text-field'
import '@vaadin/vertical-layout'

export class UserList extends LitElement {
  
  static styles = [viewCSS,
    css`
      :host {
        display: block;
      }
    `
  ];

  static properties = {
    users: { type: Array },
    selectedItem: { type: Object },
  };

  constructor() {
    super();
    this.users = [];
  }

  firstUpdated() {
    this._findUsers();
  }

  render() {
    return html`
      <div class="t-card">
        <h3>Lista de Usuarios</h3>
        <vaadin-grid .items="${this.users}" all-rows-visible>
          <vaadin-grid-column resizable path="idusuario" header="ID"></vaadin-grid-column>
          <vaadin-grid-column resizable path="nombre" header="Nombre"></vaadin-grid-column>
          <vaadin-grid-column resizable path="paterno" header="Paterno"></vaadin-grid-column>
          <vaadin-grid-column resizable path="materno" header="Materno"></vaadin-grid-column>
          <vaadin-grid-column resizable path="correo" header="Correo"></vaadin-grid-column>
          <vaadin-grid-column resizable path="fecharegistro" header="Fecha de registro"></vaadin-grid-column>
          <vaadin-grid-column resizable path="estatus" header="Estatus"></vaadin-grid-column>
          <vaadin-grid-column frozen-to-end
            ${columnBodyRenderer((item, model, column) => html`
              <vaadin-button @click="${() => this._edit(item)}">Editar</vaadin-button>
            `)}
            ${columnHeaderRenderer(column => html`
              <vaadin-button theme="primary" @click="${this._newUser}">Nuevo Usuario</vaadin-button>
            `)}
          ></vaadin-grid-column>
        </vaadin-grid>
      </div>

      <vaadin-dialog id="dlg" ${dialogRenderer(this._dlgRender)}>
      </vaadin-dialog>
    `;
  }

  _edit(item) {
    this.selectedItem = item;
    console.log('this.selectedItem:', this.selectedItem);
    let dlg = this.shadowRoot.querySelector('#dlg')
    dlg.headerTitle = 'Editar Usuario';
    dlg.opened = true;
  }

  _dlgRender = dlg => html`
    <vaadin-vertical-layout>
      <vaadin-text-field required id="name" label="Nombre" value="${this.selectedItem?.nombre}"></vaadin-text-field>
      <vaadin-text-field required id="lastname" label="Paterno" value="${this.selectedItem?.paterno}"></vaadin-text-field>
      <vaadin-text-field required id="secondLastname" label="Materno" value="${this.selectedItem?.materno}"></vaadin-text-field>
      <!-- REQUERIMIENTOS FUNCIONALES -->
      <!-- Parte 2: Validaciones del Formulario de Usuarios -->
      <!-- Validación de Correo Electrónico: Verificar que el correo electrónico tenga un formato válido. -->
      <vaadin-email-field required id="email" label="Correo" value="${this.selectedItem?.correo}"></vaadin-email-field>
      <!-- Validación de Fecha de Registro: Asegurar que la fecha de registro sea una fecha válida y no futura. -->
      <vaadin-date-picker required id="date" label="Fecha de registro" max="${new Date().toISOString().split('T')[0]}"
        value="${this.selectedItem?.fecharegistro || new Date().toISOString().split('T')[0]}"></vaadin-date-picker>
    </vaadin-vertical-layout>
    <vaadin-button theme="primary" @click="${this._save}">Guardar</vaadin-button>
    <vaadin-button @click="${() => dlg.opened = false}">Cancelar</vaadin-button>
  `;

  _findUsers() {
    axiosGetOnlyAll('usuario', (response) => {
      this.users = response;
    });
  }

  _newUser() {
    this.selectedItem = null;
    let dlg = this.shadowRoot.querySelector('#dlg')
    dlg.headerTitle = 'Nuevo Usuario';
    dlg.opened = true;
  }

  _save() {
    let name = document.getElementById('name');
    let lastname = document.getElementById('lastname');
    let secondLastname = document.getElementById('secondLastname');
    let email = document.getElementById('email');
    let date = document.getElementById('date');

    // REQUERIMIENTOS FUNCIONALES
    // Parte 2
    // Validación de Campos Vacíos: Todos los campos deben ser obligatorios y nodeben estar vacíos. 
    if (!name.validate() || !lastname.validate() || !secondLastname.validate() || !date.validate()) {
      return alert('Los campos con * son requeridos');
    }

    // Validación de Correo Electrónico: Verificar que el correo electrónico tenga un formato válido.
    if(!email.validate()) {
      return alert('Favor de ingresar un correo válido');
    }

    // Validación de Fecha de Registro: Asegurar que la fecha de registro sea una fecha válida y no futura. 
    let dateValue = new Date(date.value);
    if(dateValue > new Date()) {
      return alert('La fecha de registro no puede ser futura');
    }

    // create object
    let newUser = {
      nombre: name.value,
      paterno: lastname.value,
      materno: secondLastname.value,
      correo: email.value,
      fecharegistro: date.value,
      estatus: this.selectedItem ? this.selectedItem.estatus : 1,
    };

    if(this.selectedItem) {
      newUser.idusuario = this.selectedItem.idusuario;
      axiosPost('usuario', newUser, (response) => {
        if(response) {
          alert('Usuario actualizado correctamente');
          this._findUsers();
          this.shadowRoot.querySelector('#dlg').opened = false;
        } else {
          alert('Problemas al intentar actualizar el usuario');
        }
      });
    } else {
      axiosPost('usuario', newUser, (response) => {
        if(response) {
          alert('Usuario guardado correctamente');
          this._findUsers();
          this.shadowRoot.querySelector('#dlg').opened = false;
        } else {
          alert('Problemas al intentar guardar el usuario');
        }
      });
    }
  }
}
customElements.define('user-list', UserList);
