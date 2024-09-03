import { LitElement, html, css } from 'lit';
import { viewCSS } from './css.js';

import '@vaadin/button'

export class PruebaVillaSerre extends LitElement {

  static properties = {
    title: { type: String },
    selectedView: { type: Number },
  }

  static styles = [viewCSS, css`
    :host {
      display: block;
    }
    .t-card { width: 350px; }
  `];


  constructor() {
    super();
    this.title = 'VillaSerre Test';
    this.selectedView = 0;
  }

  updated(changedProperties) {
    if (changedProperties.has('selectedView')) {
      if(this.selectedView === 1) { 
        // REQUERIMIENTOS TÉCNICOS ADICIONALES 
        // 3.3 Optimización de Carga de Recursos 
        // lazy loading of order form
        import('./components/purchase-order-form.js')
        .then(() => this.requestUpdate())
        .catch(error => console.error(error));
      } else if(this.selectedView === 2) { 
        // REQUERIMIENTOS TÉCNICOS ADICIONALES 
        // 3.3 Optimización de Carga de Recursos 
        // lazy loading of order list
        import('./components/purchase-order-list.js')
        .then(() => this.requestUpdate())
        .catch(error => console.error(error));
      } else if(this.selectedView === 3) { 
        // REQUERIMIENTOS TÉCNICOS ADICIONALES 
        // 3.3 Optimización de Carga de Recursos 
        // lazy loading of users
        import('./components/user-list.js')
        .then(() => this.requestUpdate())
        .catch(error => console.error(error));
      }
    }
  }

  render() {
    return html`
      ${this.selectedView === 0 ? html`
        <div class="t-card t-margin-t1 t-text-align-c">
          <h1>Bienvenido a la Prueba Villa Serre</h1>
          <vaadin-button theme="primary" 
            @click="${() => this.selectedView = 1}">Crear Orden de Compra</vaadin-button>
          <vaadin-button theme="primary" 
            @click="${() => this.selectedView = 2}">Listar Ordenes de Compra</vaadin-button>
          <vaadin-button theme="primary" 
            @click="${() => this.selectedView = 3}">Usuarios</vaadin-button>
        </div>
        ` 
        : ''
      }
      ${this.selectedView === 1 ? html`<purchase-order-form 
        @changeView="${e => this.selectedView = e.detail}"></purchase-order-form>` : ''}
      ${this.selectedView === 2 ? html`<purchase-order-list 
        @changeView="${e => this.selectedView = e.detail}"></purchase-order-list>` : ''}
      ${this.selectedView === 3 ? html`<user-list 
        @changeView="${e => this.selectedView = e.detail}"></user-list>` : ''}
    `;
  }

}
