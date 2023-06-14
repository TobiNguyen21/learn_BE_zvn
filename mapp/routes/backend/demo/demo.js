const express = require('express');
const router = express.Router();

const Demo = require('./../../../models/demo');

// router.get("/:id", async (req, res) => {
//     const id = req.params.id;
//     res.send(id);
// })

router.post('/123', async (req, res) => {
    const { name, ordering } = req.body;

    const data = { name: name, ordering: ordering };

    const rs = await Demo.create(data);

    res.send({ rs });
})

router.get("/:begin/:end?", async (req, res) => {
    const begin = +(req.params.begin ? req.params.begin : '0');
    const end = +(req.params.end ? req.params.end : `${begin}`);

    const filter = { ordering: { $gte: begin, $lte: end } };

    const data = await Demo.find(filter);

    res.send({ data });
})

module.exports = router;