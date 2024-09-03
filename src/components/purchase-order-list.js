import { LitElement, html, css } from 'lit';
import { viewCSS } from '../css.js';
import { axiosGetOnlyAll } from '../api-connector/connector.js';
import { columnBodyRenderer } from '@vaadin/grid/lit'

import '@vaadin/button'
import '@vaadin/grid'
import '@vaadin/grid/vaadin-grid-column'

export class PurchaseOrderList extends LitElement {

  static styles = [viewCSS, css`
    :host {
      display: block;
    }
  `];

  static properties = {
    orders: { type: Array },
    total: { type: Number },
    totalSmartphone: { type: Number },
  };

  constructor() {
    super();
    this.orders = [];
  }

  firstUpdated() {
    this._findOrders();
  }


  // ... tabla con las siguientes columnas:
  // - ID de la Orden
  // - Nombre del Usuario
  // - Nombre del Producto
  // - Categoría
  // - Cantidad
  // - Precio unitario
  // - Importe Total (Calculado cantidad * precio unitario)
  // - Fecha 

  render() {
    return html`
      <div class="t-card">
        <h3>Lista de Ordenes de Compra</h3>
        <vaadin-grid .items="${this.orders}">
          <vaadin-grid-column resizable path="idorden" header="ID"></vaadin-grid-column>
          <vaadin-grid-column resizable path="usuario.nombre" header="Usuario"></vaadin-grid-column>
          <vaadin-grid-column resizable path="producto.nombre" header="Producto"></vaadin-grid-column>
          <vaadin-grid-column resizable path="producto.categoria" header="Categoría"></vaadin-grid-column>
          <vaadin-grid-column resizable path="cantidad" header="Cantidad"></vaadin-grid-column>
          <vaadin-grid-column resizable header="Precio Unitario"
            ${columnBodyRenderer((item, model, column) => 
              new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.preciounitario))}
          ></vaadin-grid-column>
          <vaadin-grid-column header="Importe Total"
            ${columnBodyRenderer((item, model, column) => 
              new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.preciounitario * item.cantidad))}
          ></vaadin-grid-column>
          <vaadin-grid-column path="fecha" header="Fecha"></vaadin-grid-column>
        </vaadin-grid>
        <div class="t-text-align-r">
          <span class="total"><b>Total:</b> ${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(this.total)}</span>  
        </div>
        <div class="t-text-align-r">
          <span class="total"><b>Total Smartphones:</b> ${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(this.totalSmartphone)}</span>  
        </div>

        <div class="t-margin-t1 btns">
          <vaadin-button theme="primary" 
            @click="${() => this.dispatchEvent(new CustomEvent('changeView', {detail : 1}))}">Nueva orden</vaadin-button>
          <vaadin-button 
            @click="${() => this.dispatchEvent(new CustomEvent('changeView', {detail : 0}))}">
            Ir a inicio
          </vaadin-button>
        </div>
      </div>
    `;
  }

  _findOrders() {
    axiosGetOnlyAll('orden', orders => {
      this.orders = orders;

      // REQUERIMINTO FUNCIONAL
      // Gran Total: Suma de los importes totales de todos los productos (utilizar reduce). 
      this.total = orders.reduce((acc, item) => acc + item.preciounitario * item.cantidad, 0);

      // REQUERIMINTO FUNCIONAL
      // Gran Total de Productos con Categoría "Smartphone": Suma de los importes totales
      // únicamente para productos de la categoría "Smartphone" (utilizar filter y reduce)
      this.totalSmartphone = orders.filter(item => item.producto.categoria === 'Smartphone')
                            .reduce((acc, item) => acc + item.preciounitario * item.cantidad, 0);
    });
  }
}
customElements.define('purchase-order-list', PurchaseOrderList);
