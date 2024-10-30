import Header from "../components/Header";
import ProductDetails from "../components/ProductDetails";
import { useParams } from 'react-router-dom';

const ProductDetailsScreen = () => {
    const { id } = useParams(); // Obtém o ID do produto da URL

    return (
        <div>
            <Header />
            <ProductDetails productId={id} />
        </div>
    );
}

export default ProductDetailsScreen