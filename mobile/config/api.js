import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = 'http://unimarket.us-east-1.elasticbeanstalk.com/';

const getToken = async () => {
    const userKey = await AsyncStorage.getItem('userKey');
    try {
        const response = await axios.get(api + 'login/getToken', { headers: { userKey: userKey } });
        return response.data.token;
    } catch (error) {
        console.error(error);
    }
};

export { api, getToken };