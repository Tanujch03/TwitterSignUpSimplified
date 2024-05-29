import fetch from 'node-fetch';
import { oauth } from '../utils/oauth.js';

export async function writeTweet({ token, tokenSecret }, tweet) {
    const authToken = { key: token, secret: tokenSecret };

    const url = 'https://api.twitter.com/2/tweets';
    const headers = oauth.toHeader(oauth.authorize({
        url,
        method: 'POST'
    }, authToken));

    try {
        const request = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ text: tweet }),
            headers: {
                Authorization: headers['Authorization'],
                'user-agent': 'V2CreateTweetJS',
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        });
        const body = await request.json();
        return body;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}