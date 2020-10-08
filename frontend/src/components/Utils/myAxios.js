import Axios from "axios";

const myAxios = Axios.create({
	baseURL: "api",
});

export default myAxios;
