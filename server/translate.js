import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const key = '<your-translator-key>';
const endpoint = 'https://centralindia.api.cognitive.microsofttranslator.com';
const location = 'centralindia';

const translateText = async () => {
    try {
        const response = await axios({
            baseURL: endpoint,
            url: '/translate',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                'Ocp-Apim-Subscription-Region': location,
                'Content-Type': 'application/json',
                'X-ClientTraceId': uuidv4(),
            },
            params: {
                'api-version': '3.0',
                from: 'en',
                to: ['fr', 'zu'], 
            },
            data: [
                {
                    text: 'I would really like to drive your car around the block a few times!',
                },
            ],
            responseType: 'json',
        });

        console.log(JSON.stringify(response.data, null, 4));
    } catch (error) {
        console.error('Error during translation:', error.response?.data || error.message);
    }
};

translateText();
