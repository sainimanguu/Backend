import { ApiResponse } from '../utils/apiresponse.js';
import { asyncHandler } from '../utils/asynchandler.js';

// const healthCheck = (req, res) => {
//     try {
//         res.status(200).json(
//             new ApiResponse(200, { message: "Server is running" })
//         )
//     } catch (error) {
//         console.log("Error", error)
//     }
// }


const healthCheck = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, { message: "✅Server is still running fine!" }))
})

export { healthCheck };