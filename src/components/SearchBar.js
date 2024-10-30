import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import '../style/SearchBar.css';
import { Context } from "../context/Context";

const SearchBar = () => {
    const { dispatch } = useContext(Context);

    const handleInputChange = (e) => {
        dispatch({
            type: 'SET_QUERY',
            payload: e.target.value
        });
    };

    return (
        <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input 
                type="text" 
                placeholder="Pesquisar..." 
                onChange={handleInputChange}
            />
        </div>
    );
}

export default SearchBar;
