const { generateEG, cryptoKeyToJSON,  } = require("./lib")

wrapper = async () => {
    const egKeys = await generateEG()
    const pubKey = await cryptoKeyToJSON(egKeys.pub)
    // const pubKeyString = JSON.stringify(pubKey)

    console.log(egKeys)
}

// wrapper()
