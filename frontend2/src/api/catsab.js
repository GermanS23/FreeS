import axios from 'axios'

const apiEndpoint = 'http://localhost:3000/api'

const getCatSab = async () => {
  try {
    const res = await axios.get(`${apiEndpoint}/catsab`)
    return res.data
  } catch (error) {
    console.error('Error al obtener la categorias de los sabores')
    throw error;
  }
}

const getCatSabById = async (id) => {
  try {
    const res = await axios.get(`${apiEndpoint}/catsab/${id}`)
    return res.data
  } catch (error) {
    console.error('Error al obtener la categoria de sabor:',error)
  }
}

const createCatSab = async (data) =>{
  try {
    const res = await axios.post(`${apiEndpoint}/catsab`, data)
    return res.data
  } catch (error) {
    console.error('Error al crear la categoria:',error)
    throw error;
  }
}

const updateCatSab = async(id, data) => {
  try {
    const res = await axios.put(`${apiEndpoint}/catsab/${id}`, data)
    return res.data
  } catch (error) {
    console.error('Error al actualizar la categoria:', error)
    throw error;
  }
}

const deleteCatSab = async(id) => {
  try {
    const res = await axios.delete(`${apiEndpoint}/catsab/${id}`)
    return res.data
  } catch (error) {
    console.error('Error al eliminar la categoria:', error)
    throw error;
    
  }
}



export default {
  getCatSab,
  getCatSabById,
  createCatSab,
  updateCatSab,
  deleteCatSab
}
