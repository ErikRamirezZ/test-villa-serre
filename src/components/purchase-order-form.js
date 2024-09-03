import { LitElement, html, css } from 'lit';
import { viewCSS } from '../css.js';
import { axiosGetAll, axiosPost } from '../api-connector/connector.js';

import '@vaadin/button'
import '@vaadin/number-field'
import '@vaadin/select'
import '@vaadin/vertical-layout'

export class PurchaseOrderForm extends LitElement {
  
  static styles = [viewCSS, css`
    :host {
      display: block;
    }
    .total {
      margin-top: 1rem;
      font-weight: bold;
      font-size: 1.5rem;
      text-align: center;
    }
    .btns {
      text-align: center;
    }
    .t-card { width: 350px; }
  `];

  static properties = {
    products: { type: Array },
    total: { type: Number },
    users: { type: Array },
  };

  constructor() {
    super();
    this.products = [];
    this.users = [];
    this.total = 0;
  }

  firstUpdated() {
    this._findUsers();
    this._findProducts();
  }

  // Implementación de un formulario con los siguientes campos:
  // - Lista de usuarios: Un desplegable o campo que permita seleccionar un usuario existente.
  // - Lista de productos: Un desplegable que permita seleccionar un producto
  // - Cantidad
  // - Precio Unitario 
  render() {
    return html`
      <div class="t-card t-margin-t1">
        <vaadin-vertical-layout>
  
          <h2>Orden de Compra</h2>
  
          <!-- User list -->
          <vaadin-select required label="Usuario" id="user">
          </vaadin-select>
          
          <!-- Product list -->
          <vaadin-select required label="Producto" id="product">
          </vaadin-select>
          
          <!-- Quantity -->
          <vaadin-number-field label="Cantidad" id="quantity" required
            @input="${this._total}"></vaadin-number-field>
  
          <!-- Unit Price -->
          <vaadin-number-field label="Precio Unitario" id="unitPrice" required
            @input="${this._total}">
            <span slot="prefix">$</span>
            <span slot="suffix">MXN</span>
          </vaadin-number-field>
  
        </vaadin-vertical-layout>
  
        <!-- Total local currency -->
        <div class="total t-text-align-c">
          Total: ${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(this.total)}
        </div>
  
        <div class="t-margin-t1 t-text-align-c">
          <vaadin-button theme="primary" @click="${this._save}">Guardar</vaadin-button>
          <vaadin-button 
            @click="${() => this.dispatchEvent(new CustomEvent('changeView', {detail : 0}))}">
            Ir a inicio
          </vaadin-button>
        </div>

      </div>
    `;
  }

  /**
   * Get products from API and create a list for select
   */
  _findProducts() {
    axiosGetAll('producto', (products, productsForSelect) => {
      this.products = products;
      // Assign Products to select
      this.shadowRoot.querySelector('#product').items = productsForSelect;
    });
  }


  /**
   * Get users from API and create a list for select
   */
  _findUsers() {
    axiosGetAll('usuario', (users, usersForSelect) => {
      this.users = users;
      // Assign Users to select
      this.shadowRoot.querySelector('#user').items = usersForSelect;
    });
  }

  /**
   * Save purchase order
   */
  _save() {
    let eleUser = this.shadowRoot.querySelector('#user');
    let eleProduct = this.shadowRoot.querySelector('#product');
    let eleQuantity = this.shadowRoot.querySelector('#quantity');
    let eleUnitPrice = this.shadowRoot.querySelector('#unitPrice');

    // REQUERIMIENTOS TÉCNICOS ADICIONALES 
    // 3.1 Validaciones Frontend 
    if (!eleUser.validate() || !eleProduct.validate() || !eleQuantity.validate() || !eleUnitPrice.validate()) {
      // REQUERIMIENTOS TÉCNICOS ADICIONALES 
      // 3.5 Manejo de Errores en Frontend 
      return alert('Todos los campos son requeridos');
    }

    // get quantity value
    let quantity = eleQuantity.value;
    // convert quantity to number
    quantity = parseInt(quantity);

    // get unit price value
    let unitPrice = eleUnitPrice.value;
    // convert unit price to number
    unitPrice = parseFloat(unitPrice);

    const newOrder = {
      usuario: this.users[eleUser.value],
      producto: this.products[eleProduct.value],
      cantidad: quantity,
      preciounitario: unitPrice,
      fecha: new Date().toISOString().split('T')[0],
    };
    
    axiosPost('orden', newOrder, (response) => {
      if(response) {
        this.dispatchEvent(new CustomEvent('changeView', {detail : 2}))
        alert('Orden de compra guardada correctamente');
      } else {
        alert('Error al guardar la orden de compra');
      }
    });
  }

  _total() {
    let quantity = this.shadowRoot.querySelector('#quantity').value;
    let unitPrice = this.shadowRoot.querySelector('#unitPrice').value;
    this.total = quantity * unitPrice;
  }

}
customElements.define('purchase-order-form', PurchaseOrderForm);
