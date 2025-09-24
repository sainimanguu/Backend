import { ApiResponse } from '../utils/apiresponse.js';

const healthCheck = (req, res) => {
    try {
        res.status(200).json(
            new ApiResponse(200, { message: "Server is running" })
        )
    } catch (error) {
        console.log("Error", error)
    }
}

export { healthCheck };