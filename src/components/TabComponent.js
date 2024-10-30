import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import React, { useState, useContext, useEffect } from 'react';
import { AppBar, Tabs, Tab, Box, Select, MenuItem, FormControl, InputLabel, Toolbar } from '@mui/material';
import ProductsComponent from './ProductsComponent';
import { Context } from '../context/Context';

const TabComponent = () => {
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [brand, setBrand] = useState('');
  const [clothingType, setClothingType] = useState('');
  const [color, setColor] = useState('');
  const { state, dispatch } = useContext(Context);
  const [availableBrands, setAvailableBrands] = useState([]);

  // Função para buscar marcas únicas
  const fetchAvailableBrands = async () => {
    try {
      const response = await fetch('http://localhost:5190/api/products');
      if (!response.ok) throw new Error('Erro ao buscar produtos');
      const products = await response.json();
      
      // Filtrar produtos pela categoria atual (Eletrónicos ou Roupa)
      const filteredProducts = products.filter(product => 
        product.category === 'Eletrónicos' || product.category === 'Roupa'
      );

      // Extrair marcas únicas
      const uniqueBrands = [...new Set(filteredProducts
        .map(product => product.brand)
        .filter(brand => brand && brand !== '') // Remove valores vazios ou null
      )].sort(); // Ordenar alfabeticamente

      setAvailableBrands(uniqueBrands);
    } catch (error) {
      console.error('Erro ao buscar marcas:', error);
    }
  };

  // Chamar a função quando o componente montar e quando a categoria mudar
  useEffect(() => {
    if (category === 'Eletrónicos' || category === 'Roupa') {
      fetchAvailableBrands();
    }
  }, [category]);

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    dispatch({ type: 'SET_CATEGORY', payload: newCategory });
    setCategory(newCategory);
    // Resetar filtros relacionados quando mudar a categoria
    if (newCategory !== 'Roupa') {
      setClothingType('');
      setColor('');
    }
    if (newCategory !== 'Eletrónicos' && newCategory !== 'Roupa') {
      setBrand('');
    }
  };

  const handleStatusChange = (event) => {
    dispatch({ type: 'SET_STATUS', payload: event.target.value });
    setStatus(event.target.value);
  };

  const handleBrandChange = (event) => {
    dispatch({ type: 'SET_BRAND', payload: event.target.value });
    setBrand(event.target.value);
  };

  const handleClothingTypeChange = (event) => {
    dispatch({ type: 'SET_CLOTHING_TYPE', payload: event.target.value });
    setClothingType(event.target.value);
  };

  const handleColorChange = (event) => {
    dispatch({ type: 'SET_COLOR', payload: event.target.value });
    setColor(event.target.value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: '#f0e6d6',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderRadis: '0 0 15px 15px',
          padding: '20px 0'
        }} 
        elevation={0}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-start', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: 2,
          padding: '10px 30px',
          '& .MuiFormControl-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '10px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }
          }
        }}>
          <FormControl sx={{ 
            minWidth: { xs: '100%', sm: '200px' },
            flex: { xs: '1 1 100%', sm: '1 1 auto' }
          }}>
            <InputLabel id="category-label" sx={{ 
              color: '#1c2b16', 
              '&.Mui-focused': { 
                color: '#688046',
                fontWeight: 'bold'
              }
            }}>
              Categoria
            </InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Categoria"
              onChange={handleCategoryChange}
              sx={{
                color: '#1c2b16',
                '.MuiOutlinedInput-notchedOutline': { 
                  borderColor: 'rgba(28, 43, 22, 0.2)',
                  transition: 'all 0.3s ease'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': { 
                  borderColor: '#688046'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                  borderColor: '#688046'
                },
                '.MuiSvgIcon-root': { 
                  color: '#688046'
                }
              }}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Eletrónicos">Eletrónicos</MenuItem>
              <MenuItem value="Roupa">Roupa</MenuItem>
              <MenuItem value="Casa">Casa</MenuItem>
              <MenuItem value="Livros">Livros</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ 
            minWidth: { xs: '100%', sm: '200px' },
            flex: { xs: '1 1 100%', sm: '1 1 auto' }
          }}>
            <InputLabel id="status-label" sx={{ 
              color: '#1c2b16',
              '&.Mui-focused': { 
                color: '#688046',
                fontWeight: 'bold'
              }
            }}>
              Estado
            </InputLabel>
            <Select
              labelId="status-label"
              value={status}
              label="Estado"
              onChange={handleStatusChange}
              sx={{
                color: '#1c2b16',
                '.MuiOutlinedInput-notchedOutline': { 
                  borderColor: 'rgba(28, 43, 22, 0.2)',
                  transition: 'all 0.3s ease'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': { 
                  borderColor: '#688046'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                  borderColor: '#688046'
                },
                '.MuiSvgIcon-root': { 
                  color: '#688046'
                }
              }}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Novo com Etiqueta">Novo com Etiqueta</MenuItem>
              <MenuItem value="Novo sem Etiqueta">Novo sem Etiqueta</MenuItem>
              <MenuItem value="Muito Bom">Muito Bom</MenuItem>
              <MenuItem value="Bom">Bom</MenuItem>
              <MenuItem value="Satisfatório">Satisfatório</MenuItem>
            </Select>
          </FormControl>

          {(category === 'Eletrónicos' || category === 'Roupa') && (
            <FormControl sx={{ 
              minWidth: { xs: '100%', sm: '200px' },
              flex: { xs: '1 1 100%', sm: '1 1 auto' }
            }}>
              <InputLabel id="brand-label" sx={{ 
                color: '#1c2b16',
                '&.Mui-focused': { 
                  color: '#688046',
                  fontWeight: 'bold'
                }
              }}>
                Marca
              </InputLabel>
              <Select
                labelId="brand-label"
                value={brand}
                label="Marca"
                onChange={handleBrandChange}
                sx={{
                  color: '#1c2b16',
                  '.MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(28, 43, 22, 0.2)',
                    transition: 'all 0.3s ease'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': { 
                    borderColor: '#688046'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                    borderColor: '#688046'
                  },
                  '.MuiSvgIcon-root': { 
                    color: '#688046'
                  }
                }}
              >
                <MenuItem value="Todos">Todas</MenuItem>
                {availableBrands.map((brandName) => (
                  <MenuItem key={brandName} value={brandName}>
                    {brandName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {category === 'Roupa' && (
            <>
              <FormControl sx={{ 
                minWidth: { xs: '100%', sm: '200px' },
                flex: { xs: '1 1 100%', sm: '1 1 auto' }
              }}>
                <InputLabel id="clothing-type-label" sx={{ 
                  color: '#1c2b16',
                  '&.Mui-focused': { 
                    color: '#688046',
                    fontWeight: 'bold'
                  }
                }}>
                  Tipo
                </InputLabel>
                <Select
                  labelId="clothing-type-label"
                  value={clothingType}
                  label="Tipo"
                  onChange={handleClothingTypeChange}
                  sx={{
                    color: '#1c2b16',
                    '.MuiOutlinedInput-notchedOutline': { 
                      borderColor: 'rgba(28, 43, 22, 0.2)',
                      transition: 'all 0.3s ease'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': { 
                      borderColor: '#688046'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                      borderColor: '#688046'
                    },
                    '.MuiSvgIcon-root': { 
                      color: '#688046'
                    }
                  }}
                >
                  <MenuItem value="Todos">Todos</MenuItem>
                  <MenuItem value="Homem">Homem</MenuItem>
                  <MenuItem value="Mulher">Mulher</MenuItem>
                  <MenuItem value="Criança-M">Criança (Masculino)</MenuItem>
                  <MenuItem value="Criança-F">Criança (Feminino)</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ 
                minWidth: { xs: '100%', sm: '200px' },
                flex: { xs: '1 1 100%', sm: '1 1 auto' }
              }}>
                <InputLabel id="color-label" sx={{ 
                  color: '#1c2b16',
                  '&.Mui-focused': { 
                    color: '#688046',
                    fontWeight: 'bold'
                  }
                }}>
                  Cor
                </InputLabel>
                <Select
                  labelId="color-label"
                  value={color}
                  label="Cor"
                  onChange={handleColorChange}
                  sx={{
                    color: '#1c2b16',
                    '.MuiOutlinedInput-notchedOutline': { 
                      borderColor: 'rgba(28, 43, 22, 0.2)',
                      transition: 'all 0.3s ease'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': { 
                      borderColor: '#688046'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                      borderColor: '#688046'
                    },
                    '.MuiSvgIcon-root': { 
                      color: '#688046'
                    }
                  }}
                >
                  <MenuItem value="Todos">Todas</MenuItem>
                  <MenuItem value="Preto">Preto</MenuItem>
                  <MenuItem value="Branco">Branco</MenuItem>
                  <MenuItem value="Azul">Azul</MenuItem>
                  <MenuItem value="Vermelho">Vermelho</MenuItem>
                  <MenuItem value="Verde">Verde</MenuItem>
                  <MenuItem value="Amarelo">Amarelo</MenuItem>
                  <MenuItem value="Rosa">Rosa</MenuItem>
                  <MenuItem value="Roxo">Roxo</MenuItem>
                  <MenuItem value="Multicolor">Multicolor</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </Box>
      </AppBar>

      <Routes>
        <Route path="/" element={
          <ProductsComponent 
            category={category} 
            status={status}
            brand={brand}
            clothingType={clothingType}
            color={color}
          />
        } />
      </Routes>
    </Box>
  );
}

export default TabComponent;
