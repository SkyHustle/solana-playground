import https from "https";

const data = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "getProgramAccounts",
    params: [
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        {
            encoding: "jsonParsed",
            filters: [
                {
                    dataSize: 165,
                },
                {
                    memcmp: {
                        offset: 0,
                        bytes: "7yrcWPayujif46vPFM9TpcqkBL1SnrFHN6pDLN3MbjsB",
                    },
                },
            ],
        },
    ],
});

const options = {
    hostname: "api.devnet.solana.com",
    port: 443,
    path: "/",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
    },
};

const req = https.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
        data += chunk;
    });

    res.on("end", () => {
        console.log(JSON.parse(data));
    });
});

req.on("error", (error) => {
    console.error(error);
});

req.write(data);
req.end();
