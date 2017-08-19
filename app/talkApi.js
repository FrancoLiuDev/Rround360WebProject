module.exports = function(app, io) {
    app.get('/mp4/talk/:mp4key', (req, res) => {
        res.json(true)
        io.emit({
            status: true,
            mp4: req.params.mp4key,
        })
    })

    app.get('/mp4/talk/:mp4key/error', (req, res) => {
        res.json(true)
        io.emit({
            status: false,
            mp4: req.params.mp4key,
        })
    })
}
