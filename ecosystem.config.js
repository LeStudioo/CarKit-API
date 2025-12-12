module.exports = {
    apps: [
        {
            name: "carkit-api",
            script: "./src/app.ts",
            interpreter: "node",
            node_args: "-r ts-node/register",
            watch: false
        }
    ]
};
