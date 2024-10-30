import { useParams } from "react-router-dom";
import Header from "../components/Header";
import ManageProfile from "../components/ManageProfile";



const ManageProfileScreen = () => {

    const {id} = useParams()
    console.log(id);

    return(
        <div>
            <Header />
            <ManageProfile option={id}/>
        </div>
    );
}

export default ManageProfileScreen