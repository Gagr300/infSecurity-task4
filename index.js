const express = require('express')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 4444
const authRouter = require('./authRouter')

const app = express()

app.use(express.json())
app.use("/task", authRouter)

const start = async () => {
    try {
        await mongoose.connect(`...`)
        app.listen(PORT, () => console.log(`server sterted on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}


start()
