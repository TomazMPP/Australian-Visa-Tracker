const processingTime = require('../models/processingTime');

const processingTimeController = {
    getAllTimes: async (req, res) => {
        try {
            const times = await processingTime.getAllTimes();
            res.status(200).json(times);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getTimesByVisaType: async (req, res) => {
        try {
            const { visa_type_id } = req.params;
            const { stream_id } = req.query;
            const visaTimes = await processingTime.getTimesByVisaType(visa_type_id, stream_id || null);

            if (!visaTimes) {
                return res.status(404).json({ message: 'Processing times not found' });
            }

            res.status(200).json(visaTimes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getHistoryByVisaType: async (req, res) => {
        try {
            const { visa_type_id } = req.params;
            const { stream_id } = req.query;
            const historyTimes = await processingTime.getHistoryByVisaType(visa_type_id, stream_id || null);

            if (!historyTimes || historyTimes.length === 0) {
                return res.status(404).json({ message: 'No processing time history found' });
            }

            res.status(200).json(historyTimes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    postNewProcessingTime: async (req, res) => {
        try {
            const { visa_type_id, percent_50, percent_90, visa_stream_id } = req.body;

            if (!visa_type_id || percent_50 === undefined || percent_90 === undefined) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const newTime = await processingTime.postNewProcessingTime(
                visa_type_id,
                percent_50,
                percent_90,
                visa_stream_id || null
            );

            res.status(201).json(newTime);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

module.exports = processingTimeController;