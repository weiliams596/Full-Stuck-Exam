const makeRequest = (req, data) => {
    req.requestInfo = data;
}

const validateRequest = (req, res, next) => {
    let request = req.body;
    if (typeof request !== 'object') {
        request = req.query;
        if (typeof request !== 'object')
            return res.status(400).json({ message: "Invalid request format, please provide valid JSON object." });
    } else {
        if (Object.keys(request).length === 0) {
            return res.status(400).json({ message: "Invalid request format, please provide valid JSON object." });
        }
    }
    if (request.price) {
        request.price = parseInt(request.price);
    }
    makeRequest(req, request);
    next();
}

module.exports = validateRequest;