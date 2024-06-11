const cron = require("node-cron");
const axios = require("axios");

cron.schedule('*/14 * * * *', () => {
    axios.get(`${process.env.API_URL}/api/health`).then(res => {
        console.log(`Server up time: ${res.data.uptime}`);
        console.log(`Checked on : ${res.data.date}`);
    }).catch(err => {
        console.log("Error on health api call");
    });
});