/**
 * Get all data from table in database and create a list for select
 * @param {*} table  Name of table in database
 * @param {*} callback  Function to execute after get data
 */
export const axiosGetAll = (table, callback) => {
  axios.get(`https://calidad.cominvi.com.mx:8880/api/principal/${table}`)
  .then(response => {
    // create sort array where item.estatus === 1
    let items = response.data
    .filter(item => item.estatus === 1)
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

    let itemsForSelect = [];
    if(table === 'producto') {
      // create array [ { value: idproducto, label: nombre } ] for select
      itemsForSelect = items.map((item, idx) => {
        return { label: item.nombre, value: item.idproducto };
      });
    } else if(table === 'usuario') {
      // create array [ { value: idusuario, label: nombre + paterno + materno } ] for select
      itemsForSelect = items.map((item, idx)=> {
        return { 
          label: `${item.nombre || ''} ${item.paterno || ''} ${item.materno || ''}`,
          value: item.idusuario, 
        }
      })
    }
    callback(items, itemsForSelect);
  })
  .catch(error => {
    alert('Problemas al inetntar obtener los datos');
    callback(error);
  });
}

/**
 * Add or Update item in database
 * @param {*} table Name of table in database
 * @param {*} item Data to save
 * @param {*} callback Function to execute after save data
 */
export const axiosPost = (table, item, callback) => {
  // endpoint for save purchase order:
  // https://calidad.cominvi.com.mx:8880/api/principal/(table)
  axios.post(`https://calidad.cominvi.com.mx:8880/api/principal/${table}`, item, {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  .then(response => {
    callback(true);
  })
  .catch(error => {
    alert('Problemas al inetntar obtener los datos');
    callback(false);
  });
}

/**
 * Get all data from table in database (only the data)
 * @param {*} table Name of table in database
 * @param {*} callback Function to execute after get data
 */
export const axiosGetOnlyAll = (table, callback) => {
  // endpoint
  axios.get(`https://calidad.cominvi.com.mx:8880/api/principal/${table}`)
  .then(response => {
    callback(response.data);
  })
  .catch(error => {
    alert('Problemas al inetntar obtener los datos');
    callback(error);
  });
}
